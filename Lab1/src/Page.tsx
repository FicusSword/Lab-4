import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Card } from 'react-bootstrap';

interface Product {
  id: number;
  title: string;
  description: string;
  image: string;
}

export function Page() {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [, setAuthenticated] = useState(false);
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
        setAuthenticated(true);
    } else {
        window.location.href = "/"; 
    }
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const foundProduct = products.find((p: Product) => p.id.toString() === productId);
    setProduct(foundProduct);
  }, [productId]);

  const addToCart = () => {
    if (!product) return;

    let cart = localStorage.getItem('cart');
    const cartItems: Product[] = cart ? JSON.parse(cart) : [];
    
    cartItems.push(product); 

    localStorage.setItem('cart', JSON.stringify(cartItems));
  };

  if (!product) return <p>Product not found...</p>;

  return (
    <>
      <div>
        <Card className="bg-dark text-white">
          <Card.Img src={product.image} alt={product.title} />
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
