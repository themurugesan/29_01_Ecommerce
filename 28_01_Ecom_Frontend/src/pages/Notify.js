import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CardHeader from "../pages/header/cardHeader";
import "../pages/cart/CardPage.css";

export const Notify = () => {
  const [cart, setCart] = useState([]);

  const fetchCart = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/notify", {
        headers: {
          Authorization: localStorage.token,
        },
      });
      console.log(response, "responseeeeeeeee");

      if (response.status === 200) {
        setCart(response.data.cart);
      } else {
        console.error("Error fetching cart:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <>
      <CardHeader />
      <div className="app-container">
        <h1 className="heading">Your Cart</h1>

        <div className="cart-items-container">
          {cart?.length > 0 ? (
            cart.map((item) => (
              <div key={item._id} className="cart-item">
                <h2>{item.title}</h2>
                <p>Price: ${item.amount}</p>
                <p>Quantity: {item.quantity}</p>
              </div>
            ))
          ) : (
            <p>Your cart is empty.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Notify;
