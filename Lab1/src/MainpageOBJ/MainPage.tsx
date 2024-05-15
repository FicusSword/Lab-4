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
                    <Col><Card style={{ width: '18rem' }}><Card.Body><Card.Title>Product 1</Card.Title><Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle><Card.Text>---------------------------------------</Card.Text><Card.Link href="/page" >Open</Card.Link></Card.Body></Card></Col>
                    <Col><Card style={{ width: '18rem' }}><Card.Body><Card.Title>Product 2</Card.Title><Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle><Card.Text>---------------------------------------</Card.Text><Card.Link href="/page2" >Open</Card.Link></Card.Body></Card></Col>
                    <Col><Card style={{ width: '18rem' }}><Card.Body><Card.Title>Product 1</Card.Title><Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle><Card.Text>---------------------------------------</Card.Text><Card.Link href="/page" >Open</Card.Link></Card.Body></Card></Col>
                    <Col><Card style={{ width: '18rem' }}><Card.Body><Card.Title>Product 2</Card.Title><Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle><Card.Text>---------------------------------------</Card.Text><Card.Link href="/page2" >Open</Card.Link></Card.Body></Card></Col>
                </Row>
                <Row>
                    <Col><Card style={{ width: '18rem' }}><Card.Body><Card.Title>Service 1</Card.Title><Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle><Card.Text>---------------------------------------</Card.Text><Card.Link href="/page" >Open</Card.Link></Card.Body></Card></Col>
                    <Col><Card style={{ width: '18rem' }}><Card.Body><Card.Title>Service 2</Card.Title><Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle><Card.Text>---------------------------------------</Card.Text><Card.Link href="/page2" >Open</Card.Link></Card.Body></Card></Col>
                    <Col><Card style={{ width: '18rem' }}><Card.Body><Card.Title>Service 1</Card.Title><Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle><Card.Text>---------------------------------------</Card.Text><Card.Link href="/page" >Open</Card.Link></Card.Body></Card></Col>
                    <Col><Card style={{ width: '18rem' }}><Card.Body><Card.Title>Service 2</Card.Title><Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle><Card.Text>---------------------------------------</Card.Text><Card.Link href="/page2" >Open</Card.Link></Card.Body></Card></Col>
                </Row>
                <Row>
                    <Col><Card style={{ width: '18rem' }}><Card.Body><Card.Title>Service 1</Card.Title><Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle><Card.Text>---------------------------------------</Card.Text><Card.Link href="/page" >Open</Card.Link></Card.Body></Card></Col>
                    <Col><Card style={{ width: '18rem' }}><Card.Body><Card.Title>Service 2</Card.Title><Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle><Card.Text>---------------------------------------</Card.Text><Card.Link href="/page2" >Open</Card.Link></Card.Body></Card></Col>
                    <Col><Card style={{ width: '18rem' }}><Card.Body><Card.Title>Service 1</Card.Title><Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle><Card.Text>---------------------------------------</Card.Text><Card.Link href="/page" >Open</Card.Link></Card.Body></Card></Col>
                    <Col><Card style={{ width: '18rem' }}><Card.Body><Card.Title>Service 2</Card.Title><Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle><Card.Text>---------------------------------------</Card.Text><Card.Link href="/page2" >Open</Card.Link></Card.Body></Card></Col>
                </Row>
                <Row>
                    <Col><Card style={{ width: '18rem' }}><Card.Body><Card.Title>Service 1</Card.Title><Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle><Card.Text>---------------------------------------</Card.Text><Card.Link href="/page" >Open</Card.Link></Card.Body></Card></Col>
                    <Col><Card style={{ width: '18rem' }}><Card.Body><Card.Title>Service 2</Card.Title><Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle><Card.Text>---------------------------------------</Card.Text><Card.Link href="/page2" >Open</Card.Link></Card.Body></Card></Col>
                    <Col><Card style={{ width: '18rem' }}><Card.Body><Card.Title>Service 1</Card.Title><Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle><Card.Text>---------------------------------------</Card.Text><Card.Link href="/page" >Open</Card.Link></Card.Body></Card></Col>
                    <Col><Card style={{ width: '18rem' }}><Card.Body><Card.Title>Service 2</Card.Title><Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle><Card.Text>---------------------------------------</Card.Text><Card.Link href="/page2" >Open</Card.Link></Card.Body></Card></Col>
                </Row>
                <Row>
                    <Col><Card style={{ width: '18rem' }}><Card.Body><Card.Title>Service 1</Card.Title><Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle><Card.Text>---------------------------------------</Card.Text><Card.Link href="/page" >Open</Card.Link></Card.Body></Card></Col>
                    <Col><Card style={{ width: '18rem' }}><Card.Body><Card.Title>Service 2</Card.Title><Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle><Card.Text>---------------------------------------</Card.Text><Card.Link href="/page2" >Open</Card.Link></Card.Body></Card></Col>
                    <Col><Card style={{ width: '18rem' }}><Card.Body><Card.Title>Service 1</Card.Title><Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle><Card.Text>---------------------------------------</Card.Text><Card.Link href="/page" >Open</Card.Link></Card.Body></Card></Col>
                    <Col><Card style={{ width: '18rem' }}><Card.Body><Card.Title>Service 2</Card.Title><Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle><Card.Text>---------------------------------------</Card.Text><Card.Link href="/page2" >Open</Card.Link></Card.Body></Card></Col>
                </Row>
                <Row>
                    <Col><Card style={{ width: '18rem' }}><Card.Body><Card.Title>Service 1</Card.Title><Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle><Card.Text>---------------------------------------</Card.Text><Card.Link href="/page" >Open</Card.Link></Card.Body></Card></Col>
                    <Col><Card style={{ width: '18rem' }}><Card.Body><Card.Title>Service 2</Card.Title><Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle><Card.Text>---------------------------------------</Card.Text><Card.Link href="/page2" >Open</Card.Link></Card.Body></Card></Col>
                    <Col><Card style={{ width: '18rem' }}><Card.Body><Card.Title>Service 1</Card.Title><Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle><Card.Text>---------------------------------------</Card.Text><Card.Link href="/page" >Open</Card.Link></Card.Body></Card></Col>
                    <Col><Card style={{ width: '18rem' }}><Card.Body><Card.Title>Service 2</Card.Title><Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle><Card.Text>---------------------------------------</Card.Text><Card.Link href="/page2" >Open</Card.Link></Card.Body></Card></Col>
                </Row>
                <div style={{ position: 'fixed', left: '10px', bottom: '70px' }}>
                    <Button variant="primary" type="button" href="/">Logout</Button>
                </div>
            </Container>
        </div>
    );
}
