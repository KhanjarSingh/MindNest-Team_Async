import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signupUser } from '../../services/authService';
import { Button } from '@/components/ui/button';
import { UserPlus, Sparkles } from 'lucide-react';

export default function SignUp() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'PARTICIPANT',
    adminSecret: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError('');
    if (success) setSuccess('');
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      setError('Username is required');
      return false;
    }

    if (formData.username.trim().length < 2) {
      setError('Username must be at least 2 characters');
      return false;
    }

    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (!formData.password) {
      setError('Password is required');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }

    if (formData.role === 'ADMIN') {
      if (!formData.adminSecret) {
        setError('Admin secret is required');
        return false;
      }

      if (formData.adminSecret !== 'admin123') {
        setError('Invalid admin secret');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await signupUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        adminSecret: formData.role === 'ADMIN' ? formData.adminSecret : undefined,
      });

      setSuccess('Account created successfully! Redirecting...');

      setFormData({
        username: '',
        email: '',
        password: '',
        role: 'PARTICIPANT',
        adminSecret: '',
      });

      setTimeout(() => {
        navigate('/studentdashboard/addidea');
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background image */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10" style={{ backgroundImage: 'url("/Signup-SignIn-Bg.jpg")' }}></div>
      <div className="max-w-md w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20 mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">JOIN US TODAY</span>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Create Account</h1>
          <p className="text-muted-foreground">Join us and share your ideas</p>
        </div>

        {/* Form Card */}
        <div className="bg-card border border-border rounded-3xl p-8 shadow-lg">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-800 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-semibold text-foreground">
                Username
              </label>
              <input
                id="username"
                type="text"
                name="username"
                placeholder="johndoe"
                value={formData.username}
                onChange={handleChange}
                disabled={loading}
                autoComplete="username"
                className="w-full px-4 py-3 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-semibold text-foreground">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                autoComplete="email"
                className="w-full px-4 py-3 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-semibold text-foreground">
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                autoComplete="new-password"
                className="w-full px-4 py-3 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-semibold text-foreground">
                Role
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-3 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              >
                <option value="PARTICIPANT">Participant</option>
                <option value="ADMIN">Admin (Mentor/Incubator)</option>
              </select>
            </div>

            {formData.role === 'ADMIN' && (
              <div className="space-y-2">
                <label htmlFor="adminSecret" className="text-sm font-semibold text-foreground">
                  Admin Secret Password
                </label>
                <input
                  id="adminSecret"
                  type="password"
                  name="adminSecret"
                  placeholder="Enter admin secret"
                  value={formData.adminSecret}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-4 py-3 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Required to register as an admin
                </p>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full rounded-full py-6 text-base font-semibold"
            >
              {loading ? (
                <>
                  <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5 mr-2" />
                  Sign Up
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/signin" className="text-primary font-semibold hover:underline">
              Sign in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
