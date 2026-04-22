import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router';
import { Input } from '@/components/ui/input';

const loginSchema = z.object({
	email: z.string().email('Invalid email format'),
	password: z.string().min(1, 'Password is required'),
});

const LoginPage = () => {
	const navigate = useNavigate();
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors, isSubmitting },
	} = useForm({
		resolver: zodResolver(loginSchema),
	});

	const onSubmit = (data) => {
		const users = JSON.parse(localStorage.getItem('users')) || [];
		const user = users.find((u) => u.email === data.email && u.password === data.password);

		if (!user) {
			setError('root', { message: 'Invalid credentials. Access denied.' });
			return;
		}

		localStorage.setItem('currentUser', JSON.stringify(user));
		navigate('/');
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
				<div className='hidden lg:flex flex-col justify-center p-12 bg-gradient-to-br from-red-900 to-red-700 text-white relative'>
					<h1 className='text-5xl font-bold leading-tight mb-6'>
						Welcome To <br /> The Shadows.
					</h1>
					<p className='text-red-200 text-lg mb-8'>
						Re-authenticate to regain access to your encrypted dashboard and elite tools.
					</p>
					<div className='space-y-4'>
						{['Encrypted Session', 'Anomalous Detection', 'Instant Recall'].map((text, i) => (
							<div key={i} className='flex items-center gap-3'>
								<div className='w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs'>
									✓
								</div>
								<span className='font-medium text-red-50'>{text}</span>
							</div>
						))}
					</div>
				</div>

				{/* Form Side */}
				<div className='p-8 lg:p-12'>
					<div className='mb-8'>
						<h2 className='text-3xl font-bold text-white mb-2'>Sign In</h2>
						<p className='text-red-200/50'>Verify your identity for the Elite Circle.</p>
					</div>

					<form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
						{errors.root && (
							<div className='bg-red-500/10 border border-red-500/20 text-red-400 p-3.5 rounded-xl text-xs font-semibold text-center'>
								{errors.root.message}
							</div>
						)}

						<div className='space-y-1.5'>
							<label className='text-sm font-medium text-red-200/70 ml-1'>Email Address</label>
							<Input
								{...register('email')}
								placeholder='name@example.com'
								className={`bg-red-950/20 border-red-900/50 text-white h-12 focus:border-red-500 transition-all ${errors.email ? 'border-red-500' : ''}`}
							/>
							{errors.email && (
								<p className='text-red-400 text-xs mt-1'>{errors.email?.message}</p>
							)}
						</div>

						<div className='space-y-1.5'>
							<label className='text-sm font-medium text-red-200/70 ml-1'>Password</label>
							<Input
								type='password'
								{...register('password')}
								placeholder='••••'
								className={`bg-red-950/20 border-red-900/50 text-white h-12 focus:border-red-500 transition-all ${errors.password ? 'border-red-500' : ''}`}
							/>
							{errors.password && (
								<p className='text-red-400 text-xs mt-1'>{errors.password?.message}</p>
							)}
						</div>

						<div className='flex items-center justify-between text-xs text-red-200/50'>
							<label className='flex items-center gap-2 cursor-pointer'>
								<input
									type='checkbox'
									className='w-4 h-4 rounded border-red-900 bg-red-950/20 text-red-600'
								/>
								Stay in the shadows
							</label>
							<button type='button' className='hover:text-red-400 transition-colors'>
								Lost your key?
							</button>
						</div>

						<button className='w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-red-600/20 mt-4 active:scale-95'>
							{isSubmitting ? 'Verifying...' : 'Authenticate Now'}
						</button>

						<p className='text-center text-sm text-red-200/50 mt-6'>
							Not yet initiated?
							<button
								onClick={() => navigate('/register')}
								className='text-red-500 font-bold ml-1 hover:underline'>
								Join the Elite
							</button>
						</p>
					</form>
				</div>
			</div>
		</div>
	);
};

export default LoginPage;
