import { motion } from 'framer-motion';
import { Database, Cpu, BarChart3, Stethoscope } from 'lucide-react';

const steps = [
  { icon: Database, title: 'Data Collection', desc: 'Cleveland Heart Disease dataset with 303 instances and 13 clinical attributes including age, cholesterol, blood pressure, and more.' },
  { icon: Cpu, title: 'Preprocessing', desc: 'Data cleaning, normalization, handling missing values, and feature selection to enhance model performance.' },
  { icon: BarChart3, title: 'Model Training', desc: 'Training Random Forest, Logistic Regression, Decision Tree, and KNN classifiers with cross-validation.' },
  { icon: Stethoscope, title: 'Prediction', desc: 'Ensemble-based risk assessment providing accurate heart disease probability with contributing factor analysis.' },
];

const HowItWorks = () => (
  <section id="how-it-works" className="py-20 bg-secondary/50">
    <div className="container mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground font-display mb-3">How It Works</h2>
        <p className="text-muted-foreground max-w-lg mx-auto">A four-stage machine learning pipeline for cardiac risk assessment</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="relative p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all group"
            style={{ boxShadow: 'var(--shadow-card)' }}
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-primary-foreground" style={{ background: 'var(--gradient-primary)' }}>
              <step.icon className="w-6 h-6" />
            </div>
            <div className="text-xs font-semibold text-primary mb-2">STEP {i + 1}</div>
            <h3 className="text-lg font-semibold text-foreground font-display mb-2">{step.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
