import React, { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentOptions from "./payment-options";
import useGeoLocation from "react-ipgeolocation";
import axios from "axios";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export const Payment = () => {
  const location = useGeoLocation();
  const [currency, setCurrency] = useState(null);
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
      // Handle error silently or show user-friendly message
    }
  };

  useEffect(() => {
    if (location.country) {
      fetchCountryCurrency();
    }
  }, [location]);

  return (
    <div className=" bg-[#f5f5f5] w-full flex gap-2">
      <Elements stripe={stripePromise}>
        <PaymentOptions currency={currency} />
      </Elements>
    </div>
  );
};
