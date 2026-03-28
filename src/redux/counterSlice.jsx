import { createSlice } from '@reduxjs/toolkit';

export const counterSlice = createSlice({
	name: 'counter', // initial identifier for this slice
	initialState: { value: 0 },
	reducers: {
		reset: (state) => {
			state.value = 0;
		},

		// Reducer, RTK generate "Actions"
		increment: (state) => {
			state.value += 1; // Immer
		},

		increaseByAmount: (state, action) => {
			state.value += action.payload;
		},
	},
});

export const { reset, increment, increaseByAmount } = counterSlice.actions;

export default counterSlice.reducer;
