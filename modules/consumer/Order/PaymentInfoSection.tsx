"use client";

import { motion } from "motion/react";
import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatOrderPrice } from "./orderFormat";
import { useEffect, useState } from "react";
import { createPaymentIntent } from "@/services/orders";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { CheckoutForm } from "./CheckoutForm";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

type Props = {
  orderId: string;
  setActivePayment: (active: boolean) => void;
  activePayment: boolean;
};

export function PaymentInfoSection({ orderId, setActivePayment, activePayment }: Props) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getClientSecret = async () => {
      const response = await createPaymentIntent(orderId);
      if (response.error || !response.data) return;
      setClientSecret(response.data.clientSecret);
    };

    getClientSecret().finally(() => setLoading(false));
  }, [orderId]);

  if (loading) return <div>Loading...</div>;

  if (!clientSecret) return <div>Client secret not found</div>;

  return (
    <motion.div
      animate={{ scale: activePayment ? [1, 1.05, 1] : 1, rotate: activePayment ? [0, 5, -2, 0] : 0 }}
      onAnimationComplete={() => setActivePayment(false)}
      transition={{ duration: 0.3 }}
    >
      <Elements
        stripe={stripePromise}
        options={{ clientSecret: clientSecret, locale: "vi" }}
      >
        <CheckoutForm orderId={orderId} />
      </Elements>
    </motion.div>
  );
}
