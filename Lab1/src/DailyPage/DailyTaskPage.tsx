import { useAppDispatch, useAppSelector } from "./Hooks";
import { increment,increment2,increment3,increment4,increment5,decrement,decrement2,decrement3,decrement4,decrement5 } from "./CounterSlice";
import { useEffect, useState } from "react";
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import { Card } from "react-bootstrap";
import Cookies from "js-cookie";

export function Task(){
    const [, setAuthenticated] = useState(false);
    useEffect(() => {
        const accessToken = Cookies.get('accessToken');
        if (accessToken) {
            setAuthenticated(true);
        } else {
            window.location.href = "/";
        }
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