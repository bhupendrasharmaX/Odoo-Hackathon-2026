import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { Shield, Mail, Phone, Lock, ArrowRight, Loader2, Key } from 'lucide-react';

const emailSchema = zod.object({
  email: zod.string().email('Please enter a valid email address'),
  password: zod.string().min(6, 'Password must be at least 6 characters'),
});

const phoneSchema = zod.object({
  phone: zod.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number'),
  otp: zod.string().regex(/^\d{6}$/, 'Please enter a valid 6-digit OTP code').optional(),
});

import { api } from '../lib/api';

export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'email' | 'phone'>('email');
  
  // OTP States
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(0);

  // Email form
  const { register: regEmail, handleSubmit: handleEmailSubmit, formState: { errors: emailErrors } } = useForm({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: 'admin@transitops.com',
      password: 'password123',
    }
  });

  // Phone form
  const { register: regPhone, handleSubmit: handlePhoneSubmit, formState: { errors: phoneErrors }, watch } = useForm({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phone: '9876543210',
      otp: '',
    }
  });

  const phoneVal = watch('phone');
  const otpVal = watch('otp');

  // Handle countdown timer
  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((t) => t - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleRequestOtp = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!/^[6-9]\d{9}$/.test(phoneVal)) {
      setErrorMessage('Please enter a valid 10-digit mobile number first');
      return;
    }
    setIsLoading(true);
    setErrorMessage('');
    try {
      const success = await api.auth.sendOtp(phoneVal);
      setIsLoading(false);
      if (success) {
        setOtpSent(true);
        setTimer(30);
        alert(api.isOnline() ? 'OTP code sent successfully to your phone!' : 'Mock OTP code sent to your phone: 123456');
      } else {
        setErrorMessage('Failed to send OTP code');
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err.message || 'Error requesting OTP');
    }
  };

  const onEmailSubmit = async (data: any) => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      await api.auth.loginWithPassword(data.email, data.password);
      setIsLoading(false);
      navigate('/dashboard');
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err.message || 'Invalid credentials');
    }
  };

  const onPhoneSubmit = async (data: any) => {
    if (!otpSent) {
      setErrorMessage('Please request an OTP code first');
      return;
    }
    if (!data.otp) {
      setErrorMessage('Please enter the 6-digit OTP code');
      return;
    }
    setIsLoading(true);
    setErrorMessage('');
    try {
      await api.auth.verifyOtp(data.phone, data.otp);
      setIsLoading(false);
      navigate('/dashboard');
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err.message || 'Invalid OTP code');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-4">
      <div className="w-full max-w-md bg-surface-container-lowest rounded-3xl border border-outline-variant/60 shadow-xl p-8 relative overflow-hidden">
        {/* Background Decorative Gradient */}
        <div className="absolute -right-16 -top-16 w-32 h-32 bg-primary/5 rounded-full blur-2xl"></div>
        <div className="absolute -left-16 -bottom-16 w-32 h-32 bg-secondary/5 rounded-full blur-2xl"></div>

        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white mb-3 shadow-md shadow-primary/20">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-on-background">Welcome back</h1>
          <p className="text-sm text-on-surface-variant mt-1 text-center">
            TransitOps Enterprise Logistics Management
          </p>
        </div>

        {/* Login Method Tabs */}
        <div className="flex bg-surface-container-low p-1 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => { setActiveTab('email'); setErrorMessage(''); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'email' ? 'bg-surface-container-lowest text-primary shadow-xs' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Email & Password
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('phone'); setErrorMessage(''); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'phone' ? 'bg-surface-container-lowest text-primary shadow-xs' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Mobile & OTP
          </button>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-error-container text-on-error-container text-sm border border-error/20">
            {errorMessage}
          </div>
        )}

        {activeTab === 'email' ? (
          <form onSubmit={handleEmailSubmit(onEmailSubmit)} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-outline" />
                <input
                  {...regEmail('email')}
                  type="email"
                  placeholder="name@company.com"
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-surface-container-lowest text-sm outline-none transition-all ${
                    emailErrors.email ? 'border-error focus:ring-1 focus:ring-error/20' : 'border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary/20'
                  }`}
                />
              </div>
              {emailErrors.email && (
                <p className="text-xs text-error mt-1.5">{emailErrors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-outline" />
                <input
                  {...regEmail('password')}
                  type="password"
                  placeholder="••••••••"
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-surface-container-lowest text-sm outline-none transition-all ${
                    emailErrors.password ? 'border-error focus:ring-1 focus:ring-error/20' : 'border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary/20'
                  }`}
                />
              </div>
              {emailErrors.password && (
                <p className="text-xs text-error mt-1.5">{emailErrors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-on-surface-variant cursor-pointer">
                <input type="checkbox" className="rounded border-outline-variant text-primary focus:ring-primary" />
                Remember me
              </label>
              <a href="#" className="text-primary hover:underline font-medium">Forgot password?</a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary/95 transition-all shadow-md shadow-primary/10 disabled:opacity-75 disabled:cursor-not-allowed group mt-2"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Sign in
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handlePhoneSubmit(onPhoneSubmit)} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">
                Mobile Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-outline" />
                <input
                  {...regPhone('phone')}
                  type="tel"
                  placeholder="e.g. 9876543210"
                  disabled={otpSent}
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-surface-container-lowest text-sm outline-none transition-all disabled:opacity-70 ${
                    phoneErrors.phone ? 'border-error focus:ring-1 focus:ring-error/20' : 'border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary/20'
                  }`}
                />
              </div>
              {phoneErrors.phone && (
                <p className="text-xs text-error mt-1.5">{phoneErrors.phone.message}</p>
              )}
            </div>

            {otpSent && (
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">
                  Enter 6-Digit OTP *
                </label>
                <div className="relative">
                  <Key className="absolute left-3.5 top-3.5 w-4 h-4 text-outline" />
                  <input
                    {...regPhone('otp')}
                    type="text"
                    maxLength={6}
                    placeholder="e.g. 123456"
                    className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-surface-container-lowest text-sm outline-none transition-all ${
                      phoneErrors.otp ? 'border-error focus:ring-1 focus:ring-error/20' : 'border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary/20'
                    }`}
                  />
                </div>
                {phoneErrors.otp && (
                  <p className="text-xs text-error mt-1.5">{phoneErrors.otp.message}</p>
                )}
                
                <div className="flex justify-between items-center text-xs text-on-surface-variant mt-2">
                  <span>Code sent successfully</span>
                  {timer > 0 ? (
                    <span>Resend OTP in {timer}s</span>
                  ) : (
                    <button onClick={handleRequestOtp} className="text-primary hover:underline font-semibold">Resend OTP</button>
                  )}
                </div>
              </div>
            )}

            {!otpSent ? (
              <button
                type="button"
                onClick={handleRequestOtp}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary/95 transition-all shadow-md shadow-primary/10 disabled:opacity-75"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Request OTP Code'}
              </button>
            ) : (
              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary/95 transition-all shadow-md shadow-primary/10 disabled:opacity-75"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify & Login'}
                </button>
                <button
                  type="button"
                  onClick={() => { setOtpSent(false); setErrorMessage(''); }}
                  className="w-full text-center text-xs text-on-surface-variant hover:text-primary transition-colors py-1"
                >
                  Change Mobile Number
                </button>
              </div>
            )}
          </form>
        )}

        <div className="mt-8 text-center text-xs text-on-surface-variant space-y-1">
          {activeTab === 'email' ? (
            <>
              <div>Email: <span className="font-semibold text-on-surface">admin@transitops.com</span></div>
              <div>Password: <span className="font-semibold text-on-surface">password123</span></div>
            </>
          ) : (
            <>
              <div>Mobile: <span className="font-semibold text-on-surface">9876543210</span></div>
              <div>OTP Code: <span className="font-semibold text-on-surface">123456</span></div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
