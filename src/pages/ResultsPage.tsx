import { useNavigate } from 'react-router-dom';
import ResultsPanel from '@/components/ResultsPanel';
import HealthRecommendations from '@/components/HealthRecommendations';
import { usePrediction } from '@/contexts/PredictionContext';
import { Stethoscope } from 'lucide-react';

const ResultsPage = () => {
  const { result, lastPatientData } = usePrediction();
  const navigate = useNavigate();

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
        <Stethoscope className="w-16 h-16 text-muted-foreground/30 mb-4" />
        <h2 className="text-2xl font-bold text-foreground font-display mb-2">No Results Yet</h2>
        <p className="text-muted-foreground mb-6">Run a prediction first to see your results here.</p>
        <button
          onClick={() => navigate('/predict')}
          className="px-6 py-3 rounded-xl font-semibold text-primary-foreground transition-all hover:scale-105"
          style={{ background: 'var(--gradient-primary)' }}
        >
          Go to Prediction
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10">
      <ResultsPanel result={result} patientData={lastPatientData ?? undefined} />
      {lastPatientData && <HealthRecommendations patientData={lastPatientData} result={result} />}
    </div>
  );
};

export default ResultsPage;
