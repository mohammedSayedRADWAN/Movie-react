import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router';
import { Input } from '@/components/ui/input';

const registerSchema = z
	.object({
		name: z
			.string()
			.min(3, 'Name must be at least 3 characters')
			.regex(/^[A-Za-z ]+$/, 'Only letters allowed'),
		email: z.string().email('Invalid email format'),
		password: z
			.string()
			.min(8, 'Password must be at least 8 characters')
			.regex(/[A-Z]/, 'Must include uppercase')
			.regex(/[0-9]/, 'Must include a number')
			.regex(/[@$!%*?&]/, 'Special character required'),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword'],
	});

export const RegisterPage = () => {
	const navigate = useNavigate();
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors, isSubmitting },
	} = useForm({
		resolver: zodResolver(registerSchema),
	});

	const onSubmit = (data) => {
		const users = JSON.parse(localStorage.getItem('users')) || [];
		if (users.find((u) => u.email === data.email)) {
			setError('email', { message: 'Email already exists' });
			return;
		}
		users.push({ name: data.name, email: data.email, password: data.password });
		localStorage.setItem('users', JSON.stringify(users));
		navigate('/login');
	};

	return (
		<div className='min-h-screen relative flex items-center justify-center p-4 bg-[#050000] -m-4'>
			{/* Background Decoration */}
			<div className='absolute top-0 left-0 w-full h-full overflow-hidden z-0'>
				<div className='absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-red-600/10 blur-[120px] rounded-full' />
				<div className='absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-red-900/20 blur-[120px] rounded-full' />
			</div>

			<div className='relative z-10 w-full max-w-[1000px] grid lg:grid-cols-2 bg-[#1a0505]/80 border border-red-900/30 rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(220,38,38,0.15)] backdrop-blur-md'>
				{/* Left Side */}
				<div className='hidden lg:flex flex-col justify-center p-12 bg-gradient-to-br from-red-700 to-red-950 text-white relative'>
					<h1 className='text-5xl font-bold leading-tight mb-6'>
						Join the <br /> Elite Circle.
					</h1>
					<p className='text-red-200 text-lg mb-8'>
						Access premium features and secure your data with our advanced protocol.
					</p>
					<div className='space-y-4'>
						{['Military Grade Security', 'Real-time Analytics', 'Priority Support'].map(
							(text, i) => (
								<div key={i} className='flex items-center gap-3'>
									<div className='w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs'>
										✓
									</div>
									<span className='font-medium text-red-50'>{text}</span>
								</div>
							),
						)}
					</div>
				</div>

				{/* Form Side */}
				<div className='p-8 lg:p-12'>
					<div className='mb-8'>
						<h2 className='text-3xl font-bold text-white mb-2'>Create Account</h2>
						<p className='text-red-200/50'>Experience the power of precision.</p>
					</div>

					<form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
						<div className='space-y-4'>
							<div className='space-y-1.5'>
								<label className='text-sm font-medium text-red-200/70 ml-1'>Full Name</label>
								<Input
									{...register('name')}
									placeholder='Name'
									className={`bg-red-950/20 border-red-900/50 text-white h-12 focus:border-red-500 transition-all ${errors.name ? 'border-red-500' : ''}`}
								/>
								{errors.name && <p className='text-red-500 text-xs'>{errors.name.message}</p>}
							</div>
							<div className='space-y-1.5'>
								<label className='text-sm font-medium text-red-200/70 ml-1'>Email</label>
								<Input
									{...register('email')}
									placeholder='Email'
									className={`bg-red-950/20 border-red-900/50 text-white h-12 focus:border-red-500 transition-all ${errors.email ? 'border-red-500' : ''}`}
								/>
								{errors.email && <p className='text-red-500 text-xs'>{errors.email.message}</p>}
							</div>
							<div className='grid sm:grid-cols-2 gap-4'>
								<div className='space-y-1.5'>
									<label className='text-sm font-medium text-red-200/70 ml-1'>Password</label>
									<Input
										type='password'
										{...register('password')}
										placeholder='••••'
										className='bg-red-950/20 border-red-900/50 text-white h-12'
									/>
								</div>
								<div className='space-y-1.5'>
									<label className='text-sm font-medium text-red-200/70 ml-1'>Confirm</label>
									<Input
										type='password'
										{...register('confirmPassword')}
										placeholder='••••'
										className='bg-red-950/20 border-red-900/50 text-white h-12'
									/>
								</div>
							</div>
						</div>

						<button className='w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-red-600/20 mt-6 active:scale-95'>
							{isSubmitting ? 'Processing...' : 'Register Now'}
						</button>

						<p className='text-center text-sm text-red-200/50 mt-4'>
							Already a member?{' '}
							<button
								onClick={() => navigate('/login')}
								className='text-red-500 font-bold hover:underline'>
								Sign in
							</button>
						</p>
					</form>
				</div>
			</div>
		</div>
	);
};

export default RegisterPage;
