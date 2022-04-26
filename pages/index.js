import React from 'react'
import { client } from '../lib/client';
import { Product, FooterBanner, HeroBanner } from '../components'

const Home = ({ products, bannerData }) => (
  <div>
    {/* If bannerData.length exists, then we want to pass (&&) the bannerData to the HeroBanner component. It's bannerData[0] because we want the first object in the array */}
    <HeroBanner heroBanner={bannerData.length && bannerData[0]} />

    <div className="products-heading" >
      <h2>
        Best Selling Products
      </h2>
      <p>
        So many types of audio equipment
      </p>
    </div>

    <div className='products-container'>
      {products?.map((product) => <Product key={product.id} product={product} />)}
    </div>

    {/* If bannerData exists, pass in the first instance of it */}
    <FooterBanner footerBanner={bannerData && bannerData[0]} />
  </div>
);

export const getServerSideProps = async () => {
  // first we form a sanity query 
  // We grab all of the 'products' from our Sanity dashboard
  const query = '*[_type == "product"]'
  const products = await client.fetch(query);

  // Same as above except for the banner data
  const bannerQuery = '*[_type == "banner"]';
  const bannerData = await client.fetch(bannerQuery);

  return {
    props: { products, bannerData }
  }

  // we then send this data as props to the Home component
}


export default Home;