import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';

const registerSchema = z
	.object({
		email: z.email('Invalid email address'),
		password: z.string().min(8, 'Must be at least 8 characters long.'),
		confirm: z.string(),
	})
	.refine((data) => data.password === data.confirm, {
		message: 'Passwords do not match',
		path: ['confirm'],
	});

export function RegisterPage({ ...props }) {
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors, isSubmitting },
	} = useForm({
		resolver: zodResolver(registerSchema),
	});

	const submitLogic = async (data) => {
		try {
			// Strip out the 'confirm' field so we only send necessary data to the DB
			const { confirm, ...apiData } = data;

			const response = await axios.post('https://retoolapi.dev/SNccOp/users', apiData);
			console.log(`Success:`, response.data);
		} catch (error) {
			const message =
				error.response?.data?.message ||
				'Something went wrong while creating your account.';
			console.error(`Signup Error: ${message}`);

			// Push the server error back into the UI for the user to see
			setError('root', { type: 'server', message });
		}
	};

	return (
		<Card {...props}>
			<CardHeader>
				<CardTitle>Create an account</CardTitle>
				<CardDescription>
					Enter your information below to create your account
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit(submitLogic)}>
					<FieldGroup className='space-y-4'>
						<Field>
							<FieldLabel htmlFor='email'>Email</FieldLabel>
							<Input
								id='email'
								type='email'
								placeholder='m@example.com'
								{...register('email')}
							/>
							{errors.email && (
								<FieldDescription className='text-red-600'>
									{errors.email.message}
								</FieldDescription>
							)}
						</Field>

						<Field>
							<FieldLabel htmlFor='password'>Password</FieldLabel>
							<Input id='password' type='password' {...register('password')} />
							{errors.password && (
								<FieldDescription className='text-red-600'>
									{errors.password.message}
								</FieldDescription>
							)}
						</Field>

						<Field>
							<FieldLabel htmlFor='confirm-password'>Confirm Password</FieldLabel>
							<Input id='confirm-password' type='password' {...register('confirm')} />
							{errors.confirm && (
								<FieldDescription className='text-red-600'>
									{errors.confirm.message}
								</FieldDescription>
							)}
						</Field>

						{/* Displays API/Server errors */}
						{errors.root && (
							<div className='text-sm font-medium text-red-600 pb-2'>
								{errors.root.message}
							</div>
						)}

						<Field className='pt-2'>
							<Button type='submit' className='w-full' disabled={isSubmitting}>
								{isSubmitting ? 'Creating Account...' : 'Create Account'}
							</Button>
						</Field>
					</FieldGroup>
				</form>
			</CardContent>
		</Card>
	);
}
