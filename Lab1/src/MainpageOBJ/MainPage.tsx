import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";

interface Product {
  id: number;
  title: string;
  description: string;
  image: string;
}

export function MainPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
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
    

    const fetchProducts = async () => {
      try {
        const response = await fetch("https://localhost:7039/api/products");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const fetchedProducts = await response.json();
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const goToProductPage = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  return (
<Container className="my-5">
  <Row>
    {products.map((product) => (
      <Col key={product.id} md={4} className="mb-4">
        <Card
          className="product-card"
          onClick={() => goToProductPage(product.id)}
          style={{ cursor: "pointer" }}
        >
          <Card.Img
            className="product-img"
            src={product.image}
            alt={product.title}
          />

          <Card.Body>
            <Card.Title className="product-title">
              {product.title}
            </Card.Title>

            <Card.Text className="product-text">
              {product.description}
            </Card.Text>
          </Card.Body>

        </Card>
      </Col>
    ))}
  </Row>
</Container>
  );
}
