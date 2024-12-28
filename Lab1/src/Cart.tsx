import React, { useEffect, useState } from 'react';
import { Button, ListGroup, ListGroupItem, Card, Container, Row, Col } from 'react-bootstrap';
import './Cart.css'; 
import Cookies from "js-cookie";

interface Product {
  id: number;
  title: string;
  description: string;
  image: string;
}

export function Cart() {
    const [, setAuthenticated] = useState(false);
    useEffect(() => {
        const accessToken = Cookies.get('accessToken');
        if (accessToken) {
            setAuthenticated(true);
        } else {
            window.location.href = "/";
        }
    }, []);

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
