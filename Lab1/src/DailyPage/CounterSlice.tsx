import { createSlice } from '@reduxjs/toolkit'

export interface CounterSlice{
    value1: number;
    value2: number;
    value3: number;
    value4: number;
    value5: number;
}

const initialState: CounterSlice = {
    value1: 0,
    value2: 0,
    value3: 0,
    value4: 0,
    value5: 0,

}

export const CounterSlice = createSlice({
    name: "counter",
    initialState,
    reducers: {
        increment: (state) => {
          state.value1 += 1
        },
        decrement: (state) => {
          state.value1 -= 1
        },
        increment2: (state) => {
            state.value2 += 1
          },
        decrement2: (state) => {
            state.value2 -= 1
          },
        increment3: (state) => {
            state.value3 += 1
          },
        decrement3: (state) => {
            state.value3 -= 1
          },
        increment4: (state) => {
            state.value4 += 1
          },
        decrement4: (state) => {
            state.value4 -= 1
          },
        increment5: (state) => {
            state.value5 += 1
          },
        decrement5: (state) => {
            state.value5 -= 1
          },
      },
})

export const {increment,increment2,increment3,increment4,increment5,decrement,decrement2,decrement3,decrement4,decrement5} = CounterSlice.actions;