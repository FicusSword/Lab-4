import React, { useEffect, useState } from 'react';
import { Button, ListGroup, ListGroupItem, Card, Container, Row, Col } from 'react-bootstrap';
import './Cart.css'; 
import Cookies from "js-cookie";
import axios from "axios";

interface Product {
  id: number;
  title: string;
  description: string;
  image: string;
}

export function Cart() {
    const validateToken = async () => {
        try {
  
          const response = await axios.get("https://localhost:7039/api/check-token", {
            withCredentials: true,
          });
          console.log("Token is valid:", response.data);
        } catch (error: unknown) { 
          if (error instanceof Error) {
            console.error("Error message:", error.message);
          } else {
            console.error("An unknown error occurred");
          }
  
          if (axios.isAxiosError(error) && error.response?.status === 401) {
            try {
              console.log("Attempting to refresh token...");
  
              const refreshResponse = await axios.post("https://localhost:7039/api/auth/refresh", {}, {
                withCredentials: true, 
              });
  
              console.log("Token refreshed:", refreshResponse.data);
  
            } catch (refreshError: unknown) {
              if (refreshError instanceof Error) {
                console.error("Token refresh failed:", refreshError.message);
              } else {
                console.error("An unknown error occurred while refreshing token");
              }
  
              window.location.href = "/";
            }
          } else {
            window.location.href = "/";
          }
        }
      };
  
      validateToken();

    const [cartItems, setCartItems] = React.useState<Product[]>(() => {
        const localData = localStorage.getItem('cart');
        return localData ? JSON.parse(localData) : [];
    });

    const removeItem = (id: number) => {
        const updatedCart = cartItems.filter(item => item.id !== id);
        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem('cart');
    };

    return (
        <Container className="cart-container">
            <h1 className="cart-title">Shopping Cart</h1>
            {cartItems.length > 0 ? (
                <ListGroup>
                    {cartItems.map((item, index) => (
                        <ListGroupItem key={index} className="cart-item">
                            <Card>
                                <Card.Body>
                                    <Row>
                                        <Col md={4}>
                                            <Card.Img variant="top" src={item.image} alt={item.title} className="cart-img" />
                                        </Col>
                                        <Col md={8} className="cart-details">
                                            <Card.Title>{item.title}</Card.Title>
                                            <Card.Text>{item.description}</Card.Text>
                                            <Button variant="danger" onClick={() => removeItem(item.id)} className="cart-remove-button">Remove Item</Button>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </ListGroupItem>
                    ))}
                </ListGroup>
            ) : (
                <p className="cart-empty">Your cart is empty.</p>
            )}
            <Button variant="primary" href="/Assisten" className="cart-clear-button" style={{ background: '#007bff', border: 'none', padding: '15px 30px', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', transition: 'background 0.3s ease' }}>Submit a request to the manager</Button>
            <Button variant="warning" onClick={clearCart} className="cart-clear-button" style={{ display: cartItems.length ? 'block' : 'none' }}>
                Clear Cart
            </Button>
        </Container>
    );
}
