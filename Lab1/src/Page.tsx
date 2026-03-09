import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Card, Row, Col, Container, Modal } from 'react-bootstrap';
import Cookies from "js-cookie";
import axios from "axios";

interface Product {
  id: number;
  title: string;
  description: string;
  image: string;
  engine: string; 
  horsepower: string; 
  torque: string; 
}

export function Page() {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [, setAuthenticated] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      try {

        const response = await axios.get("https://ficussword.top/api/check-token", {
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

            const refreshResponse = await axios.post("https://ficussword.top/api/auth/refresh", {}, {
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

    const fetchProduct = async () => {
      try {
        const response = await fetch(`https://ficussword.top/api/products/${productId}`); 
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }

        const fetchedProduct = await response.json();
        setProduct(fetchedProduct);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct(); 
  }, [productId]);

  const addToCart = async () => {
    if (!product) return;

    try {
      let cart = localStorage.getItem('cart');
      const cartItems: Product[] = cart ? JSON.parse(cart) : [];
      cartItems.push(product);
      localStorage.setItem('cart', JSON.stringify(cartItems));

      setShowModal(true);

    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  if (!product) return <p>Product not found...</p>;

  return (
<Container fluid className="p-4" style={{ minHeight: '100vh' }}>
  <Row className="justify-content-center mb-4">
    <Col md={10}>
      <Row>

        {/* Картинка персонажа */}
        <Col md={6}>
  <Card style={{ height: "100%", overflow: "hidden" }}>
    <Card.Img
      src={product.image}
      alt={product.title}
      style={{
        height: "100%",
        objectFit: "cover"
      }}
    />
  </Card>
</Col>

        {/* Имя + Аниме */}
        <Col md={6} className="d-flex flex-column gap-4">

          {/* Имя */}
          <Card>
            <Card.Body className="text-center">
              <h2>{product.title}</h2>
            </Card.Body>
          </Card>

          {/* Название аниме */}
          <Card style={{ height: "80px" }}>
            <Card.Body className="text-center d-flex align-items-center justify-content-center">
              <h5 style={{ margin: 0 }}>{product.engine}</h5>
            </Card.Body>
          </Card>

        </Col>

      </Row>
    </Col>
  </Row>

  {/* Описание */}
  <Row className="justify-content-center">
    <Col md={10}>
      <Card>
        <Card.Body>
          <h3 className="mb-3">Описание</h3>
          <p style={{ fontSize: "1.1rem" }}>
            {product.description}
          </p>
        </Card.Body>
      </Card>
    </Col>
  </Row>
</Container>
  );
}
