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

    const generateSignature = async (input: string) => {
        const encoder = new TextEncoder();
        const data = encoder.encode(input);
        const hashBuffer = await crypto.subtle.digest("SHA-256", data);
        return btoa(String.fromCharCode(...new Uint8Array(hashBuffer)))
            .replace(/=/g, "")
            .replace(/\+/g, "-")
            .replace(/\//g, "_");
    };

    const generateToken = async (payload: object) => {
        const header = { alg: "HS256", typ: "JWT" };
        const base64Encode = (obj: object) =>
            btoa(JSON.stringify(obj)).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");

        const headerEncoded = base64Encode(header);
        const payloadEncoded = base64Encode({
            ...payload,
            exp: Date.now() + 3600000,
            iat: Date.now(),
        });

        const signature = await generateSignature(headerEncoded + "." + payloadEncoded);
        return `${headerEncoded}.${payloadEncoded}.${signature}`;
    };

    const validateToken = (token: string) => {
        if (!token) return false;

        const [header, payload, signature] = token.split(".");
        if (!header || !payload || !signature) return false;

        try {
            const payloadDecoded = JSON.parse(atob(payload));
            if (Date.now() > payloadDecoded.exp) {
                console.error("Token has expired");
                return false;
            }
            return true;
        } catch (err) {
            console.error("Invalid token format");
            return false;
        }
    };

    const handleLogin = async () => {
        console.log("Attempting login...");
        try {
            const response = await axios.get("https://localhost:7039/api/clients");
            console.log("API response:", response.data);

            const clients = response.data;
            const client = clients.find(
                (c: { name: string; age: number }) =>
                    c.name === username && c.age.toString() === password
            );

            if (client) {
                console.log("Login successful!");
                setLoggedIn(true);
                setUsername("");
                setPassword("");
                setError("");

                const token = await generateToken({ name: username });
                
                Cookies.set("accessToken", token, { expires: 1, secure: true, sameSite: "Strict" });

                window.location.href = "/home";
            } else {
                console.log("Invalid credentials");
                setError("Incorrect username or password");
                setUsername("");
                setPassword("");
            }
        } catch (err) {
            console.error("Error fetching data:", err);
            setError("Error fetching data");
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
        if (token && !validateToken(token)) {
            console.log("Token is invalid or expired, logging out...");
            handleLogout();
        } else if (token) {
            setLoggedIn(true);
        }
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
