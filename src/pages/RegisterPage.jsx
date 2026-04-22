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
		<div className='min-h-screen relative flex items-center justify-center p-4 bg-[#020617] -m-4'>
			{/* Background Decoration */}
			<div className='absolute top-0 left-0 w-full h-full overflow-hidden z-0'>
				<div className='absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full' />
				<div className='absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full' />
			</div>

			{/* Main Container */}
			<div className='relative z-10 w-full max-w-[1000px] grid lg:grid-cols-2 bg-[#0f172a]/80 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-md'>
				{/* Left Side: Visual/Info */}
				<div className='hidden lg:flex flex-col justify-center p-12 bg-gradient-to-br from-blue-600 to-indigo-700 text-white relative overflow-hidden'>
					<div className='relative z-10'>
						<h1 className='text-5xl font-bold leading-tight mb-6'>
							Start Your <br /> Journey With Us.
						</h1>
						<p className='text-blue-100 text-lg mb-8'>
							Discover the world's best community for creators and developers.
						</p>

						<div className='space-y-4'>
							{['Secure & Encrypted', 'Cloud Native Support', '24/7 Expert Help'].map((text, i) => (
								<div key={i} className='flex items-center gap-3'>
									<div className='w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs'>
										✓
									</div>
									<span className='font-medium'>{text}</span>
								</div>
							))}
						</div>
					</div>
					{/* Abstract Shapes */}
					<div className='absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl' />
				</div>

				{/* Right Side: Form */}
				<div className='p-8 lg:p-12 bg-slate-900/50'>
					<div className='mb-8'>
						<h2 className='text-3xl font-bold text-white mb-2'>Create Account</h2>
						<p className='text-slate-400'>Please fill in your details to register.</p>
					</div>

					<form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
						<div className='grid grid-cols-1 gap-4'>
							{/* Name Input */}
							<div className='space-y-1.5'>
								<label className='text-sm font-medium text-slate-300'>Full Name</label>
								<Input
									{...register('name')}
									placeholder='Enter your name'
									className={`bg-slate-950/50 border-slate-700 h-12 text-white focus:border-blue-500 transition-all ${errors.name ? 'border-red-500' : ''}`}
								/>
								{errors.name && (
									<p className='text-red-400 text-xs font-medium'>{errors.name.message}</p>
								)}
							</div>

							{/* Email Input */}
							<div className='space-y-1.5'>
								<label className='text-sm font-medium text-slate-300'>Email Address</label>
								<Input
									{...register('email')}
									placeholder='name@example.com'
									className={`bg-slate-950/50 border-slate-700 h-12 text-white focus:border-blue-500 transition-all ${errors.email ? 'border-red-500' : ''}`}
								/>
								{errors.email && (
									<p className='text-red-400 text-xs font-medium'>{errors.email.message}</p>
								)}
							</div>

							{/* Passwords Row */}
							<div className='grid sm:grid-cols-2 gap-4'>
								<div className='space-y-1.5'>
									<label className='text-sm font-medium text-slate-300'>Password</label>
									<Input
										type='password'
										{...register('password')}
										placeholder='••••••••'
										className={`bg-slate-950/50 border-slate-700 h-12 text-white focus:border-blue-500 transition-all ${errors.password ? 'border-red-500' : ''}`}
									/>
									{errors.password && (
										<p className='text-red-400 text-[10px] leading-tight'>
											{errors.password.message}
										</p>
									)}
								</div>
								<div className='space-y-1.5'>
									<label className='text-sm font-medium text-slate-300'>Confirm</label>
									<Input
										type='password'
										{...register('confirmPassword')}
										placeholder='••••••••'
										className={`bg-slate-950/50 border-slate-700 h-12 text-white focus:border-blue-500 transition-all ${errors.confirmPassword ? 'border-red-500' : ''}`}
									/>
									{errors.confirmPassword && (
										<p className='text-red-400 text-xs font-medium'>
											{errors.confirmPassword.message}
										</p>
									)}
								</div>
							</div>
						</div>

						<button
							disabled={isSubmitting}
							type='submit'
							className='w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/20 active:scale-[0.98] mt-6'>
							{isSubmitting ? 'Creating Account...' : 'Get Started Free'}
						</button>

						<div className='relative my-6'>
							<div className='absolute inset-0 flex items-center'>
								<span className='w-full border-t border-slate-800'></span>
							</div>
							<div className='relative flex justify-center text-xs uppercase'>
								<span className='bg-slate-900 px-2 text-slate-500'>Or continue with</span>
							</div>
						</div>

						<p className='text-center text-sm text-slate-400'>
							Already have an account?
							<button
								onClick={() => navigate('/login')}
								className='text-blue-400 font-bold ml-1 hover:text-blue-300 transition-colors'>
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
