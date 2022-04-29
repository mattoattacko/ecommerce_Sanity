import React, { useRef } from 'react';
import Link from 'next/link';
import { AiOutlineMinus, AiOutlinePlus, AiOutlineLeft, AiOutlineShopping } from 'react-icons/ai';
import { TiDeleteOutline } from 'react-icons/ti';
import toast from 'react-hot-toast';

import { useStateContext } from '../context/StateContext';
import { urlFor } from '../lib/client';


const Cart = () => {
  //reference to our cart
  const cartRef = useRef();

  //data from our context
  const { totalPrice, totalQuantities, cartItems, setShowCart, toggleCartItemQuantity, onRemove } = useStateContext();

  return (
    <div className="cart-wrapper" ref={cartRef}>
      <div className="cart-container">
        <button
          type="button"
          className="cart-heading"
          onClick={() => setShowCart(false)} // "(!setShowCart)" is the same as "setShowCart(false)" but thats not true?? Why doesnt this work?
        >
          <AiOutlineLeft />
          <span className="heading">
            Your Cart
          </span>
          <span className='cart-num-items'>
            ({totalQuantities} items)
          </span>
        </button>

        {/* if cartItems is empty, show this */}
        {cartItems.length < 1 && (
          <div className='empty-cart'>
            <AiOutlineShopping size={150} />
            <h3>Your Shopping Cart is Empty</h3>
            <Link href='/'>
              <button
                type="button"
                onClick={() => setShowCart(false)}
                className='btn'
              >
                Continue Shopping
              </button>
            </Link>
          </div>
        )}

        {/* if cartItems is not empty, show this */}
        <div className='product-container'>
          {cartItems.length >= 1 && cartItems.map((item, index) => (
            <div className='product' key={index._id}>
              <img src={urlFor(item?.image[0])}
                className='cart-product-image'
              />
              {/* we get the first products image, and add the class */}
              <div className='item-desc'>
                <div className='flex top'>
                  <h5>
                    {item.name}
                  </h5>
                  <h4>
                    ${item.price}
                  </h4>
                </div>
                <div className='flex bottom'>
                  <div>
                    <p className='quantity-desc'>                  
                      <span className='minus' onClick={() => toggleCartItemQuantity(item._id, 'decrement')}>
                        <AiOutlineMinus />
                      </span>
                      <span className='num' onClick=''>
                        {item.quantity}
                      </span>
                      <span className='plus' onClick={() => toggleCartItemQuantity(item._id, 'increment')}>
                        <AiOutlinePlus />
                      </span>
                    </p>                    
                  </div>
                  <button
                    type="button"
                    className='remove-item'
                    onClick={() => onRemove(item)}
                  >
                    <TiDeleteOutline />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Subtotal Display */}
        {cartItems.length >= 1 && (
          <div className='cart-bottom'>
            <div className='total'>
              <h3>Subtotal:</h3>
              <h3>${totalPrice}</h3>
            </div>

            <div className='btn-container'>
              <button 
                type="button" 
                className='btn'
                onClick=''
              >
                Checkout with stripe
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default Cart