import React, { useEffect, useState } from 'react';
import { Button, ListGroup, ListGroupItem, Card, Container, Row, Col } from 'react-bootstrap';
import './Cart.css'; // Make sure the path is correct

interface Product {
  id: number;
  title: string;
  description: string;
  image: string;
}

export function Cart() {
    const [, setAuthenticated] = useState(false);
    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
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
            <Button variant="warning" onClick={clearCart} className="cart-clear-button" style={{ display: cartItems.length ? 'block' : 'none' }}>
                Clear Cart
            </Button>
        </Container>
    );
}
