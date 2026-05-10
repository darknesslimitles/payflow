'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import DemoCredentials from './DemoCredentials';

interface LoginFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

// Valid demo credentials for mock auth
const VALID_CREDENTIALS = [
  { email: 'admin@payflow.io', password: 'Admin@PF2026' },
  { email: 'merchant@nexusdigital.ph', password: 'Merchant@PF26' },
  { email: 'viewer@payflow.io', password: 'Viewer@PF2026' },
];

interface Props {
  onSwitchToSignup: () => void;
}

export default function LoginForm({ onSwitchToSignup }: Props) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  const handleDemoSelect = (email: string, password: string) => {
    setValue('email', email, { shouldValidate: true });
    setValue('password', password, { shouldValidate: true });
    setAuthError('');
  };

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setAuthError('');
    // Backend: replace with POST /api/auth/login
    await new Promise((r) => setTimeout(r, 1200));
    const valid = VALID_CREDENTIALS.some(
      (c) => c.email === data.email && c.password === data.password
    );
    if (valid) {
      router.push('/');
    } else {
      setAuthError(
        'Invalid credentials — use the demo accounts below to sign in'
      );
    }
    setIsLoading(false);
  };

  return (
    <div className="fade-in">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground">Welcome back</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Sign in to your PayFlow account to continue
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {/* Auth error */}
        {authError && (
          <div className="flex items-start gap-3 p-3.5 bg-danger-bg border border-danger/20 rounded-xl">
            <AlertCircle size={16} className="text-danger flex-shrink-0 mt-0.5" />
            <p className="text-sm text-danger">{authError}</p>
          </div>
        )}

        {/* Email */}
        <div>
          <label
            htmlFor="login-email"
            className="block text-sm font-semibold text-foreground mb-1.5"
          >
            Email address
          </label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            className={`input-field ${errors.email ? 'border-danger focus:ring-danger' : ''}`}
            {...register('email', {
              required: 'Email address is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Enter a valid email address',
              },
            })}
          />
          {errors.email && (
            <p className="mt-1.5 text-xs text-danger flex items-center gap-1">
              <AlertCircle size={11} />
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="login-password"
              className="block text-sm font-semibold text-foreground"
            >
              Password
            </label>
            <button
              type="button"
              className="text-xs text-primary font-medium hover:underline"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Enter your password"
              className={`input-field pr-10 ${errors.password ? 'border-danger focus:ring-danger' : ''}`}
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' },
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1.5 text-xs text-danger flex items-center gap-1">
              <AlertCircle size={11} />
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Remember me */}
        <div className="flex items-center gap-2.5">
          <input
            id="remember-me"
            type="checkbox"
            className="w-4 h-4 rounded border-border text-primary accent-primary cursor-pointer"
            {...register('rememberMe')}
          />
          <label
            htmlFor="remember-me"
            className="text-sm text-muted-foreground cursor-pointer select-none"
          >
            Keep me signed in for 30 days
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full py-3 text-base justify-center"
          style={{ minHeight: '48px' }}
        >
          {isLoading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Signing in…</span>
            </>
          ) : (
            'Sign in to PayFlow'
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-muted-foreground">or</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Switch to signup */}
      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <button
          onClick={onSwitchToSignup}
          className="text-primary font-semibold hover:underline"
        >
          Create one
        </button>
      </p>

      {/* Demo credentials */}
      <DemoCredentials onSelect={handleDemoSelect} />

      {/* Legal */}
      <p className="text-xs text-muted-foreground text-center mt-5">
        Protected by PayFlow security.{' '}
        <button className="underline hover:text-foreground">Privacy Policy</button>
        {' · '}
        <button className="underline hover:text-foreground">Terms of Service</button>
      </p>
    </div>
  );
}