import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Stethoscope } from 'lucide-react';
import { PatientData } from '@/lib/prediction';

interface PredictionFormProps {
  onSubmit: (data: PatientData) => void;
}

const PredictionForm = ({ onSubmit }: PredictionFormProps) => {
  const [patientName, setPatientName] = useState('');
  const [form, setForm] = useState<PatientData>({
    age: 50, sex: 1, cp: 0, trestbps: 130, chol: 220,
    fbs: 0, restecg: 0, thalach: 150, exang: 0, oldpeak: 1.0,
    slope: 1, ca: 0, thal: 2,
  });

  const update = (key: keyof PatientData, value: number) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const fieldClass = "w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all";
  const labelClass = "block text-sm font-medium text-muted-foreground mb-1.5";

  return (
    <motion.section
      id="prediction-form"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="py-20"
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Stethoscope className="w-4 h-4" />
            Patient Data Input
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground font-display mb-3">Enter Clinical Parameters</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Based on the Cleveland Heart Disease Dataset — 13 clinical attributes used for cardiac risk prediction.</p>
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); onSubmit(form, patientName); }}
          className="max-w-4xl mx-auto rounded-2xl p-8 bg-card border border-border"
          style={{ boxShadow: 'var(--shadow-card)' }}
        >
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className={labelClass}>Age</label>
              <input type="number" className={fieldClass} value={form.age} onChange={e => update('age', +e.target.value)} min={1} max={120} />
            </div>
            <div>
              <label className={labelClass}>Sex</label>
              <select className={fieldClass} value={form.sex} onChange={e => update('sex', +e.target.value)}>
                <option value={1}>Male</option>
                <option value={0}>Female</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Chest Pain Type</label>
              <select className={fieldClass} value={form.cp} onChange={e => update('cp', +e.target.value)}>
                <option value={0}>Typical Angina</option>
                <option value={1}>Atypical Angina</option>
                <option value={2}>Non-anginal Pain</option>
                <option value={3}>Asymptomatic</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Resting Blood Pressure (mm Hg)</label>
              <input type="number" className={fieldClass} value={form.trestbps} onChange={e => update('trestbps', +e.target.value)} min={80} max={220} />
            </div>
            <div>
              <label className={labelClass}>Cholesterol (mg/dl)</label>
              <input type="number" className={fieldClass} value={form.chol} onChange={e => update('chol', +e.target.value)} min={100} max={600} />
            </div>
            <div>
              <label className={labelClass}>Fasting Blood Sugar {'>'} 120</label>
              <select className={fieldClass} value={form.fbs} onChange={e => update('fbs', +e.target.value)}>
                <option value={0}>No</option>
                <option value={1}>Yes</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Resting ECG</label>
              <select className={fieldClass} value={form.restecg} onChange={e => update('restecg', +e.target.value)}>
                <option value={0}>Normal</option>
                <option value={1}>ST-T Abnormality</option>
                <option value={2}>Left Ventricular Hypertrophy</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Max Heart Rate Achieved</label>
              <input type="number" className={fieldClass} value={form.thalach} onChange={e => update('thalach', +e.target.value)} min={60} max={220} />
            </div>
            <div>
              <label className={labelClass}>Exercise Induced Angina</label>
              <select className={fieldClass} value={form.exang} onChange={e => update('exang', +e.target.value)}>
                <option value={0}>No</option>
                <option value={1}>Yes</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>ST Depression (Oldpeak)</label>
              <input type="number" step="0.1" className={fieldClass} value={form.oldpeak} onChange={e => update('oldpeak', +e.target.value)} min={0} max={6} />
            </div>
            <div>
              <label className={labelClass}>Slope of Peak ST</label>
              <select className={fieldClass} value={form.slope} onChange={e => update('slope', +e.target.value)}>
                <option value={0}>Upsloping</option>
                <option value={1}>Flat</option>
                <option value={2}>Downsloping</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Major Vessels (0-3)</label>
              <select className={fieldClass} value={form.ca} onChange={e => update('ca', +e.target.value)}>
                {[0,1,2,3].map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Thalassemia</label>
              <select className={fieldClass} value={form.thal} onChange={e => update('thal', +e.target.value)}>
                <option value={1}>Normal</option>
                <option value={2}>Fixed Defect</option>
                <option value={3}>Reversable Defect</option>
              </select>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <button
              type="submit"
              className="inline-flex items-center gap-3 px-10 py-4 rounded-xl font-semibold text-primary-foreground transition-all hover:scale-105 hover:shadow-lg text-lg"
              style={{ background: 'var(--gradient-primary)' }}
            >
              <Heart className="w-5 h-5" />
              Predict Heart Disease Risk
            </button>
          </div>
        </form>
      </div>
    </motion.section>
  );
};

export default PredictionForm;
