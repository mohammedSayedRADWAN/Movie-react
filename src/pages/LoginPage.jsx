import React from 'react';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router';

const loginSchema = z.object({
	email: z.string().email('Invalid email format'),
	password: z.string().min(8, 'Password must be at least 8 characters'),
});

const LoginPage = () => {
	const navigate = useNavigate();
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		setError,
	} = useForm({
		resolver: zodResolver(loginSchema),
	});

	const onSubmit = (data) => {
		const users = JSON.parse(localStorage.getItem('users')) || [];
		const user = users.find((u) => u.email === data.email && u.password === data.password);

		if (!user) {
			setError('root', {
				type: 'manual',
				message: 'Invalid email or password',
			});
			return;
		}

		// Simulate login
		localStorage.setItem('currentUser', JSON.stringify(user));
		navigate('/');
	};

	return (
		<div className='min-h-screen relative overflow-hidden font-sans -m-4'>
			{/* Background Image */}
			<img
				src='/avatar_bg.jpg'
				className='absolute inset-0 w-full h-full object-cover'
				alt='Background'
			/>

			<div className='absolute inset-0 bg-black/60' />

			<div className='relative z-10 flex min-h-screen items-center justify-center lg:justify-end lg:pr-32 p-6'>
				<div
					style={{ backgroundColor: 'rgba(25, 25, 25, 0.85)' }}
					className='backdrop-blur-xl p-10 rounded-3xl w-full max-w-md shadow-2xl border border-white/10'>
					<h2 className='text-3xl font-bold mb-6 text-center text-white'>Welcome Back</h2>

					<form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
						{/* global error */}
						{errors.root && (
							<div className='bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm text-center'>
								{errors.root.message}
							</div>
						)}

						{/* email */}
						<div className='space-y-1'>
							<Input
								placeholder='Email'
								className='h-12 !text-lg '
								style={{
									backgroundColor: 'rgba(255,255,255,0.05)',
									color: 'white',
									borderColor: 'rgba(255,255,255,0.1)',
								}}
								{...register('email')}
							/>
							{errors.email && (
								<p className='text-red-400 text-xs mt-1'>{errors.email?.message}</p>
							)}
						</div>

						{/* pass */}
						<div className='space-y-1'>
							<Input
								type='password'
								placeholder='Password'
								className='h-12 !text-lg '
								style={{
									backgroundColor: 'rgba(255,255,255,0.05)',
									color: 'white',
									borderColor: 'rgba(255,255,255,0.1)',
								}}
								{...register('password')}
							/>
							{errors.password && (
								<p className='text-red-400 text-xs mt-1'>{errors.password?.message}</p>
							)}
						</div>

						<button
							disabled={isSubmitting}
							style={{ backgroundColor: 'oklch(0.627 0.265 303.9)', color: '#191919' }}
							className='w-full font-bold py-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] mt-4 shadow-lg'>
							{isSubmitting ? 'Logging in...' : 'Sign In'}
						</button>

						<div className='text-center mt-4 text-sm text-gray-400'>
							Don't have an account?{' '}
							<span
								className='text-purple-400 cursor-pointer hover:underline'
								onClick={() => navigate('/register')}>
								Register
							</span>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default LoginPage;
