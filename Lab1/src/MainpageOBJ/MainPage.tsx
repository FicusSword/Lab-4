import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";

export function MainPage() {
    
    const [, setAuthenticated] = useState(false);
    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            setAuthenticated(true);
        } else {
            window.location.href = "/"; 
        }
    }, []);
    
    return (
        <div style={{ display: "flex", justifyContent: "center" }}>
            <Container>
                <Row>
                    <Col><Card style={{ width: '18rem' }}><Card.Img variant="top" src="image.png" /><Card.Body><Card.Title>Card Title</Card.Title><Card.Text>Some quick example text to build on the card title and make up thebulk of the card's content.</Card.Text><Button variant="primary" href="/page">Open</Button></Card.Body></Card></Col>
                    <Col><Card style={{ width: '18rem' }}><Card.Img variant="top" src="image.png" /><Card.Body><Card.Title>Card Title</Card.Title><Card.Text>Some quick example text to build on the card title and make up thebulk of the card's content.</Card.Text><Button variant="primary" href="/page2">Open</Button></Card.Body></Card></Col>
                    <Col><Card style={{ width: '18rem' }}><Card.Img variant="top" src="image.png" /><Card.Body><Card.Title>Card Title</Card.Title><Card.Text>Some quick example text to build on the card title and make up thebulk of the card's content.</Card.Text><Button variant="primary" href="/page">Open</Button></Card.Body></Card></Col>
                    <Col><Card style={{ width: '18rem' }}><Card.Img variant="top" src="image.png" /><Card.Body><Card.Title>Card Title</Card.Title><Card.Text>Some quick example text to build on the card title and make up thebulk of the card's content.</Card.Text><Button variant="primary" href="/page2">Open</Button></Card.Body></Card></Col>
                </Row>
                <Row>
                    <Col><Card style={{ width: '18rem' }}><Card.Img variant="top" src="image.png" /><Card.Body><Card.Title>Card Title</Card.Title><Card.Text>Some quick example text to build on the card title and make up thebulk of the card's content.</Card.Text><Button variant="primary" href="/page">Open</Button></Card.Body></Card></Col>
                    <Col><Card style={{ width: '18rem' }}><Card.Img variant="top" src="image.png" /><Card.Body><Card.Title>Card Title</Card.Title><Card.Text>Some quick example text to build on the card title and make up thebulk of the card's content.</Card.Text><Button variant="primary" href="/page2">Open</Button></Card.Body></Card></Col>
                    <Col><Card style={{ width: '18rem' }}><Card.Img variant="top" src="image.png" /><Card.Body><Card.Title>Card Title</Card.Title><Card.Text>Some quick example text to build on the card title and make up thebulk of the card's content.</Card.Text><Button variant="primary" href="/page">Open</Button></Card.Body></Card></Col>
                    <Col><Card style={{ width: '18rem' }}><Card.Img variant="top" src="image.png" /><Card.Body><Card.Title>Card Title</Card.Title><Card.Text>Some quick example text to build on the card title and make up thebulk of the card's content.</Card.Text><Button variant="primary" href="/page2">Open</Button></Card.Body></Card></Col>
                </Row>
                <Row>
                    <Col><Card style={{ width: '18rem' }}><Card.Img variant="top" src="image.png" /><Card.Body><Card.Title>Card Title</Card.Title><Card.Text>Some quick example text to build on the card title and make up thebulk of the card's content.</Card.Text><Button variant="primary" href="/page">Open</Button></Card.Body></Card></Col>
                    <Col><Card style={{ width: '18rem' }}><Card.Img variant="top" src="image.png" /><Card.Body><Card.Title>Card Title</Card.Title><Card.Text>Some quick example text to build on the card title and make up thebulk of the card's content.</Card.Text><Button variant="primary" href="/page2">Open</Button></Card.Body></Card></Col>
                    <Col><Card style={{ width: '18rem' }}><Card.Img variant="top" src="image.png" /><Card.Body><Card.Title>Card Title</Card.Title><Card.Text>Some quick example text to build on the card title and make up thebulk of the card's content.</Card.Text><Button variant="primary" href="/page">Open</Button></Card.Body></Card></Col>
                    <Col><Card style={{ width: '18rem' }}><Card.Img variant="top" src="image.png" /><Card.Body><Card.Title>Card Title</Card.Title><Card.Text>Some quick example text to build on the card title and make up thebulk of the card's content.</Card.Text><Button variant="primary" href="/page2">Open</Button></Card.Body></Card></Col>
                </Row>
                <div style={{ position: 'fixed', left: '10px', bottom: '70px' }}>
                    <Button variant="primary" type="button" href="/">Logout</Button>
                </div>
            </Container>
        </div>
    );
}
