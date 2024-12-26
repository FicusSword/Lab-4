import React from 'react';
import { Button, Col, Container, Form, Row, Card } from "react-bootstrap";
import axios from "axios";
import { useState } from "react";
import bgImage from './bg_image.jpg'; // Импорт изображения из папки src

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
        <div className="register-page" style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: "cover", 
            backgroundPosition: "center", 
            backgroundRepeat: "no-repeat", 
            minHeight: "100vh", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center"
        }}>
            <Container>
                <Row className="justify-content-center">
                    <Col md={6}>
                        <Card className="p-4 shadow" style={{ borderRadius: "15px", backgroundColor: "rgba(255, 255, 255, 0.9)" }}>
                            <h2 className="mb-4 text-center" style={{ color: "#6e8efb" }}>Registration</h2>
                            {error && <div className="alert alert-danger">{error}</div>}
                            {success && <div className="alert alert-success">{success}</div>}
                            <Form>
                                <Form.Group controlId="formBasicUsername" className="mb-3">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        placeholder="Enter username" 
                                        value={username} 
                                        onChange={handleUsernameChange} 
                                    />
                                </Form.Group>

                                <Form.Group controlId="formBasicPassword" className="mb-3">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control 
                                        type="password" 
                                        placeholder="Enter password" 
                                        value={password} 
                                        onChange={handlePasswordChange} 
                                    />
                                </Form.Group>

                                <Form.Group controlId="formBasicConfirmPassword" className="mb-3">
                                    <Form.Label>Confirm Password</Form.Label>
                                    <Form.Control 
                                        type="password" 
                                        placeholder="Confirm password" 
                                        value={confirmPassword} 
                                        onChange={handleConfirmPasswordChange} 
                                    />
                                </Form.Group>

                                <div className="d-flex justify-content-between">
                                    <Button variant="primary" type="button" onClick={handleRegister}>
                                        Registration
                                    </Button>
                                    <Button variant="outline-secondary" href="/">
                                        Login
                                    </Button>
                                </div>
                            </Form>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
