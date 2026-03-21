import { useNavigate } from 'react-router-dom';
import PredictionForm from '@/components/PredictionForm';
import { usePrediction } from '@/contexts/PredictionContext';
import { PatientData } from '@/lib/prediction';

const PredictPage = () => {
  const { handleSubmit } = usePrediction();
  const navigate = useNavigate();

  const onSubmit = (data: PatientData, patientName: string) => {
    handleSubmit(data, patientName);
    navigate('/results');
  };

  return (
    <div className="p-6 md:p-10">
      <PredictionForm onSubmit={onSubmit} />
    </div>
  );
};

export default PredictPage;
