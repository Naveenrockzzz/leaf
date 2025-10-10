import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createOrder, clearCart } from "../../../feature/leafSlice";
import { fetchUserData } from "../../../helper/helper";

const PaymentOptions = ({ currency }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.leaf);

  const [paymentRequest, setPaymentRequest] = useState(null);
  const [canUseGPay, setCanUseGPay] = useState(false);
  const [paymentIntent, setPaymentIntent] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const PAYMENT_SERVICE_URL = import.meta.env.VITE_PAYMENT_SERVICE_URL;
        const { data } = await axios.post(
          `${PAYMENT_SERVICE_URL}/create-payment-intent`,
          {
            currency,
            amount: 50000,
          }
        );
        setPaymentIntent(data?.clientSecret);
      } catch (error) {
        // Handle error silently or show user-friendly message
      }
    };

    if (currency) createPaymentIntent();
  }, [currency]);

  useEffect(() => {
    if (!stripe || !currency) return;

    const pr = stripe.paymentRequest({
      country: "IN",
      currency,
      total: {
        label: "Total Amount",
        amount: 50000,
      },
      requestPayerName: true,
      requestPayerEmail: true,
    });

    pr.canMakePayment().then((result) => {
      if (result) {
        setPaymentRequest(pr);
        setCanUseGPay(true);
      }
    });
  }, [stripe, currency]);

  const handleCODOrder = async () => {
    setIsProcessing(true);
    
    try {
      const userData = fetchUserData();
      const selectedAddress = JSON.parse(localStorage.getItem('selectedAddress') || '{}');
      
      if (!selectedAddress.documentId) {
        toast.error("Please select a delivery address");
        setIsProcessing(false);
        return;
      }

      // Calculate totals
      const itemsPrice = cart.reduce((acc, item) => {
        const price = parseFloat(item.OrigialPrice || item.discountPrice || 0);
        const quantity = item.quantity || 1;
        return acc + (price * quantity);
      }, 0);

      const deliveryPrice = 50;
      const tax = itemsPrice * 0.18;
      const totalPrice = itemsPrice + deliveryPrice + tax;

      // Prepare order data for COD
      const orderData = {
        user: userData.id,
        address: selectedAddress.documentId,
        orderItems: cart.map(item => ({
          product: item.documentId,
          title: item.title,
          quantity: item.quantity || 1,
          price: parseFloat(item.OrigialPrice || item.discountPrice || 0),
          image: item.image?.[0]?.url || ''
        })),
        paymentInfo: {
          method: 'cash_on_delivery',
          status: 'pending'
        },
        itemsPrice: itemsPrice.toFixed(2),
        deliveryPrice: deliveryPrice.toFixed(2),
        tax: tax.toFixed(2),
        totalPrice: totalPrice.toFixed(2),
        status: 'pending',
        paymentStatus: 'unpaid',
        deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      };

      // Create order
      await dispatch(createOrder(orderData)).unwrap();
      
      // Clear cart
      dispatch(clearCart());
      localStorage.removeItem('selectedAddress');
      
      toast.success("Order placed successfully! Pay on delivery.");
      navigate("/profile?tab=orders");
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements || !paymentIntent) {
      toast.error("Stripe is not ready. Please try again.");
      return;
    }

    setIsProcessing(true);
    const cardElement = elements.getElement(CardElement);

    try {
      const { error, paymentIntent: confirmedPaymentIntent } =
        await stripe.confirmCardPayment(paymentIntent, {
          payment_method: { card: cardElement },
        });

      if (error) {
        toast.error(`Payment failed: ${error.message}`);
      } else if (confirmedPaymentIntent?.status === "succeeded") {
        // Payment successful - now create the order
        const userData = fetchUserData();
        const selectedAddress = JSON.parse(localStorage.getItem('selectedAddress') || '{}');
        
        if (!selectedAddress.documentId) {
          toast.error("Please select a delivery address");
          return;
        }

        // Calculate totals
        const itemsPrice = cart.reduce((acc, item) => {
          const price = parseFloat(item.OrigialPrice || item.discountPrice || 0);
          const quantity = item.quantity || 1;
          return acc + (price * quantity);
        }, 0);

        const deliveryPrice = 50; // You can calculate this based on location
        const tax = itemsPrice * 0.18; // 18% GST
        const totalPrice = itemsPrice + deliveryPrice + tax;

        // Prepare order data
        const orderData = {
          user: userData.id,
          address: selectedAddress.documentId,
          orderItems: cart.map(item => ({
            product: item.documentId,
            title: item.title,
            quantity: item.quantity || 1,
            price: parseFloat(item.OrigialPrice || item.discountPrice || 0),
            image: item.image?.[0]?.url || ''
          })),
          paymentInfo: {
            paymentId: confirmedPaymentIntent.id,
            status: confirmedPaymentIntent.status,
            method: 'stripe',
            paidAt: new Date().toISOString()
          },
          itemsPrice: itemsPrice.toFixed(2),
          deliveryPrice: deliveryPrice.toFixed(2),
          tax: tax.toFixed(2),
          totalPrice: totalPrice.toFixed(2),
          status: 'processing',
          paymentStatus: 'paid',
          deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
        };

        // Create order in backend
        await dispatch(createOrder(orderData)).unwrap();
        
        // Clear cart
        dispatch(clearCart());
        localStorage.removeItem('selectedAddress');
        
        toast.success("Order placed successfully!");
        navigate("/profile?tab=orders");
      }
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full md:w-3/4 m-auto py-6 px-4 space-y-4">
      {/* Debit & Credit Card */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Debit / Credit Card</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <form onSubmit={handleSubmit}>
            <CardElement options={{ hidePostalCode: true }} />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Pay with Card"}
            </Button>
          </form>
        </AccordionDetails>
      </Accordion>

      {/* Google Pay */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Google Pay</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {canUseGPay && paymentRequest ? (
            <Button
              variant="contained"
              color="success"
              onClick={() => paymentRequest.show()}
            >
              Pay with Google Pay
            </Button>
          ) : (
            <Typography>Google Pay is not available</Typography>
          )}
        </AccordionDetails>
      </Accordion>

      {/* Net Banking */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Net Banking</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TextField
            fullWidth
            label="Enter Bank Name"
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <Button variant="contained" color="primary">
            Pay via Net Banking
          </Button>
        </AccordionDetails>
      </Accordion>

      {/* Cash on Delivery */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Cash on Delivery</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div className="space-y-4">
            <Typography>Pay with cash when your order is delivered</Typography>
            <Button 
              variant="contained" 
              color="secondary"
              onClick={handleCODOrder}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Confirm Order (COD)"}
            </Button>
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default PaymentOptions;
