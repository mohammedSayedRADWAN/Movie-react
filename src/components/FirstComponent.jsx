import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import React from 'react';
import { useCounterSore } from '@/zustand/useCounterStore';

const FirstComponent = () => {
	const count = useCounterSore((state) => state.count);

	const increment = useCounterSore((state) => state.increment);

	const reset = useCounterSore((state) => state.reset);

	return (
		<Card size='sm' className='mx-auto w-full max-w-sm mb-5'>
			<CardHeader>
				<CardTitle>First Component</CardTitle>
			</CardHeader>
			<CardContent>
				<p>Count {count}</p>
			</CardContent>
			<CardFooter>
				<Button variant='outline' size='sm' className='w-full' onClick={increment}>
					Increment
				</Button>
			</CardFooter>
			<CardFooter>
				<Button variant='outline' size='sm' className='w-full' onClick={reset}>
					Reset
				</Button>
			</CardFooter>
		</Card>
	);
};

export default FirstComponent;
