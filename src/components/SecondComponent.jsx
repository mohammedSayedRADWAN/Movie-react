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

const SecondComponent = () => {
	const count = useCounterSore((state) => state.count);
	return (
		<Card size='sm' className='mx-auto w-full max-w-sm mb-5'>
			<CardHeader>
				<CardTitle>Second Component</CardTitle>
			</CardHeader>
			<CardContent>
				<p>Count {count}</p>
			</CardContent>
		</Card>
	);
};

export default SecondComponent;
