import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

interface Product {
  id: number;
  title: string;
  description: string;
  image: string;
}

export function MainPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [, setAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = Cookies.get('accessToken');
    if (accessToken) {
        setAuthenticated(true);
    } else {
        window.location.href = "/";
    }
    const storedProducts = localStorage.getItem("products");
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    }
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
              style={{
                cursor: "pointer",
                border: "none",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                borderRadius: "10px",
              }}
              onClick={() => goToProductPage(product.id)}
            >
              <Card.Img
                variant="top"
                src={product.image}
                alt={product.title}
                style={{ borderRadius: "10px 10px 0 0" }}
              />
              <Card.Body>
                <Card.Title
                  style={{ fontSize: "1.5rem", fontWeight: "bold" }}
                >
                  {product.title}
                </Card.Title>
                <Card.Text style={{ fontSize: "1rem", color: "#6c757d" }}>
                  {product.description}
                </Card.Text>
                <Link to={`/product/${product.id}`}>
                  <Button
                    variant="primary"
                    style={{
                      background: "#007bff",
                      border: "none",
                      padding: "10px 20px",
                      fontSize: "1.2rem",
                      display: "flex",
                      alignItems: "center",
                      transition: "background 0.3s ease",
                    }}
                  >
                    View Details
                  </Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
