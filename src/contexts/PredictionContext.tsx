import { createContext, useContext, useState, ReactNode } from 'react';
import { PatientData, PredictionResult, predictHeartDisease } from '@/lib/prediction';
import { HistoryEntry } from '@/components/PredictionHistory';

const HISTORY_KEY = 'cardiopredict_history';

const loadHistory = (): HistoryEntry[] => {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  } catch { return []; }
};

interface PredictionContextType {
  result: (PredictionResult & { patientName?: string }) | null;
  lastPatientData: PatientData | null;
  history: HistoryEntry[];
  handleSubmit: (data: PatientData, patientName: string) => void;
  handleClearHistory: () => void;
}

const PredictionContext = createContext<PredictionContextType | null>(null);

export const usePrediction = () => {
  const ctx = useContext(PredictionContext);
  if (!ctx) throw new Error('usePrediction must be used within PredictionProvider');
  return ctx;
};

export const PredictionProvider = ({ children }: { children: ReactNode }) => {
  const [result, setResult] = useState<(PredictionResult & { patientName?: string }) | null>(null);
  const [lastPatientData, setLastPatientData] = useState<PatientData | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>(loadHistory);

  const handleSubmit = (data: PatientData, patientName: string) => {
    const prediction = predictHeartDisease(data);
    setResult({ ...prediction, patientName });
    setLastPatientData(data);

    const entry: HistoryEntry = {
      id: crypto.randomUUID(),
      patientName: patientName || 'Unknown',
      risk: prediction.risk,
      label: prediction.label,
      timestamp: new Date().toLocaleString(),
    };
    const updated = [entry, ...history];
    setHistory(updated);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
  };

  return (
    <PredictionContext.Provider value={{ result, lastPatientData, history, handleSubmit, handleClearHistory }}>
      {children}
    </PredictionContext.Provider>
  );
};
