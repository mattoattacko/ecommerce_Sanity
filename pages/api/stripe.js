// This is our Stripe server-side file.
import Stripe from 'stripe';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

//we create our handler
export default async function handler(req, res) {
  if (req.method === 'POST') {

    console.log(req.body);

    //creates our params object
    try {
      const params = {
        submit_type: 'pay',
        mode: 'payment',
        payment_method_types: ['card'],
        billing_address_collection: 'auto',
        shipping_options: [
          { shipping_rate: 'shr_1KtkURGXX6oQkaTdl1Rep5IS'},
          { shipping_rate: 'shr_1KtkVJGXX6oQkaTdcaPZqWri'},
        ],
        //we do this because we need to modify each specific item to provide added information
        line_items: req.body.map((item) => {
          const img = item.image[0].asset._ref; //this is the Sanity image url reference
          const newImage = img.replace('image-', 'https://cdn.sanity.io/images/uefjiwmd/production/').replace('-webp', '.webp'); //this is the actual image url. Replace '-webp' with '-jpg' or '-png' if necessary

          //returns an object that represents one of our items
          return {
            price_data: {
              currency: 'usd',
              product_data: {
                name: item.name,
                images: [newImage],
              },
              unit_amount: item.price * 100, //convert to cents
            },
            adjustable_quantity: {
              enabled: true,
              minimum: 1,
            },
            quantity: item.quantity,
          }
        }),
        
        success_url: `${req.headers.origin}/success`,
        cancel_url: `${req.headers.origin}/canceled`,
      }

      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create(params);
      
      res.status(200).json(session); //send the session back to the client

    } catch (err) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}

//to do: which products have the users selected in the application?
//we then take those and use them as list items in params.

//how do we get the list items (line_items) from the cartItems? How do we know what the user has added to the cart? 
// once the user clicks the payment button, we need to pass that data to our NextJS backend. 
// we do this by going into the cart.js and working on the button 