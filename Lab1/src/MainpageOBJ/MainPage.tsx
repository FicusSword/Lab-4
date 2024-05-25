import { useEffect, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { Link } from 'react-router-dom'; // Import Link


interface Product {
  id: number;
  title: string;
  description: string;
  image: string;
}

export function MainPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [, setAuthenticated] = useState(false);
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
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

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Container>
        <Row>
          {products.map((product) => (
            <Col key={product.id}>
              <Card style={{ width: "18rem" }}>
                <Card.Img variant="top" src={product.image} />
                <Card.Body>
                  <Card.Title>{product.title}</Card.Title>
                  <Card.Text>{product.description}</Card.Text>
                  <Link to={`/product/${product.id}`} className="btn btn-primary">
                    Open
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}
