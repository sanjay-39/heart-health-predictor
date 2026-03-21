import PredictionHistory from '@/components/PredictionHistory';
import { usePrediction } from '@/contexts/PredictionContext';
import { History } from 'lucide-react';

const HistoryPage = () => {
  const { history, handleClearHistory } = usePrediction();

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
        <History className="w-16 h-16 text-muted-foreground/30 mb-4" />
        <h2 className="text-2xl font-bold text-foreground font-display mb-2">No History</h2>
        <p className="text-muted-foreground">Your prediction history will appear here after running predictions.</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10">
      <PredictionHistory history={history} onClear={handleClearHistory} />
    </div>
  );
};

export default HistoryPage;
