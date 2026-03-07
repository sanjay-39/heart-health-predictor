import { useState, useRef } from 'react';
import HeroSection from '@/components/HeroSection';
import PredictionForm from '@/components/PredictionForm';
import ResultsPanel from '@/components/ResultsPanel';
import HowItWorks from '@/components/HowItWorks';
import { predictHeartDisease, PatientData, PredictionResult } from '@/lib/prediction';
import { Heart } from 'lucide-react';

const Index = () => {
  const [result, setResult] = useState<PredictionResult & { patientName?: string } | null>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleGetStarted = () => {
    document.getElementById('prediction-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = (data: PatientData, patientName: string) => {
    const prediction = predictHeartDisease(data);
    setResult({ ...prediction, patientName });
    setTimeout(() => {
      document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-foreground/80 backdrop-blur-xl border-b border-border/10">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary-foreground font-display font-bold text-lg">
            <Heart className="w-5 h-5" style={{ color: 'hsl(174 62% 50%)' }} />
            CardioPredict
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-primary-foreground/70">
            <a href="#how-it-works" className="hover:text-primary-foreground transition-colors">How It Works</a>
            <a href="#prediction-form" className="hover:text-primary-foreground transition-colors">Predict</a>
            <button
              onClick={handleGetStarted}
              className="px-5 py-2 rounded-lg text-primary-foreground font-medium transition-all hover:opacity-90"
              style={{ background: 'var(--gradient-primary)' }}
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <HeroSection onGetStarted={handleGetStarted} />
      <HowItWorks />
      <PredictionForm onSubmit={handleSubmit} />
      {result && <ResultsPanel result={result} />}

      {/* Footer */}
      <footer className="py-12 border-t border-border bg-card">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm text-muted-foreground">
            CardioPredict — ML-Based Heart Disease Prediction System · Cleveland Heart Disease Dataset · For educational purposes only
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
