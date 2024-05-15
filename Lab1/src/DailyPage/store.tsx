import { configureStore } from '@reduxjs/toolkit'
import { CounterSlice } from './CounterSlice'


export const store = configureStore({
  reducer: {
    counter: CounterSlice.reducer
  },
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch