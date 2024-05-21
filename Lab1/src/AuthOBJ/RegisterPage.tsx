import { Button, Col, Container, Form, Row } from "react-bootstrap";
import axios from "axios";
import { useState } from "react";

export function RegisterPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(event.target.value);
    };

    const handleRegister = () => {
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        axios.post('https://localhost:7039/api/clients', {
            name: username,
            age: password
        })
        .then(() => {
            setSuccess('Registration successful! You can now log in.');
            setUsername('');
            setPassword('');
            setConfirmPassword('');
            setError('');
        })
        .catch((error) => {
            setError('Registration failed. Please try again.');
            console.error('There was an error!', error);
        });
    };

    return (
        <div>
            <Container className="mt-5">
                <Row className="justify-content-center">
                    <Col md={6}>
                        <h2 className="mb-4">Register</h2>
                        {error && <div className="alert alert-danger">{error}</div>}
                        {success && <div className="alert alert-success">{success}</div>}
                        <Form>
                            <Form.Group controlId="formBasicUsername">
                                <Form.Label>Username</Form.Label>
                                <Form.Control type="text" placeholder="Enter username" value={username} onChange={handleUsernameChange} />
                            </Form.Group>

                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Enter password" value={password} onChange={handlePasswordChange} />
                            </Form.Group>

                            <Form.Group controlId="formBasicConfirmPassword">
                                <Form.Label>Confirm Password</Form.Label>
                                <Form.Control type="password" placeholder="Confirm password" value={confirmPassword} onChange={handleConfirmPasswordChange} />
                            </Form.Group>

                            <Button variant="primary" type="button" onClick={handleRegister}>
                                Register
                            </Button>
                            <Button variant="primary" type="button" href="/">
                                Login
                            </Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
