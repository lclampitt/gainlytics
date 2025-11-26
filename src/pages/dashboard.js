import React from 'react';
import { Link } from 'react-router-dom';
import GoalPlanner from '../components/GoalPlanner/goalplanner';
import './dashboard.css';

function Card({ title, cta, children }) {
  return (
    <div className="dashboard-card">
      <div className="dashboard-card-header">
        <h2 className="dashboard-card-title">{title}</h2>
        {cta && (
          <Link to={cta.href} className="dashboard-cta">
            {cta.label}
          </Link>
        )}
      </div>
      <div className="dashboard-card-content">{children}</div>
    </div>
  );
}

function OnboardingChecklist() {
  const STORAGE_KEY = 'gainlytics_checklist_v1';

  const defaultSteps = [
    { id: 'photo', label: 'Add measurements or photo', route: '/analyzer' },
    { id: 'goal', label: 'Make a goal', route: '/goalplanner' },
    { id: 'workout', label: 'Log workout', route: '/workouts' },
    { id: 'progress', label: 'Update progress', route: '/progress' },
  ];

  const [completed, setCompleted] = React.useState({});

  React.useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (saved) setCompleted(saved);
    } catch {}
  }, []);

  React.useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(completed));
  }, [completed]);

  const toggle = (id) => {
    setCompleted((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="onboarding-box">
      <p className="onboarding-title">Getting started</p>
      <ul className="onboarding-list">
        {defaultSteps.map((step) => (
          <li key={step.id} className="onboarding-item">
            <button
              className={`onboarding-checkbox ${
                completed[step.id] ? 'checked' : ''
              }`}
              onClick={() => toggle(step.id)}
            >
              {completed[step.id] && <span className="checkmark">✓</span>}
            </button>

            <div
              className="onboarding-text"
              onClick={() => (window.location.href = step.route)}
            >
              <span className="onboarding-label">{step.label}</span>
              <span className="onboarding-open">Open</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="dashboard-hero">
          <p className="dashboard-eyebrow">Gainlytics Dashboard</p>
          <h1 className="dashboard-page-title">Home</h1>
          <p className="dashboard-page-subtitle">
            Welcome back! Your body analysis, goals, and tools in one place.
          </p>
        </div>
        <OnboardingChecklist />
      </div>

      <div className="dashboard-grid">
        <Card
          title="Body Analysis"
          cta={{ href: '/analyzer', label: 'Start Analysis' }}
        >
          <p>
            Upload a photo (JPG/PNG) or enter measurements to estimate your body
            type and body fat % with the AI Analyzer.
          </p>
        </Card>

        <Card title="Your Plan" cta={{ href: '/goalplanner', label: 'Open' }}>
          <GoalPlanner compact />
        </Card>

        <Card
          title="Calculators"
          cta={{ href: '/calculators', label: 'Open' }}
        >
          <ul>
            <li>Calorie (TDEE) &amp; Protein</li>
            <li>1RM Estimator</li>
            <li>Deficit Time Calculator</li>
          </ul>
        </Card>

        <Card title="Progress" cta={{ href: '/progress', label: 'View' }}>
          <p>
            See charts for weight, body fat %, and measurements over time from
            your logged data.
          </p>
        </Card>

        <div className="dashboard-subgrid">
          <Card
            title="Exercise Library"
            cta={{ href: '/exercises', label: 'Browse' }}
          >
            <p>Filter by muscle group and learn form cues for each exercise.</p>
          </Card>

          <Card
            title="Workouts"
            cta={{ href: '/workouts', label: 'Log Workout' }}
          >
            <p>Track sets, reps, weight, RPE, and notes for every session.</p>
          </Card>
        </div>

        <Card title="Help" cta={{ href: '/help', label: 'Contact Us' }}>
          <p>
            Need something? Reach out via email or the contact form and we’ll
            get back to you.
          </p>
        </Card>
      </div>
    </div>
  );
}
