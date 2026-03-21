import { motion } from 'framer-motion';
import { Activity, Droplets, Calendar, Cookie, HeartPulse, Heart, Shield, Apple, AlertCircle } from 'lucide-react';
import { PatientData, PredictionResult } from '@/lib/prediction';
import { generateRecommendations, Recommendation } from '@/lib/recommendations';

interface HealthRecommendationsProps {
  patientData: PatientData;
  result: PredictionResult & { patientName?: string };
}

const iconMap: Record<string, React.ElementType> = {
  activity: Activity,
  droplets: Droplets,
  calendar: Calendar,
  cookie: Cookie,
  'heart-pulse': HeartPulse,
  heart: Heart,
  shield: Shield,
  apple: Apple,
};

const priorityStyles: Record<string, { border: string; bg: string; badge: string; badgeText: string }> = {
  high: {
    border: 'border-destructive/30',
    bg: 'bg-destructive/5',
    badge: 'bg-destructive/15 text-destructive',
    badgeText: 'High Priority',
  },
  medium: {
    border: 'border-accent/30',
    bg: 'bg-accent/5',
    badge: 'bg-accent/15 text-accent-foreground',
    badgeText: 'Medium Priority',
  },
  low: {
    border: 'border-primary/20',
    bg: 'bg-primary/5',
    badge: 'bg-primary/15 text-primary',
    badgeText: 'Maintain',
  },
};

const HealthRecommendations = ({ patientData, result }: HealthRecommendationsProps) => {
  const recommendations = generateRecommendations(patientData, result);

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="py-16"
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <HeartPulse className="w-4 h-4" />
            Personalized Health Guidance
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground font-display">
            Health Recommendations
          </h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Based on your clinical data and predicted risk level, here are tailored suggestions to improve your cardiovascular health.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5 max-w-5xl mx-auto">
          {recommendations.map((rec, i) => {
            const IconComp = iconMap[rec.icon] || AlertCircle;
            const style = priorityStyles[rec.priority];

            return (
              <motion.div
                key={rec.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className={`rounded-2xl p-6 border ${style.border} ${style.bg} bg-card`}
                style={{ boxShadow: 'var(--shadow-card)' }}
              >
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-semibold text-foreground text-sm">{rec.title}</h3>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${style.badge}`}>
                        {style.badgeText}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{rec.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground italic max-w-lg mx-auto">
            These recommendations are for educational purposes only and do not constitute medical advice. Always consult a qualified healthcare professional.
          </p>
        </div>
      </div>
    </motion.section>
  );
};

export default HealthRecommendations;
