import { useState } from 'react';
import { Layers, Sparkles, CheckCircle, Zap } from 'lucide-react';
import { getRecommendation, getIndustries, getProblems } from '../../utils/solutionAdvisor';
import styles from './BTPSolutionAdvisor.module.css';

export default function BTPSolutionAdvisor() {
  const [industry, setIndustry] = useState('');
  const [problem, setProblem] = useState('');
  const [result, setResult] = useState(null);

  const industries = getIndustries();
  const problems = getProblems();

  const handleSubmit = () => {
    if (!industry || !problem) return;
    const recommendation = getRecommendation(industry, problem);
    setResult(recommendation);
  };

  return (
    <div className={styles.advisorPage}>
      <div className={styles.advisorCard}>
        <div className={styles.advisorHeader}>
          <div className={styles.advisorIcon}>
            <Layers size={18} />
          </div>
          <div className={styles.advisorTitleGroup}>
            <h2>SAP BTP Solution Advisor</h2>
            <p>Get AI-powered recommendations for SAP BTP services</p>
          </div>
        </div>

        <div className={styles.formSection}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Industry</label>
              <select
                className={styles.formSelect}
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
              >
                <option value="">Select industry...</option>
                {industries.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Business Problem</label>
              <select
                className={styles.formSelect}
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
              >
                <option value="">Select problem...</option>
                {problems.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            <button
              className={styles.submitBtn}
              onClick={handleSubmit}
              disabled={!industry || !problem}
            >
              <Sparkles size={16} />
              Get Recommendation
            </button>
          </div>
        </div>

        {result && (
          <div className={styles.resultSection}>
            <h3 className={styles.resultTitle}>
              <Zap size={16} color="#0070f2" />
              Recommended SAP BTP Services
            </h3>

            <div className={styles.servicesList}>
              {result.services.map((service) => (
                <div key={service} className={styles.serviceItem}>
                  <Layers size={12} />
                  {service}
                </div>
              ))}
            </div>

            <div className={styles.reasoning}>{result.reasoning}</div>

            <div className={styles.benefitsList}>
              <h4 style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                Expected Benefits
              </h4>
              {result.benefits.map((benefit, i) => (
                <div key={i} className={styles.benefitItem}>
                  <CheckCircle size={14} className={styles.benefitIcon} />
                  {benefit}
                </div>
              ))}
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginRight: '0.5rem' }}>
                Implementation Complexity:
              </span>
              <span className={`${styles.complexityBadge} ${styles[result.complexity.toLowerCase()]}`}>
                {result.complexity}
              </span>
            </div>
          </div>
        )}

        {!result && (
          <div className={styles.noResult}>
            Select an industry and business problem to get AI-powered SAP BTP service recommendations.
          </div>
        )}
      </div>
    </div>
  );
}
