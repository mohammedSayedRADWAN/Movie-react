import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  Eye,
  EyeOff,
  Film,
  ArrowLeft,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { useAuthStore } from '@/zustand/useAuthStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import CosmicBackground from '@/components/CosmicBackground';

const registerSchema = z
  .object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must include at least one uppercase letter')
      .regex(/[0-9]/, 'Must include at least one number')
      .regex(/[@$!%*?&]/, 'Must include at least one special character'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

const RegisterPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const users = JSON.parse(localStorage.getItem('users')) || [];
      if (users.find((u) => u.email === data.email)) {
        throw new Error(t('auth.emailRegistered'));
      }

      const newUser = { id: Date.now(), username: data.username, email: data.email };
      users.push({ ...newUser, password: data.password });
      localStorage.setItem('users', JSON.stringify(users));

      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center p-4 relative overflow-hidden'>
      <CosmicBackground />
      
      <Card className="w-full max-w-md border-white/5 bg-black/40 backdrop-blur-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] relative z-10 rounded-[2.5rem] overflow-hidden before:absolute before:inset-0 before:rounded-[2.5rem] before:p-[1px] before:bg-linear-to-b before:from-white/10 before:to-transparent after:absolute after:-inset-[1px] after:rounded-[2.5rem] after:border after:border-primary/20 after:animate-pulse after:pointer-events-none">
        
        <CardHeader className="space-y-4 pb-2">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full text-white/50 hover:text-white hover:bg-white/5">
              <ArrowLeft className="h-5 w-5 rtl:rotate-180" />
            </Button>
            <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate('/')}>
              <div className="p-2 bg-primary/20 rounded-xl border border-primary/30 group-hover:bg-primary/30 transition-all">
                <Film className="h-6 w-6 text-primary shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
              </div>
              <span className="font-black tracking-widest uppercase text-white/90">
                Movie<span className="text-primary">App</span>
              </span>
            </div>
            <div className="w-10" />
          </div>

          <div className="text-center space-y-2">
            <CardTitle className="text-3xl sm:text-4xl font-black text-white tracking-tight">{t('auth.createAccount')}</CardTitle>
            <CardDescription className="text-white/40 font-medium">{t('auth.joinCommunity')}</CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {success && (
            <Alert className="bg-green-500/10 border-green-500/20 text-green-500 rounded-2xl">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>{t('auth.successRegister')}</AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive rounded-2xl">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {[
              { id: 'username', label: t('auth.username'), type: 'text', placeholder: 'johndoe' },
              { id: 'email', label: t('auth.email'), type: 'email', placeholder: 'name@example.com' },
              { id: 'password', label: t('auth.password'), type: showPassword ? 'text' : 'password' },
              { id: 'confirmPassword', label: t('auth.confirmPassword'), type: 'password' }
            ].map((field) => (
              <div key={field.id} className="space-y-2 group">
                <Label 
                  htmlFor={field.id} 
                  className="text-white/50 text-xs font-bold uppercase tracking-widest ml-1 transition-colors group-focus-within:text-primary group-focus-within:drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]"
                >
                  {field.label}
                </Label>
                <div className="relative">
                  <Input
                    id={field.id}
                    type={field.type}
                    {...register(field.id)}
                    placeholder={field.placeholder}
                    className={`h-12 px-5 rounded-2xl border-white/5 bg-white/5 text-white placeholder:text-white/20 transition-all focus-visible:ring-primary/30 focus-visible:bg-white/[0.08] focus-visible:border-primary/50 ${errors[field.id] ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  />
                  {field.id === 'password' && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-transparent text-white/20 hover:text-white transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  )}
                </div>
                {errors[field.id] && <p className="text-[10px] text-destructive/80 font-bold ml-2 uppercase tracking-tight">{errors[field.id].message}</p>}
              </div>
            ))}

            <Button
              type="submit"
              className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-[0.2em] shadow-[0_10px_30_rgba(239,68,68,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98] hover:shadow-[0_15px_40px_rgba(239,68,68,0.4)] animate-pulse hover:animate-none"
              disabled={loading || success}
            >
              {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : t('auth.register')}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-4 border-t border-white/5 pt-6 pb-8">
          <p className="text-sm text-white/30 font-medium">
            {t('auth.alreadyHaveAccount')}{' '}
            <Link to="/login" className="text-primary font-black hover:text-primary/80 transition-all underline decoration-primary/20 underline-offset-4">
              {t('auth.signInSmall')}
            </Link>
          </p>
        </CardFooter>
      </Card>

      {/* Activate Windows Watermark */}
      <div className="fixed bottom-6 right-6 pointer-events-none select-none z-50 opacity-20 text-left rtl:text-right">
        <p className="text-[11px] font-normal text-white leading-tight tracking-tight">
          Activate Windows
        </p>
        <p className="text-[10px] font-normal text-white/70 tracking-tight">
          Go to Settings to activate Windows.
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;


