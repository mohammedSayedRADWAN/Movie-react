import { render, screen } from '@testing-library/react';
import Greetings from './Greetings';
import userEvent from '@testing-library/user-event';
import { describe, expect, test } from 'vitest';

describe('Greetings Component', () => {
	test('renders the correct greeting message', () => {
		// 1. RENDER: We take our component and draw it onto our invisible "jsdom"
		// We pass the prop name="Hassan"
		render(<Greetings name='Hassan' />);

		// 2. SCREEN: Represent Virtual Screen
		// for searching the elements
		// a- getBy => if not found crash
		// b- queryBy => if not found return null
		// c- findBy => wait for 1 sec then if not found crash

		const headingElement = screen.getByText('Welcome');
		const nonExisting = screen.queryByText('Non');
		const nameElement = screen.getByText('Hello Hassan');
		const btn = screen.getByRole('button', { name: 'Increment' });

		// 3. ASSERTION
		expect(headingElement).toBeInTheDocument();
		expect(nameElement).toBeInTheDocument();
		expect(btn).toBeInTheDocument();
	});

	test('renders the correct component', () => {
		render(<Greetings name='Mohamed' />);

		const heading = screen.getByRole('heading', { level: 2, name: 'This is Login Form' });
		expect(heading).toBeInTheDocument();

		const emailInput = screen.getByLabelText('Email');
		expect(emailInput).toBeInTheDocument();

		const submitBtn = screen.getByRole('button', { name: 'Login' });
		expect(submitBtn).toBeInTheDocument();
	});

	test('Template for user interaction', async () => {
		// 2. Simulate user
		const user = userEvent.setup();

		// 3. render the screen
		render(<Greetings name='Sohila' />);

		// 4. Find element
		// const button = screen.getByRole('button');
		const button = screen.getByRole('button', { name: 'Increment' });

		// 5. Interact
		await user.click(button);

		// 6. Assertion
		expect(screen.getByText('Current Count: 1')).toBeInTheDocument();
	});
});
