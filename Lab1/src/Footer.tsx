import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { Navbar, Container } from 'react-bootstrap';

const Footer: React.FC = () => {
  return (
    <Navbar fixed="bottom" expand="lg" className="bg-body-tertiary">
      <Container fluid>
        <Navbar.Text>© 2024 Your Company</Navbar.Text>
      </Container>
    </Navbar>
  );
};

export default Footer;
