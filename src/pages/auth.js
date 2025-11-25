import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import '../pages/auth.css';

function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleAuth = async () => {
    setMessage('');

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        // ✅ Redirect to Dashboard (root route)
        setMessage('✅ Logged in!');
        navigate('/'); 
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage('✅ Account created! Check your email to confirm.');
      }
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">{isLogin ? 'Sign In' : 'Register'}</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleAuth}>
          {isLogin ? 'Sign In' : 'Register'}
        </button>

        <p className="switch-text" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'No account? Register here' : 'Already have an account? Sign in'}
        </p>

        {message && <p className="auth-message">{message}</p>}
      </div>
    </div>
  );
}

export default AuthPage;
