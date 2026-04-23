import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router';
import { 
  Box, 
  Container, 
  Typography, 
  TextField, 
  Button, 
  IconButton, 
  InputAdornment, 
  Alert,
  Paper,
  ThemeProvider,
  createTheme,
  CssBaseline,
  CircularProgress
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  MovieFilter,
  ArrowBack
} from '@mui/icons-material';
import { useAuthStore } from '@/zustand/useAuthStore';

// Dark Cinematic Theme for MUI
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#e50914', // Netflix Red
    },
    background: {
      default: '#0a0a0a',
      paper: '#141414',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b3b3b3',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 900,
      letterSpacing: '-0.02em',
    },
  },
  shape: {
    borderRadius: 12,
  },
});

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
  const navigate = useNavigate();
  const loginAction = useAuthStore((state) => state.login);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      const users = JSON.parse(localStorage.getItem('users')) || [];
      if (users.find((u) => u.email === data.email)) {
        throw new Error('Email already registered');
      }

      const newUser = { id: Date.now(), username: data.username, email: data.email };
      users.push({ ...newUser, password: data.password });
      localStorage.setItem('users', JSON.stringify(users));
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box 
        sx={{ 
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(circle at top left, rgba(229, 9, 20, 0.15) 0%, transparent 40%), radial-gradient(circle at bottom right, rgba(229, 9, 20, 0.05) 0%, transparent 40%)',
          py: 4,
          px: 2
        }}
      >
        <Container maxWidth="sm">
          <Paper 
            elevation={24}
            sx={{ 
              p: { xs: 3, md: 6 },
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
              background: 'rgba(20, 20, 20, 0.8)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 4
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <IconButton onClick={() => navigate(-1)} color="inherit">
                    <ArrowBack />
                </IconButton>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MovieFilter color="primary" sx={{ fontSize: 32 }} />
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                        <span style={{ color: '#e50914' }}>MOVIE</span>APP
                    </Typography>
                </Box>
                <Box sx={{ width: 40 }} /> {/* Spacer */}
            </Box>

            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Typography variant="h4" gutterBottom>
                Create Account
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Join our elite movie community today
              </Typography>
            </Box>

            {success && (
              <Alert severity="success" sx={{ borderRadius: 2 }}>
                Account created successfully! Redirecting to login...
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <TextField
                fullWidth
                label="Username"
                {...register('username')}
                error={!!errors.username}
                helperText={errors.username?.message}
                variant="outlined"
              />

              <TextField
                fullWidth
                label="Email Address"
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
                variant="outlined"
              />

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                error={!!errors.password}
                helperText={errors.password?.message}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Confirm Password"
                type="password"
                {...register('confirmPassword')}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
              />

              <Button
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                disabled={loading || success}
                sx={{ 
                  py: 1.5, 
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  textTransform: 'none',
                  boxShadow: '0 8px 16px rgba(229, 9, 20, 0.3)',
                  '&:hover': {
                    boxShadow: '0 12px 20px rgba(229, 9, 20, 0.4)',
                  }
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Register Now'}
              </Button>

              <Typography variant="body2" align="center" sx={{ mt: 2, color: 'text.secondary' }}>
                Already have an account?{' '}
                <Button 
                  onClick={() => navigate('/login')} 
                  sx={{ textTransform: 'none', fontWeight: 'bold' }}
                >
                  Sign In
                </Button>
              </Typography>
            </form>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default RegisterPage;
