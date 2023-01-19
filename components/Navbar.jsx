import React from 'react';
import Link from 'next/link';
import { AiOutlineShopping } from 'react-icons/ai';
import { Cart } from './';
import { useStateContext } from '../context/StateContext';


const Navbar = () => {

  const { showCart, setShowCart, totalQuantities } = useStateContext();

  return (
    <div className="navbar-container" >

    {/* <img className='big-logo' src='/imageAssets/petrolnautSound.png' alt='logo' /> */}
      <p className='logo'>
      
        <Link href='/'>
        
        Beat Heaven
        </Link>
      </p>

      <button type='button' className='cart-icon' onClick={() => setShowCart(true)}>
        <AiOutlineShopping />
        <span className='cart-item-qty'>{totalQuantities}</span>
      </button>

      {/* //only show cart when showcart is set to true */}
      {showCart && <Cart />}
    </div>
  )
}

export default Navbar