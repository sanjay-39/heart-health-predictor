import { motion } from 'framer-motion';
import { History, Trash2, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

export interface HistoryEntry {
  id: string;
  patientName: string;
  risk: number;
  label: 'Low' | 'Moderate' | 'High';
  timestamp: string;
}

interface PredictionHistoryProps {
  history: HistoryEntry[];
  onClear: () => void;
}

const PredictionHistory = ({ history, onClear }: PredictionHistoryProps) => {
  if (history.length === 0) return null;

  const iconMap = {
    Low: <CheckCircle className="w-5 h-5 text-green-500" />,
    Moderate: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
    High: <XCircle className="w-5 h-5 text-red-500" />,
  };

  const badgeClass = {
    Low: 'bg-green-500/10 text-green-600 border-green-500/20',
    Moderate: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
    High: 'bg-red-500/10 text-red-600 border-red-500/20',
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-6"
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between mb-8 max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <History className="w-4 h-4" />
              Prediction History
            </div>
            <span className="text-sm text-muted-foreground">({history.length} records)</span>
          </div>
          <button
            onClick={onClear}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </button>
        </div>

        <div className="max-w-4xl mx-auto rounded-2xl bg-card border border-border overflow-hidden" style={{ boxShadow: 'var(--shadow-card)' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="text-left py-4 px-6 text-muted-foreground font-medium">#</th>
                  <th className="text-left py-4 px-6 text-muted-foreground font-medium">Patient Name</th>
                  <th className="text-center py-4 px-6 text-muted-foreground font-medium">Risk Score</th>
                  <th className="text-center py-4 px-6 text-muted-foreground font-medium">Risk Level</th>
                  <th className="text-right py-4 px-6 text-muted-foreground font-medium">Date & Time</th>
                </tr>
              </thead>
              <tbody>
                {history.map((entry, i) => (
                  <motion.tr
                    key={entry.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-border/50 last:border-0 hover:bg-secondary/30 transition-colors"
                  >
                    <td className="py-4 px-6 text-muted-foreground">{history.length - i}</td>
                    <td className="py-4 px-6 font-medium text-foreground flex items-center gap-2">
                      {iconMap[entry.label]}
                      {entry.patientName}
                    </td>
                    <td className="py-4 px-6 text-center font-bold text-foreground">{entry.risk}%</td>
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${badgeClass[entry.label]}`}>
                        {entry.label}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right text-muted-foreground">{entry.timestamp}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default PredictionHistory;
