import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, XCircle, TrendingUp, Download } from 'lucide-react';
import { PredictionResult, PatientData } from '@/lib/prediction';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { generatePDFReport } from '@/lib/generateReport';

interface ResultsPanelProps {
  result: PredictionResult & { patientName?: string };
  patientData?: PatientData;
}

const ResultsPanel = ({ result, patientData }: ResultsPanelProps) => {
  const riskConfig = {
    Low: { gradient: 'var(--gradient-risk-low)', icon: CheckCircle, color: 'hsl(152 60% 42%)' },
    Moderate: { gradient: 'var(--gradient-risk-medium)', icon: AlertTriangle, color: 'hsl(38 92% 50%)' },
    High: { gradient: 'var(--gradient-risk-high)', icon: XCircle, color: 'hsl(0 72% 55%)' },
  };

  const config = riskConfig[result.label];
  const Icon = config.icon;

  const radarData = result.modelScores.map(m => ({
    model: m.name.split(' ').map(w => w[0]).join(''),
    Accuracy: +(m.accuracy * 100).toFixed(1),
    Precision: +(m.precision * 100).toFixed(1),
    Recall: +(m.recall * 100).toFixed(1),
    F1: +(m.f1 * 100).toFixed(1),
  }));

  const barData = result.modelScores.map(m => ({
    name: m.name,
    accuracy: +(m.accuracy * 100).toFixed(1),
  }));

  return (
    <motion.section
      id="results"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-20"
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground font-display mb-1">Prediction Results</h2>
          {result.patientName && <p className="text-lg text-muted-foreground">Patient: <span className="font-semibold text-foreground">{result.patientName}</span></p>}
          {patientData && (
            <button
              onClick={() => generatePDFReport({ patientName: result.patientName || 'Unknown', patientData, result })}
              className="mt-4 inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-primary-foreground transition-all hover:scale-105 hover:shadow-lg"
              style={{ background: 'var(--gradient-primary)' }}
            >
              <Download className="w-5 h-5" />
              Download PDF Report
            </button>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Risk Score */}
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="lg:col-span-1 rounded-2xl p-8 text-center flex flex-col items-center justify-center"
            style={{ background: config.gradient, boxShadow: 'var(--shadow-elevated)' }}
          >
            <Icon className="w-16 h-16 text-primary-foreground mb-4" />
            <div className="text-7xl font-bold text-primary-foreground font-display mb-2">{result.risk}%</div>
            <div className="text-2xl font-semibold text-primary-foreground/90 mb-2">{result.label} Risk</div>
            <p className="text-sm text-primary-foreground/70">Based on Random Forest classifier analysis of 13 clinical parameters</p>
          </motion.div>

          {/* Top Risk Factors */}
          <div className="lg:col-span-2 rounded-2xl p-8 bg-card border border-border" style={{ boxShadow: 'var(--shadow-card)' }}>
            <h3 className="text-lg font-semibold text-foreground font-display mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" /> Top Contributing Factors
            </h3>
            <div className="space-y-4">
              {result.topFactors.map((factor, i) => {
                const maxImpact = result.topFactors[0].impact;
                const width = (factor.impact / maxImpact) * 100;
                return (
                  <motion.div
                    key={factor.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-foreground">{factor.name}</span>
                      <span className="text-muted-foreground">Impact: {factor.impact}</span>
                    </div>
                    <div className="h-3 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${width}%` }}
                        transition={{ duration: 0.8, delay: i * 0.1 }}
                        className="h-full rounded-full"
                        style={{ background: config.gradient }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Model Comparison */}
        <div className="grid lg:grid-cols-2 gap-6 max-w-6xl mx-auto mt-6">
          <div className="rounded-2xl p-8 bg-card border border-border" style={{ boxShadow: 'var(--shadow-card)' }}>
            <h3 className="text-lg font-semibold text-foreground font-display mb-6">Model Accuracy Comparison</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(200 20% 90%)" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'hsl(210 10% 50%)' }} />
                <YAxis domain={[70, 100]} tick={{ fontSize: 11, fill: 'hsl(210 10% 50%)' }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: 'var(--shadow-card)' }} />
                <Bar dataKey="accuracy" fill="hsl(174 62% 38%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-2xl p-8 bg-card border border-border" style={{ boxShadow: 'var(--shadow-card)' }}>
            <h3 className="text-lg font-semibold text-foreground font-display mb-6">Performance Metrics</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 text-muted-foreground font-medium">Model</th>
                    <th className="text-center py-3 text-muted-foreground font-medium">Accuracy</th>
                    <th className="text-center py-3 text-muted-foreground font-medium">Precision</th>
                    <th className="text-center py-3 text-muted-foreground font-medium">Recall</th>
                    <th className="text-center py-3 text-muted-foreground font-medium">F1</th>
                  </tr>
                </thead>
                <tbody>
                  {result.modelScores.map((m, i) => (
                    <tr key={i} className="border-b border-border/50 last:border-0">
                      <td className="py-3 font-medium text-foreground">{m.name}</td>
                      <td className="py-3 text-center text-foreground">{(m.accuracy * 100).toFixed(1)}%</td>
                      <td className="py-3 text-center text-muted-foreground">{(m.precision * 100).toFixed(1)}%</td>
                      <td className="py-3 text-center text-muted-foreground">{(m.recall * 100).toFixed(1)}%</td>
                      <td className="py-3 text-center text-muted-foreground">{(m.f1 * 100).toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default ResultsPanel;
