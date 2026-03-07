import { motion } from 'framer-motion';
import { Heart, Activity, Brain, ShieldCheck } from 'lucide-react';

interface HeroSectionProps {
  onGetStarted: () => void;
}

const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden" style={{ background: 'var(--gradient-hero)' }}>
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-primary/30"
            style={{
              width: 200 + i * 120,
              height: 200 + i * 120,
              top: '50%',
              left: '60%',
              transform: 'translate(-50%, -50%)',
            }}
            animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.3 }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary-foreground/80 text-sm font-medium mb-6">
              <Activity className="w-4 h-4" />
              ML-Powered Cardiac Risk Assessment
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-6 font-display">
              Heart Disease
              <span className="block" style={{ color: 'hsl(174 62% 50%)' }}>Prediction System</span>
            </h1>
            <p className="text-lg text-primary-foreground/70 mb-8 max-w-lg leading-relaxed">
              Leveraging machine learning algorithms on the Cleveland Heart Disease dataset to provide early cardiac risk assessment. Powered by Random Forest, Logistic Regression, Decision Tree & KNN.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={onGetStarted}
                className="px-8 py-4 rounded-xl font-semibold text-primary-foreground transition-all hover:scale-105 hover:shadow-lg"
                style={{ background: 'var(--gradient-primary)' }}
              >
                Start Prediction
              </button>
              <a
                href="#how-it-works"
                className="px-8 py-4 rounded-xl font-semibold text-primary-foreground/80 border border-primary-foreground/20 hover:bg-primary-foreground/10 transition-all"
              >
                How It Works
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:grid grid-cols-2 gap-4"
          >
            {[
              { icon: Heart, title: '13 Clinical Features', desc: 'Comprehensive patient data analysis' },
              { icon: Brain, title: '4 ML Algorithms', desc: 'Ensemble & individual models' },
              { icon: Activity, title: '88.7% Accuracy', desc: 'Random Forest top performer' },
              { icon: ShieldCheck, title: 'Early Detection', desc: 'Reduce cardiac risk effectively' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="p-5 rounded-2xl bg-primary-foreground/5 backdrop-blur-sm border border-primary-foreground/10 hover:bg-primary-foreground/10 transition-colors"
              >
                <item.icon className="w-8 h-8 mb-3" style={{ color: 'hsl(174 62% 50%)' }} />
                <h3 className="text-primary-foreground font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-primary-foreground/60">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
