"use client";

import { Button } from "@/components/ui/button";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState } from "react";

export function CheckoutForm({ orderId }: { orderId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!stripe || !elements) return;
    setIsLoading(true);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/success-payment?orderId=${orderId}`,
      },
    });
    if (error) {
      console.error(error);
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <Button
        size="lg"
        className="my-5 w-full h-10 bg-electric-indigo text-white font-bold uppercase tracking-widest text-xs gap-3 shadow-lg shadow-electric-indigo/20"
        type="submit"
        disabled={isLoading || !stripe || !elements}
      >
        Thanh toán
      </Button>
    </form>
  );
}
