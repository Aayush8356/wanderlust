import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
// LoadingSpinner not needed here since loading state is handled by button text

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (error: any) {
      setError(error.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{background: 'var(--gradient-dark)', paddingTop: '6rem', paddingBottom: '2rem'}}>
      <div className="premium-form-card">
        {/* Close Button */}
        <Link 
          to="/" 
          className="close-btn"
          title="Back to Home"
        >
          ×
        </Link>

        <div className="form-header">
          <div className="form-icon">🧭</div>
          <h2 className="form-title">Welcome back</h2>
          <p className="form-subtitle">Sign in to your account</p>
        </div>
        
        <form className="form-body" onSubmit={handleSubmit}>
          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}
          
          <div className="form-fields">
            <div className="form-field">
              <label htmlFor="email" className="form-label">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="form-input"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-field">
              <label htmlFor="password" className="form-label">Password</label>
              <div className="password-field">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  className="form-input"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="form-submit-btn"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>

          <div className="form-footer">
            <p>
              Don't have an account?{' '}
              <Link to="/register" className="form-link">Sign up here</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;