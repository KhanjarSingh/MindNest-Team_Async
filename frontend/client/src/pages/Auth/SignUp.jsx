import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signupUser } from '../../services/authService';
import '../../styles/auth.css';

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
        navigate('/signin');
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className={`auth-card ${loading ? 'loading' : ''}`}>
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Join us and share your ideas</p>
        </div>

        {error && <div className="error-alert">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              name="username"
              className="form-input"
              placeholder="johndoe"
              value={formData.username}
              onChange={handleChange}
              disabled={loading}
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              name="email"
              className="form-input"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              className="form-input"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              autoComplete="new-password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              name="role"
              className="form-input"
              value={formData.role}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="PARTICIPANT">Participant</option>
              <option value="ADMIN">Admin (Mentor/Incubator)</option>
            </select>
          </div>

          {formData.role === 'ADMIN' && (
            <div className="form-group">
              <label htmlFor="adminSecret">Admin Secret Password</label>
              <input
                id="adminSecret"
                type="password"
                name="adminSecret"
                className="form-input"
                placeholder="Enter admin secret"
                value={formData.adminSecret}
                onChange={handleChange}
                disabled={loading}
              />
              <small style={{ color: '#6b7280', fontSize: '12px', marginTop: '4px' }}>
                Required to register as an admin
              </small>
            </div>
          )}

          <button
            type="submit"
            className={`submit-btn ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/signin">Sign in here</Link>
        </div>
      </div>
    </div>
  );
}
