import React, { useState, useEffect, useContext, createContext } from 'react';
import { toast } from 'react-hot-toast';

const Context = createContext();

//getting the {children} prop means that whenever we call our state context, anything that we pass in to it will be considered children, which will allow us to render it. 
// <State> {children} </State>
export const StateContext = ({ children }) => {

  const [showCart, setShowCart] = useState(false);
  //this lets us know what items are in our cart
  const [cartItems, setCartItems] = useState([]);
  //keeps track of total price 
  const [totalPrice, setTotalPrice] = useState(0);
  //keeps track of total quantity
  const [totalQuantities, setTotalQuantities] = useState(0);
  //individual item quantity
  const [qty, setQty] = useState(1);

  let foundProduct; //product we want to update
  let index; //index of product we want to update

  // --- Add Item to Cart --- //
  // first checks if item is already in the cart. 
  // 'product' is the product we want to add to the cart. 'quantity' is the quantity of the product we want to add to the cart.
  // we use cartItem state, loop over the cart items and get the individual item. We check if the item._id is the same as the product._id.
  const onAdd = (product, quantity) => {
    const checkProductInCart = cartItems.find((item) => item._id === product._id);

    //first we update the states
    setTotalPrice((prevTotalPrice) => prevTotalPrice + product.price * quantity);
    setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + quantity);

    // If Product Already Exists in Cart //
    // if already exists, we want to update the quantity/price of the cart.
    if (checkProductInCart) {
      //then we update the cartItems. We map over our current cartItems, get each individual item, and if the cartProduct._id is the same as the product._id, we update the quantity and price.
      const updatedCartItems = cartItems.map((cartProduct) => {
        if (cartProduct._id === product._id) return {
          ...cartProduct,
          quantity: cartProduct.quantity + quantity
        }
      })

      setCartItems(updatedCartItems);
    } else {
      //if the product is not in the cart, we add it to the cart.
      product.quantity = quantity;

      //we set the cart items to be an empty array, where we spread all the existing cart items, then we add an object where we spread our new product (with the updated quantity)
      setCartItems([...cartItems, { ...product }]);
    }      
    toast.success(`${qty} ${product.name} added to cart!`);
  }

  // --- Remove Item from Cart --- //
  const onRemove = (product) => {
    //find product we are updating
    foundProduct = cartItems.find((item) => item._id === product._id);

    //copy cartItems to create a new cartItems array without the product we want to remove
    const newCartItems = cartItems.filter((item) => item._id !== product._id);

    setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price * foundProduct.quantity);

    setTotalQuantities((prevTotalQuantities) => prevTotalQuantities - foundProduct.quantity);

    setCartItems(newCartItems);
  }

  const toggleCartItemQuantity = (id, value) => {
    foundProduct = cartItems.find((item) => item._id === id); //finds item

    index = cartItems.findIndex((product) => product._id === id); //gets us the index of the item we want to update in the cartItems array.

    //We use this filter to keep all of the items besides the one we are updating.
    //keeps ones where id is not == id
    const newCartItems = cartItems.filter((item) => item._id !== id);

    if(value === 'increment') {
      //We update the cart items with the current cart items, and add one new element to it. We spread the properties of that product and increase the quantity by 1.
      setCartItems([...newCartItems, { ...foundProduct, quantity: foundProduct.quantity + 1 }]);

      //We update the total price by adding the price of the product to the current total price.
      setTotalPrice((prevTotalPrice) => prevTotalPrice + foundProduct.price);

      //We update the total quantity by adding the quantity of the product to the current total quantity.
      setTotalQuantities(prevTotalQuantities => prevTotalQuantities + 1); // remove ()

    } else if(value === 'decrement') {
      if (foundProduct.quantity > 1) {
        
        setCartItems([...newCartItems, { ...foundProduct, quantity: foundProduct.quantity - 1 }]);
        
        setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price);

        setTotalQuantities(prevTotalQuantities => prevTotalQuantities - 1); // remove ()
      }
    }
  }


  const increaseQty = () => {
    setQty((previousQty) => previousQty + 1);
  }

  const decreaseQty = () => {
    setQty((previousQty) => {
      //if the quantity is 1, we dont want to decrease it because we cant go lower than 1.
      if (previousQty - 1 < 1) return 1;

      //else if that's not the case, we just decrease the quantity by 1.
      return previousQty - 1;
    });
  }

  // We are not rendering anything, simply wrapping everything with our context provider. 
  // We pass some values to it. The object of values we pass across the entire application
  return (
    <Context.Provider
      value={{
        showCart,
        setShowCart,
        cartItems,
        totalPrice,
        totalQuantities,
        qty,
        increaseQty,
        decreaseQty,
        onAdd,
        toggleCartItemQuantity,
        onRemove,
        setCartItems,
        setTotalPrice,
        setTotalQuantities,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const useStateContext = () => useContext(Context); 