import React, { useState } from 'react';
import { AiOutlineMinus, AiOutlinePlus, AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { Product } from '../../components';
import { client, urlFor } from '../../lib/client'
import { useStateContext } from '../../context/StateContext';

const ProductDetails = ({ product, products }) => {

  const { image, name, details, price } = product; //this way we don't have to repeat ourselves over and over with things like product.image, product.name, product.etc etc

  const [index, setIndex] = useState(0); //we want to look at the first image

  const { qty, increaseQty, decreaseQty, onAdd, setShowCart } = useStateContext();
  
  //Handles our Buy Now button
  const handleBuyNow = () => {
    onAdd(product, qty);

    setShowCart(true);
  }

  return (
    <div>
      <div className="product-detail-container">
        <div>
          <div className='image-container'>
            <img
              src={urlFor(image && image[index])}
              className='product-detail-image'
            />
          </div>

          {/* Image Carousel */}
          <div className='small-images-container'>
            {image?.map((item, i) => (
              <img 
                key={i}
                src={urlFor(item)}
                //if the current index is = to the index we want to see in detail, then we provide a small-image and selected-image class names. Else we just provide the small image.
                className={i === index ? 'small-image selected-image' : 'small-image'}
                onMouseEnter={() => setIndex(i)}
              />
            ))}
          </div>
        </div>

        <div className='product-detail-desc'>
          <h1>
            {name}
          </h1>
          <div className='reviews'>
            <div>
              <AiFillStar />
              <AiFillStar />
              <AiFillStar />
              <AiFillStar />
              <AiOutlineStar />
            </div>

            <p>
              (20)
            </p>
          </div>

          <h4>
            Details:
          </h4>
          <p>
            {details}
          </p>
          <p className='price'>
            ${price}
          </p>

          <div className='quantity'>
            <h3>
              Quantity:
            </h3>

            <p className='quantity-desc'>
              <span className='minus' onClick={decreaseQty}>
                <AiOutlineMinus />
              </span>
              <span className='num'>
                {qty}
              </span>
              <span className='plus' onClick={increaseQty}>
                <AiOutlinePlus />
              </span>
            </p>
          </div>

          <div className='buttons'>
            <button type='button' className='add-to-cart' onClick={() => onAdd(product, qty)}>
              Add to Cart
            </button>
            <button type='button' className='buy-now' onClick={handleBuyNow}>
              Buy Now
            </button>
          </div>
        </div>
      </div>

      <div className='maylike-products-wrapper'>
        <h2>You may also like</h2>
        <div className='marquee'>
          <div className='maylike-products-container track'>
            {products.map((item) => (
              <Product key={item._id} product={item} />
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}

//get all the products, but dont return all of the data
//just return the 'current' slug property
export const getStaticPaths = async () => {
  const query = `*[_type == "product"] {
    slug { 
      current
    }
  }
  `;
  const products = await client.fetch(query);

  //we get each individual product (a product slug), then we instantly return an object, and we create a path for each one 
  //that object has a 'params' object, which is the product slug
  const paths = products.map((product) => ({
    params: {
      slug: product.slug.current
    }
  }));

  //we return an object that contains the paths and the fallback
  return {
    paths,
    fallback: 'blocking'
  }

}

export const getStaticProps = async ({ params: { slug } }) => {

  // The 'slug' is whatever the URL is
  // The 'query' is used to fetch product details from the product page we are on.
  // We are getting the first product that matches the slug/query
  const query = `*[_type == "product" && slug.current == "${slug}"][0]`;
  //Fetches all similar products
  const productsQuery = '*[_type == "product"]';
  //get individual product
  const product = await client.fetch(query);
  const products = await client.fetch(productsQuery);

  return {
    props: { products, product }
  }
}

export default ProductDetails