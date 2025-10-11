import React, { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentOptions from "./payment-options";
import useGeoLocation from "react-ipgeolocation";
import axios from "axios";

export const Payment = () => {
  const location = useGeoLocation();
  const [currency, setCurrency] = useState("inr");
  const [stripePromise, setStripePromise] = useState(null);
  const [stripeError, setStripeError] = useState(false);

  // Try to load Stripe, but continue even if it fails
  useEffect(() => {
    const initStripe = async () => {
      try {
        const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
        if (stripeKey && stripeKey !== 'undefined' && stripeKey !== 'your_stripe_publishable_key') {
          const stripe = await loadStripe(stripeKey);
          if (stripe) {
            setStripePromise(stripe);
          } else {
            console.warn('Stripe initialization failed - COD only');
            setStripeError(true);
          }
        } else {
          console.warn('Stripe key not configured - COD only');
          setStripeError(true);
        }
      } catch (error) {
        console.warn('Stripe load error - COD only:', error);
        setStripeError(true);
      }
    };
    initStripe();
  }, []);

  const fetchCountryCurrency = async () => {
    try {
      const res = await axios.get(
        `https://restcountries.com/v3.1/alpha/${location.country}`
      );

      if (res.data && res.data.length > 0) {
        const currencyCode = Object.keys(res.data[0].currencies)[0];
        setCurrency(currencyCode.toLowerCase());
      }
    } catch (error) {
      // Handle error silently - default to INR
      setCurrency("inr");
    }
  };

  useEffect(() => {
    if (location.country) {
      fetchCountryCurrency();
    }
  }, [location]);

  // If Stripe failed or not configured, render payment options without Stripe
  if (stripeError) {
    return (
      <div className="bg-[#f5f5f5] w-full flex gap-2">
        <PaymentOptions currency={currency} stripeDisabled={true} />
      </div>
    );
  }

  // If Stripe is ready, use Elements wrapper
  return (
    <div className="bg-[#f5f5f5] w-full flex gap-2">
      {stripePromise ? (
        <Elements stripe={stripePromise}>
          <PaymentOptions currency={currency} stripeDisabled={false} />
        </Elements>
      ) : (
        <div className="w-full text-center py-8">Loading payment options...</div>
      )}
    </div>
  );
};
