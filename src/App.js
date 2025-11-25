// App.js
import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

// Components
import Header from './components/header';
import GoalPlanner from './components/GoalPlanner/goalplanner';

// Pages
import Dashboard from './pages/dashboard';
import Analyzer from './pages/analyzer';
import Calculators from './pages/calculators';
import ProgressPage from './pages/progress';
import AuthPage from './pages/auth';

// Calculators
import TdeeCalculator from './calculators/TdeeCalculator';
import ProteinCalculator from './calculators/ProteinCalculator';
import OneRepMaxCalculator from './calculators/OneRepMaxCalculator';

// Exercises
import ExerciseLibrary from './pages/ExerciseLibrary/ExerciseLibrary';
import ExerciseDetails from './pages/ExerciseLibrary/ExerciseDetails';

// Workouts
import WorkoutLogger from './pages/Workouts/WorkoutLogger';

// ----------------------
// Protected Route Wrapper
// ----------------------
function ProtectedRoute({ session, loading, children }) {
  if (loading) {
    return (
      <div
        style={{
          color: '#9aa0a6',
          textAlign: 'center',
          marginTop: '100px',
        }}
      >
        Loading...
      </div>
    );
  }

  if (!session) return <Navigate to="/auth" replace />;
  return children;
}

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load session once on mount
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data?.session ?? null);
      setLoading(false);
    };
    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setLoading(false);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    navigate('/');
  };

  return (
    <div>
      <Header onLogout={handleLogout} session={session} />

      <main>
        <Routes>
          {/* Public routes */}
          <Route path="/auth" element={<AuthPage />} />

          <Route path="/calculators" element={<Calculators />} />
          <Route path="/calculators/tdee" element={<TdeeCalculator />} />
          <Route path="/calculators/protein" element={<ProteinCalculator />} />
          <Route path="/calculators/1rm" element={<OneRepMaxCalculator />} />

          <Route path="/analyzer" element={<Analyzer />} />

          <Route path="/exercises" element={<ExerciseLibrary />} />
          <Route path="/exercises/:id" element={<ExerciseDetails />} />

          <Route path="/workouts" element={<WorkoutLogger />} />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute session={session} loading={loading}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/goalplanner"
            element={
              <ProtectedRoute session={session} loading={loading}>
                <GoalPlanner />
              </ProtectedRoute>
            }
          />

          <Route
            path="/progress"
            element={
              <ProtectedRoute session={session} loading={loading}>
                <ProgressPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
