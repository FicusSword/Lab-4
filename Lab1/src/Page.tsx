import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Card, Row, Col, Container, Modal } from 'react-bootstrap';
import Cookies from "js-cookie";

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
    const accessToken = Cookies.get('accessToken');
    if (accessToken) {
      setAuthenticated(true);
    } else {
      window.location.href = "/";
    }

    const fetchProduct = async () => {
      try {
        const response = await fetch(`https://localhost:7039/api/products/${productId}`); 
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
    <>
      <Container fluid className="p-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <Row className="justify-content-center mb-5">
          <Col md={10}>
            <Row>
              <Col md={6}>
                <img
                  src={product.image}
                  alt={product.title}
                  style={{ width: '100%', borderRadius: '10px', objectFit: 'cover' }}
                />
              </Col>
              <Col md={6} className="d-flex flex-column justify-content-center">
                <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '20px' }}>{product.title}</h1>
                <p style={{ fontSize: '1.2rem', color: '#6c757d', marginBottom: '30px' }}>{product.description}</p>
                <Button
                  variant="primary"
                  onClick={addToCart}
                  style={{
                    background: '#007bff',
                    border: 'none',
                    padding: '15px 30px',
                    fontSize: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'background 0.3s ease',
                  }}
                >
                  Add to Cart
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col md={10}>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '20px' }}>Technical Specifications</h2>
            <Row>
              <Col md={4}>
                <Card className="mb-4" style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                  <Card.Body>
                    <Card.Title>Engine</Card.Title>
                    <Card.Text>{product.engine}</Card.Text> {}
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="mb-4" style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                  <Card.Body>
                    <Card.Title>Horsepower</Card.Title>
                    <Card.Text>{product.horsepower}</Card.Text> {}
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="mb-4" style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                  <Card.Body>
                    <Card.Title>Torque</Card.Title>
                    <Card.Text>{product.torque}</Card.Text> {}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col md={10}>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '20px' }}>Customer Reviews</h2>
            <Card className="mb-4" style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
              <Card.Body>
                <Card.Text>
                  <strong>John Doe</strong>
                  <br />
                  "The BMW M8 Competition is an incredible car. The performance is unmatched, and the luxury features are top-notch. Highly recommend!"
                </Card.Text>
              </Card.Body>
            </Card>
            <Card className="mb-4" style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
              <Card.Body>
                <Card.Text>
                  <strong>Jane Smith</strong>
                  <br />
                  "This car is a beast! The power and handling are superb, and it looks amazing. Worth every penny."
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Item Added to Cart</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>{product.title} has been added to your cart.</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
}
