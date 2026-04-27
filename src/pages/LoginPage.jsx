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
  Loader2
} from 'lucide-react';
import { useAuthStore } from '@/zustand/useAuthStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const loginAction = useAuthStore((state) => state.login);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const users = JSON.parse(localStorage.getItem('users')) || [];
      const user = users.find((u) => u.email === data.email && u.password === data.password);

      if (!user) {
        throw new Error(t('auth.invalidAuth'));
      }

      const userData = { id: user.id, username: user.username, email: user.email };
      loginAction(userData);

      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-background p-4 transition-colors duration-300'>
      <div className="absolute inset-0 bg-linear-to-tr from-primary/10 via-transparent to-primary/5 pointer-events-none" />

      <Card className="w-full max-w-md border-border bg-card/80 backdrop-blur-md shadow-2xl relative z-10">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="rounded-full">
              <ArrowLeft className="h-5 w-5 rtl:rotate-180" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary rounded-lg">
                <Film className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="font-black tracking-widest uppercase text-foreground">
                Movie<span className="text-primary">App</span>
              </span>
            </div>
            <div className="w-10" />
          </div>

          <div className="text-center space-y-1">
            <CardTitle className="text-3xl font-black text-foreground">{t('auth.welcomeBack')}</CardTitle>
            <CardDescription className="text-muted-foreground">{t('auth.signInToManage')}</CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2 text-left rtl:text-right">
              <Label htmlFor="email">{t('auth.email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                {...register('email')}
                className={errors.email ? "border-destructive focus-visible:ring-destructive" : "bg-muted/50"}
              />
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-2 text-left rtl:text-right">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">{t('auth.password')}</Label>
                <Button variant="link" size="sm" className="px-0 h-auto text-xs text-primary font-bold">
                  {t('auth.forgotPassword')}
                </Button>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  className={errors.password ? "border-destructive focus-visible:ring-destructive" : "bg-muted/50"}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-muted-foreground rtl:left-0 rtl:right-auto"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {errors.password && <p className="text-xs text-destructive mt-1">{errors.password.message}</p>}
            </div>

            <div className="flex items-center space-x-2 rtl:space-x-reverse text-left rtl:text-right">
              <Checkbox id="remember" />
              <label
                htmlFor="remember"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground"
              >
                {t('auth.rememberMe')}
              </label>
            </div>

            <Button
              type="submit"
              className="w-full h-12 font-bold uppercase tracking-wider shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              disabled={loading}
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : t('auth.signIn')}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-4 border-t border-border pt-6">
          <p className="text-sm text-muted-foreground">
            {t('auth.dontHaveAccount')}{' '}
            <Link to="/register" className="text-primary font-black hover:underline transition-all">
              {t('auth.joinElite')}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;

