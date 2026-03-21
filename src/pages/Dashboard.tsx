import { motion } from 'framer-motion';
import { Heart, Activity, Brain, ShieldCheck, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const features = [
    { icon: Heart, title: '13 Clinical Features', desc: 'Comprehensive patient data analysis from the Cleveland dataset' },
    { icon: Brain, title: '4 ML Algorithms', desc: 'Random Forest, Logistic Regression, Decision Tree & KNN' },
    { icon: Activity, title: '88.7% Accuracy', desc: 'Random Forest as the top performing classifier' },
    { icon: ShieldCheck, title: 'Early Detection', desc: 'Reduce cardiac risk with timely predictions' },
  ];

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl p-8 md:p-12 mb-10"
        style={{ background: 'var(--gradient-hero)' }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-primary-foreground/80 text-sm font-medium mb-6">
          <Activity className="w-4 h-4" />
          ML-Powered Cardiac Risk Assessment
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-primary-foreground leading-tight mb-4 font-display">
          Heart Disease
          <span className="block" style={{ color: 'hsl(174 62% 50%)' }}>Prediction System</span>
        </h1>
        <p className="text-primary-foreground/70 mb-8 max-w-lg leading-relaxed">
          Leveraging machine learning algorithms on the Cleveland Heart Disease dataset to provide early cardiac risk assessment.
        </p>
        <button
          onClick={() => navigate('/predict')}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-primary-foreground transition-all hover:scale-105 hover:shadow-lg"
          style={{ background: 'var(--gradient-primary)' }}
        >
          Start Prediction
          <ArrowRight className="w-5 h-5" />
        </button>
      </motion.div>

      {/* Feature cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {features.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.08 }}
            className="p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all"
            style={{ boxShadow: 'var(--shadow-card)' }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-primary-foreground"
              style={{ background: 'var(--gradient-primary)' }}
            >
              <item.icon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-foreground font-display mb-1">{item.title}</h3>
            <p className="text-sm text-muted-foreground">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
