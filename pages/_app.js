import React from 'react';
import { Layout } from '../components';
import { StateContext } from '../context/StateContext'; //we need to pass the data from StateContext to every single component inside of it.
import { Toaster } from 'react-hot-toast';

import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <StateContext> 
      <Layout>
        <Toaster />
        <Component {...pageProps} />
      </Layout>
    </StateContext>

  )
}

export default MyApp
