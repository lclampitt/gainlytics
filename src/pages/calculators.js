import { Link } from 'react-router-dom';
import './CalculatorsPage.css';

const calculators = [
  {
    title: 'TDEE Calculator',
    image: '/images/TDEE.png',
    path: '/calculators/tdee',
  },
  {
    title: 'Protein Calculator',
    image: '/images/Protein.png',
    path: '/calculators/protein',
  },
  {
    title: '1RM Calculator',
    image: '/images/1RM.png',
    path: '/calculators/1rm',
  },
];

function CalculatorsPage() {
  return (
    <div className="calculators-container">
      <h1 className="calculators-title">Fitness Calculators</h1>
      <div className="calculator-grid">
        {calculators.map((calc, index) => (
          <Link to={calc.path} key={index} className="calculator-card">
            <img src={calc.image} alt={calc.title} />
            <h2>{calc.title}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default CalculatorsPage;
