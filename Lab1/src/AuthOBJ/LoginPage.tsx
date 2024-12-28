import { Button, Col, Container, Form, Row, Card } from "react-bootstrap";
import axios from "axios";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import bgImage from './bg_image.jpg';

export function LoginPage() {
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleLogin = async () => {
        console.log("Attempting login...");
        try {
            const response = await axios.post("https://localhost:7039/api/auth/login", {
                name: username,
                age: password
            });

            console.log("API response:", response.data);

            if (response.status === 200) {
                console.log("Login successful!");
                setLoggedIn(true);
                setUsername("");
                setPassword("");
                setError("");

                
                const token = response.data.token;
                Cookies.set("accessToken", token, { expires: 1, secure: true, sameSite: "Strict" });

                window.location.href = "/home";
            }
        } catch (err) {
            console.error("Login failed:", err);
            setError("Incorrect username or password");
            setUsername("");
            setPassword("");
        }
    };

    const handleLogout = () => {
        setLoggedIn(false);
        setUsername("");
        setPassword("");
        setError("");
        Cookies.remove("accessToken");
        console.log("Logged out");
    };

    useEffect(() => {
        const token = Cookies.get("accessToken");
        if (!token) handleLogout();
        else setLoggedIn(true);
    }, []);

    return (
        <div className="login-page" style={{ 
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
                            <h2 className="mb-4 text-center" style={{ color: "#6e8efb" }}>Login</h2>
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

                                <div className="d-flex justify-content-between">
                                    <Button variant="primary" type="button" onClick={handleLogin}>
                                        Login
                                    </Button>
                                    <Button variant="outline-secondary" href="/register">
                                        Registration
                                    </Button>
                                    <Button variant="primary" type="button" onClick={handleLogout}>Logout</Button>
                                </div>
                            </Form>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
