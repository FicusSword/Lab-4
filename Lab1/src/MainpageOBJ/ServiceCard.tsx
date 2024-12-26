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
        // Если токен не найден, перенаправление на страницу входа
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
              className="product-card"
              onClick={() => goToProductPage(product.id)}
            >
              <Card.Img
                variant="top"
                src={product.image}
                alt={product.title}
                className="product-img"
              />
              <Card.Body>
                <Card.Title className="product-title">
                  {product.title}
                </Card.Title>
                <Card.Text className="product-text">
                  {product.description}
                </Card.Text>
                <Link to={`/product/${product.id}`}>
                  <Button variant="primary" className="btn-primary">
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
