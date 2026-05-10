'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

interface SignUpFormValues {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  role: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

interface Props {
  onSwitchToLogin: () => void;
}

const passwordStrength = (pw: string): { score: number; label: string; color: string } => {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (pw.length >= 12) score++;
  if (score <= 1) return { score, label: 'Weak', color: 'bg-danger' };
  if (score <= 2) return { score, label: 'Fair', color: 'bg-warning' };
  if (score <= 3) return { score, label: 'Good', color: 'bg-info' };
  return { score, label: 'Strong', color: 'bg-success' };
};

export default function SignUpForm({ onSwitchToLogin }: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpFormValues>();

  const passwordValue = watch('password', '');
  const strength = passwordStrength(passwordValue);

  const onSubmit = async (_data: SignUpFormValues) => {
    setIsLoading(true);
    // Backend: replace with POST /api/auth/register
    await new Promise((r) => setTimeout(r, 1400));
    setIsLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center py-8 fade-in">
        <div className="w-16 h-16 rounded-2xl bg-success-bg flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={32} className="text-success" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">Account created!</h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-xs mx-auto">
          Your PayFlow account is under review. You&apos;ll receive an email within 1 business day
          once approved by your account administrator.
        </p>
        <button onClick={onSwitchToLogin} className="btn-primary px-8">
          Back to sign in
        </button>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">Create your account</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Set up access to your organization&apos;s PayFlow workspace
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Name row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="signup-firstname"
              className="block text-sm font-semibold text-foreground mb-1.5"
            >
              First name
            </label>
            <input
              id="signup-firstname"
              type="text"
              autoComplete="given-name"
              placeholder="Rafael"
              className={`input-field ${errors.firstName ? 'border-danger' : ''}`}
              {...register('firstName', { required: 'Required' })}
            />
            {errors.firstName && (
              <p className="mt-1 text-xs text-danger">{errors.firstName.message}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="signup-lastname"
              className="block text-sm font-semibold text-foreground mb-1.5"
            >
              Last name
            </label>
            <input
              id="signup-lastname"
              type="text"
              autoComplete="family-name"
              placeholder="Cruz"
              className={`input-field ${errors.lastName ? 'border-danger' : ''}`}
              {...register('lastName', { required: 'Required' })}
            />
            {errors.lastName && (
              <p className="mt-1 text-xs text-danger">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="signup-email"
            className="block text-sm font-semibold text-foreground mb-1.5"
          >
            Work email
          </label>
          <p className="text-xs text-muted-foreground mb-1.5">
            Use your company email — personal addresses are not accepted
          </p>
          <input
            id="signup-email"
            type="email"
            autoComplete="email"
            placeholder="rafael@company.com"
            className={`input-field ${errors.email ? 'border-danger' : ''}`}
            {...register('email', {
              required: 'Work email is required',
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

        {/* Company */}
        <div>
          <label
            htmlFor="signup-company"
            className="block text-sm font-semibold text-foreground mb-1.5"
          >
            Company name
          </label>
          <input
            id="signup-company"
            type="text"
            autoComplete="organization"
            placeholder="Nexus Digital PH"
            className={`input-field ${errors.company ? 'border-danger' : ''}`}
            {...register('company', { required: 'Company name is required' })}
          />
          {errors.company && (
            <p className="mt-1.5 text-xs text-danger flex items-center gap-1">
              <AlertCircle size={11} />
              {errors.company.message}
            </p>
          )}
        </div>

        {/* Role */}
        <div>
          <label
            htmlFor="signup-role"
            className="block text-sm font-semibold text-foreground mb-1.5"
          >
            Requested access level
          </label>
          <p className="text-xs text-muted-foreground mb-1.5">
            Your admin will approve or adjust this after registration
          </p>
          <div className="relative">
            <select
              id="signup-role"
              className={`input-field appearance-none pr-8 ${errors.role ? 'border-danger' : ''}`}
              {...register('role', { required: 'Select an access level' })}
            >
              <option value="">Select access level…</option>
              <option value="merchant">Merchant — manage own transactions</option>
              <option value="viewer">Viewer — read-only analytics access</option>
              <option value="admin">Admin — full platform access (requires approval)</option>
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
              ▾
            </span>
          </div>
          {errors.role && (
            <p className="mt-1.5 text-xs text-danger flex items-center gap-1">
              <AlertCircle size={11} />
              {errors.role.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="signup-password"
            className="block text-sm font-semibold text-foreground mb-1.5"
          >
            Password
          </label>
          <p className="text-xs text-muted-foreground mb-1.5">
            Min. 8 characters with uppercase, number, and special character
          </p>
          <div className="relative">
            <input
              id="signup-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Create a strong password"
              className={`input-field pr-10 ${errors.password ? 'border-danger' : ''}`}
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'Minimum 8 characters required' },
                pattern: {
                  value: /^(?=.*[A-Z])(?=.*[0-9])/,
                  message: 'Must include an uppercase letter and a number',
                },
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {/* Strength indicator */}
          {passwordValue && (
            <div className="mt-2 space-y-1">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={`strength-${i}`}
                    className={`flex-1 h-1 rounded-full transition-all ${
                      strength.score >= i ? strength.color : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Password strength:{' '}
                <span
                  className={`font-semibold ${
                    strength.label === 'Strong' ?'text-success'
                      : strength.label === 'Good' ?'text-info'
                      : strength.label === 'Fair' ?'text-warning' :'text-danger'
                  }`}
                >
                  {strength.label}
                </span>
              </p>
            </div>
          )}
          {errors.password && (
            <p className="mt-1.5 text-xs text-danger flex items-center gap-1">
              <AlertCircle size={11} />
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label
            htmlFor="signup-confirm"
            className="block text-sm font-semibold text-foreground mb-1.5"
          >
            Confirm password
          </label>
          <div className="relative">
            <input
              id="signup-confirm"
              type={showConfirm ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Re-enter your password"
              className={`input-field pr-10 ${errors.confirmPassword ? 'border-danger' : ''}`}
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (val) =>
                  val === passwordValue || 'Passwords do not match',
              })}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1.5 text-xs text-danger flex items-center gap-1">
              <AlertCircle size={11} />
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Terms */}
        <div>
          <div className="flex items-start gap-2.5">
            <input
              id="agree-terms"
              type="checkbox"
              className="w-4 h-4 mt-0.5 rounded border-border text-primary accent-primary cursor-pointer flex-shrink-0"
              {...register('agreeToTerms', {
                required: 'You must accept the terms to continue',
              })}
            />
            <label
              htmlFor="agree-terms"
              className="text-sm text-muted-foreground cursor-pointer"
            >
              I agree to the{' '}
              <button type="button" className="text-primary font-semibold hover:underline">
                Terms of Service
              </button>{' '}
              and{' '}
              <button type="button" className="text-primary font-semibold hover:underline">
                Privacy Policy
              </button>
              . I understand that account access requires admin approval.
            </label>
          </div>
          {errors.agreeToTerms && (
            <p className="mt-1.5 text-xs text-danger flex items-center gap-1">
              <AlertCircle size={11} />
              {errors.agreeToTerms.message}
            </p>
          )}
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
              <span>Creating account…</span>
            </>
          ) : (
            'Create PayFlow account'
          )}
        </button>
      </form>

      {/* Switch to login */}
      <p className="text-center text-sm text-muted-foreground mt-5">
        Already have an account?{' '}
        <button
          onClick={onSwitchToLogin}
          className="text-primary font-semibold hover:underline"
        >
          Sign in
        </button>
      </p>
    </div>
  );
}