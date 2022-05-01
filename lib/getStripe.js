//instance of a Stripe promise

import { loadStripe } from '@stripe/stripe-js';

let stripePromise;  //stripePromise is a global variable. undefined at start.

// if the Stripe promise doesn't yet exist, set it to the loadStripe function.
const getStripe = () => {
  if(!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
  }

  return stripePromise;
}

export default getStripe;