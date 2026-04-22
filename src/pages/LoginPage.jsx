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
			setError('root', { message: 'Invalid credentials. Please try again.' });
			return;
		}

		localStorage.setItem('currentUser', JSON.stringify(user));
		navigate('/');
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
				<div className='hidden lg:flex flex-col justify-center p-12 bg-gradient-to-br from-indigo-700 to-blue-600 text-white relative overflow-hidden'>
					<div className='relative z-10'>
						<h1 className='text-5xl font-bold leading-tight mb-6'>
							Welcome Back <br /> To Our Platform.
						</h1>
						<p className='text-blue-100 text-lg mb-8'>
							Access your projects, community, and expert support in one place.
						</p>

						<div className='space-y-4'>
							{['Real-time Analytics', 'Seamless Integration', 'Enhanced Security'].map(
								(text, i) => (
									<div key={i} className='flex items-center gap-3'>
										<div className='w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs'>
											✓
										</div>
										<span className='font-medium'>{text}</span>
									</div>
								),
							)}
						</div>
					</div>
					{/* Abstract Shapes */}
					<div className='absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-20 -mb-20 blur-3xl' />
				</div>

				{/* Right Side: Form */}
				<div className='p-8 lg:p-12 bg-slate-900/50'>
					<div className='mb-8'>
						<h2 className='text-3xl font-bold text-white mb-2'>Sign In</h2>
						<p className='text-slate-400'>Enter your credentials to access your account.</p>
					</div>

					<form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
						{errors.root && (
							<div className='bg-red-500/10 border border-red-500/20 text-red-400 p-3.5 rounded-xl text-xs font-semibold text-center'>
								{errors.root.message}
							</div>
						)}

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

						<div className='space-y-1.5'>
							<label className='text-sm font-medium text-slate-300'>Password</label>
							<Input
								type='password'
								{...register('password')}
								placeholder='••••••••'
								className={`bg-slate-950/50 border-slate-700 h-12 text-white focus:border-blue-500 transition-all ${errors.password ? 'border-red-500' : ''}`}
							/>
							{errors.password && (
								<p className='text-red-400 text-xs font-medium'>{errors.password.message}</p>
							)}
						</div>

						<div className='flex items-center justify-between text-sm'>
							<label className='flex items-center gap-2 text-slate-400 cursor-pointer'>
								<input
									type='checkbox'
									className='w-4 h-4 rounded border-slate-700 bg-slate-950/50 text-blue-600'
								/>
								Remember me
							</label>
							<button type='button' className='text-blue-400 hover:text-blue-300 font-medium'>
								Forgot password?
							</button>
						</div>

						<button
							disabled={isSubmitting}
							type='submit'
							className='w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/20 active:scale-[0.98] mt-4'>
							{isSubmitting ? 'Authenticating...' : 'Sign In Now'}
						</button>

						<div className='relative my-6'>
							<div className='absolute inset-0 flex items-center'>
								<span className='w-full border-t border-slate-800'></span>
							</div>
							<div className='relative flex justify-center text-xs uppercase'>
								<span className='bg-slate-900 px-2 text-slate-500'>New to platform?</span>
							</div>
						</div>

						<p className='text-center text-sm text-slate-400'>
							Don't have an account?
							<button
								onClick={() => navigate('/register')}
								className='text-blue-400 font-bold ml-1 hover:text-blue-300 transition-colors'>
								Create account
							</button>
						</p>
					</form>
				</div>
			</div>
		</div>
	);
};

export default LoginPage;
