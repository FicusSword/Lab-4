import { useEffect, useState } from 'react';
import { Button, Card } from 'react-bootstrap';

interface Product {
    id: number;
    title: string;
    description: string;
    image: string;
}

export function PageTwo() {
    const [, setAuthenticated] = useState(false);
    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            setAuthenticated(true);
        } else {
            window.location.href = "/"; 
        }
    }, []);
    const product: Product = {
        id: 2,
        title: "Product 2",
        description: "Detailed description of the product goes here.",
        image: "image.png"
    };

    function addToCart() {

        let cart = localStorage.getItem('cart');
        const cartItems: Product[] = cart ? JSON.parse(cart) : [];

        cartItems.push(product);

        localStorage.setItem('cart', JSON.stringify(cartItems));
    }

    return (
        <>
            <div>
                <Card className="bg-dark text-white">
                    <Card.Img src={product.image} alt="Card image" />
                    <Card.ImgOverlay>
                        <Card.Title>{product.title}</Card.Title>
                        <Card.Text>{product.description}</Card.Text>
                        <Button variant="primary" onClick={addToCart}>Add to cart</Button>
                    </Card.ImgOverlay>
                </Card>
            </div>
        </>
    );
}
