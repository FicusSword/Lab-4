import { useAppDispatch, useAppSelector } from "./Hooks";
import { increment,increment2,increment3,increment4,increment5,decrement,decrement2,decrement3,decrement4,decrement5 } from "./CounterSlice";
import { useEffect, useState } from "react";
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import { Card } from "react-bootstrap";
import Cookies from "js-cookie";
import axios from "axios";

export function Task(){
    const [, setAuthenticated] = useState(false);
    useEffect(() => {
        const validateToken = async () => {
            try {
      
              const response = await axios.get("https://localhost:7039/api/check-token", {
                withCredentials: true,
              });
              console.log("Token is valid:", response.data);
            } catch (error: unknown) { 
              if (error instanceof Error) {
                console.error("Error message:", error.message);
              } else {
                console.error("An unknown error occurred");
              }
      
              if (axios.isAxiosError(error) && error.response?.status === 401) {
                try {
                  console.log("Attempting to refresh token...");
      
                  const refreshResponse = await axios.post("https://localhost:7039/api/auth/refresh", {}, {
                    withCredentials: true, 
                  });
      
                  console.log("Token refreshed:", refreshResponse.data);
      
                } catch (refreshError: unknown) {
                  if (refreshError instanceof Error) {
                    console.error("Token refresh failed:", refreshError.message);
                  } else {
                    console.error("An unknown error occurred while refreshing token");
                  }
      
                  window.location.href = "/";
                }
              } else {
                window.location.href = "/";
              }
            }
          };
      
          validateToken();

    }, []);
    const dispatch = useAppDispatch();
    const a = useAppSelector((state) => state.counter.value1)
    const b = useAppSelector((state) => state.counter.value2)
    const c = useAppSelector((state) => state.counter.value3)
    const d = useAppSelector((state) => state.counter.value4)
    const e = useAppSelector((state) => state.counter.value5)
    return(
        <div>
            <Card>
      <Card.Header as="h5">Tun</Card.Header>
      <Card.Body>
        <Card.Title>branded turbochargers</Card.Title>
        <Card.Text>
        {a} part of car = {a * 2000} $
        </Card.Text>
        <ButtonGroup disableElevation variant="contained" aria-label="Disabled button group">
                <Button onClick={() => dispatch(increment())}>Plus</Button>
                <Button onClick={() => dispatch(decrement())}>Minus</Button>
            </ButtonGroup>
            <Card.Title>engine cover</Card.Title>
        <Card.Text>
        {b} part of car =  {b * 500} $
        </Card.Text>
        <ButtonGroup disableElevation variant="contained" aria-label="Disabled button group">
                <Button onClick={() => dispatch(increment2())}>Plus</Button>
                <Button onClick={() => dispatch(decrement2())}>Minus</Button>
            </ButtonGroup>
            <Card.Title>branded wheels</Card.Title>
        <Card.Text>
        {c} part of car =  {c * 1000} $
        </Card.Text>
        <ButtonGroup disableElevation variant="contained" aria-label="Disabled button group">
                <Button onClick={() => dispatch(increment3())}>Plus</Button>
                <Button onClick={() => dispatch(decrement3())}>Minus</Button>
            </ButtonGroup>
            <Card.Title>carbon sports steering wheel</Card.Title>
        <Card.Text>
        {d} part of car =  {d * 1500} $
        </Card.Text>
        <ButtonGroup disableElevation variant="contained" aria-label="Disabled button group">
                <Button onClick={() => dispatch(increment4())}>Plus</Button>
                <Button onClick={() => dispatch(decrement4())}>Minus</Button>
            </ButtonGroup>       
            <Card.Title>hood with additional ventilation</Card.Title>
        <Card.Text>
        {e} part of car = {e * 2000} 
        </Card.Text>
        <ButtonGroup disableElevation variant="contained" aria-label="Disabled button group">
                <Button onClick={() => dispatch(increment5())}>Plus</Button>
                <Button onClick={() => dispatch(decrement5())}>Minus</Button>
            </ButtonGroup>
      </Card.Body>
    </Card>
        </div>
    )
}