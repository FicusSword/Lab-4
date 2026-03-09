import 'bootstrap/dist/css/bootstrap.min.css';
import './Footer.css';
import React from 'react';
import { Navbar, Container } from 'react-bootstrap';

const Footer: React.FC = () => {
  return (
    <Navbar expand="lg" className="footer">
      <Container fluid>
        <Navbar.Text>© 2026 Deviance Company. All rights reserved.</Navbar.Text>
      </Container>
    </Navbar>
  );
};

export default Footer;
