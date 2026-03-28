import { useDispatch, useSelector } from 'react-redux';
import FirstComponent from './components/FirstComponent';
import SecondComponent from './components/SecondComponent';
import { increaseByAmount, increment, reset } from './redux/counterSlice';
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

function StoreManagement() {
	const count = useSelector((state) => state.counter.value);
	const dispatch = useDispatch();
	return (
		<>
			<h1 className='scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance'>
				Zustand
			</h1>
			<FirstComponent />
			<SecondComponent />

			<h1 className='scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance'>
				Redux toolkit
			</h1>
			<Card size='sm' className='mx-auto w-full max-w-sm mb-5'>
				<CardHeader>
					<CardTitle>First Component</CardTitle>
				</CardHeader>
				<CardContent>
					<p>Count is {count}</p>
				</CardContent>
				<CardFooter>
					<Button
						variant='outline'
						size='sm'
						className='w-full'
						onClick={() => dispatch(increment())}>
						Increment
					</Button>
				</CardFooter>
				<CardFooter>
					<Button variant='outline' size='sm' className='w-full' onClick={() => dispatch(reset())}>
						Reset
					</Button>
				</CardFooter>{' '}
				<CardFooter>
					<Button
						variant='outline'
						size='sm'
						className='w-full'
						onClick={() => dispatch(increaseByAmount(15))}>
						Increase by Amount (15)
					</Button>
				</CardFooter>
			</Card>
		</>
	);
}

export default StoreManagement;
