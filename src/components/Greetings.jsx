import React, { useState } from 'react';

const Greetings = ({ name }) => {
	const [count, setCount] = useState(0);
	return (
		<div>
			<h1>Welcome</h1>
			<p>Hello {name}</p>

			<h2>This is Login Form</h2>
			<form>
				<fieldset>
					<legend>Login Form</legend>
					<label htmlFor='email'>Email</label>
					<input type='email' id='email' />
					<button type='submit'>Login</button>
					<button onClick={() => setCount(count + 1)}>Increment</button>
					<p>Current Count: {count}</p>
				</fieldset>
			</form>
		</div>
	);
};

export default Greetings;
