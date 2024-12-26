import { useAppDispatch, useAppSelector } from "./Hooks";
import { increment,increment2,increment3,increment4,increment5,decrement,decrement2,decrement3,decrement4,decrement5 } from "./CounterSlice";
import { useEffect, useState } from "react";
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import { Card } from "react-bootstrap";


export function Task(){
    const [, setAuthenticated] = useState(false);
    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
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
        <Card.Title>Push-ups</Card.Title>
        <Card.Text>
        {a} = - {a * 3} calories
        </Card.Text>
        <ButtonGroup disableElevation variant="contained" aria-label="Disabled button group">
                <Button onClick={() => dispatch(increment())}>Plus</Button>
                <Button onClick={() => dispatch(decrement())}>Minus</Button>
            </ButtonGroup>
            <Card.Title>Squats</Card.Title>
        <Card.Text>
        {b} = - {b * 3} calories
        </Card.Text>
        <ButtonGroup disableElevation variant="contained" aria-label="Disabled button group">
                <Button onClick={() => dispatch(increment2())}>Plus</Button>
                <Button onClick={() => dispatch(decrement2())}>Minus</Button>
            </ButtonGroup>
            <Card.Title>Planks</Card.Title>
        <Card.Text>
        {c} = - {c * 4} calories
        </Card.Text>
        <ButtonGroup disableElevation variant="contained" aria-label="Disabled button group">
                <Button onClick={() => dispatch(increment3())}>Plus</Button>
                <Button onClick={() => dispatch(decrement3())}>Minus</Button>
            </ButtonGroup>
            <Card.Title>Crunches</Card.Title>
        <Card.Text>
        {d} = - {d * 5} calories
        </Card.Text>
        <ButtonGroup disableElevation variant="contained" aria-label="Disabled button group">
                <Button onClick={() => dispatch(increment4())}>Plus</Button>
                <Button onClick={() => dispatch(decrement4())}>Minus</Button>
            </ButtonGroup>       
            <Card.Title>Running or Walking</Card.Title>
        <Card.Text>
        {e} kilometers= if running - {e * 80} calories if walking - {e * 55} calories
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