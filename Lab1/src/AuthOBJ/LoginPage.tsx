import { Button, Col, Container, Form, Row } from "react-bootstrap";
import axios from "axios";
import { useState } from "react";

export function LoginPage(){
    const [, setLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [, setError] = useState('');
    const [, setAccessToken] = useState('');

    const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleLogin = () => {
        axios.post('https://localhost:7039/api/clients', {
            name: username,
            age: password
        })
        .then(() => {
            setLoggedIn(true);
            setUsername('');
            setPassword('');
            setError('');
            
            const token = generateToken();

            localStorage.setItem('accessToken', token);
            setAccessToken(token);
            window.location.href = "/home"; 
        })
        .catch(() => {
            setError('incorect username or password');
            setUsername('');
            setPassword('');
        });
    };

    const handleLogout = () => {
        setLoggedIn(false);
        setUsername('');
        setPassword('');
        setError('');
        setAccessToken('');
        localStorage.removeItem('accessToken');
    };

    const generateToken = () => {
        return 'asdadfcsacoasp[dko[aclpawkl1223dasdawe23';
    };

    return(
        <div>
            <Container className="mt-5">
                <Row className="justify-content-center">
                    <Col md={6}>
                        <h2 className="mb-4">Login</h2>
                        <Form>
                            <Form.Group controlId="formBasicUsername">
                                <Form.Label>Username</Form.Label>
                                <Form.Control type="text" placeholder="write username" value={username} onChange={handleUsernameChange} />
                            </Form.Group>

                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="write password" value={password} onChange={handlePasswordChange} />
                            </Form.Group>

                            <Button variant="primary" type="button" onClick={handleLogin}>
                                Login
                            </Button>
                        </Form>
                    </Col>
                </Row>
                <div style={{ position: 'fixed', left: '10px', bottom: '70px' }}>
                    <Button variant="primary" type="button" onClick={handleLogout}>Logout</Button>
                </div>
            </Container>
        </div>
    );
}
