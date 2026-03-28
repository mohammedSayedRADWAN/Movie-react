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
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { z } from 'zod';

// --- 1. SCHEMA ---
const loginSchema = z.object({
	email: z.string().email('Invalid email format.'),
	password: z.string().min(6, 'Password must be at least 6 characters.'),
});

// --- 2. ACTION FUNCTION ---
async function loginAction(prevState, formData) {
	const rawData = Object.fromEntries(formData);
	const validatedFields = loginSchema.safeParse(rawData);

	if (!validatedFields.success) {
		return {
			success: false,
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Validation failed. Please check your inputs.',
		};
	}

	// Simulate Network Request
	await new Promise((resolve) => setTimeout(resolve, 2000));
	return { success: true, errors: null, message: 'Welcome back!' };
}

// --- 3. SUBMIT BUTTON COMPONENT ---
function SubmitButton() {
	const { pending } = useFormStatus();
	return (
		<Field className='pt-2'>
			<Button type='submit' className='w-full' disabled={pending}>
				{pending ? 'Processing...' : 'Secure Login'}
			</Button>
		</Field>
	);
}

// --- 4. MAIN FORM COMPONENT ---
export default function LoginPage() {
	const [state, formAction, isPending] = useActionState(loginAction, {
		success: false,
		errors: null,
		message: null,
	});

	return (
		<Card className='w-full max-w-md mx-auto mt-10'>
			<CardHeader>
				<CardTitle>System Login</CardTitle>
				<CardDescription>Enter your credentials to access your account</CardDescription>
			</CardHeader>
			<CardContent>
				<form action={formAction}>
					<FieldGroup className='space-y-4'>
						{/* Global Message Display for Success or Server Errors */}
						{state.message && (
							<div
								className={`text-sm font-medium pb-2 ${state.success ? 'text-green-600' : 'text-red-600'}`}>
								{state.message}
							</div>
						)}

						<Field>
							<FieldLabel htmlFor='email'>Email</FieldLabel>
							<Input
								id='email'
								name='email'
								type='email'
								placeholder='instructor@example.com'
								disabled={isPending}
							/>
							{state.errors?.email && (
								<FieldDescription className='text-red-600'>
									{state.errors.email[0]}
								</FieldDescription>
							)}
						</Field>

						<Field>
							<FieldLabel htmlFor='password'>Password</FieldLabel>
							<Input id='password' name='password' type='password' disabled={isPending} />
							{state.errors?.password && (
								<FieldDescription className='text-red-600'>
									{state.errors.password[0]}
								</FieldDescription>
							)}
						</Field>

						<SubmitButton />
					</FieldGroup>
				</form>
			</CardContent>
		</Card>
	);
}
