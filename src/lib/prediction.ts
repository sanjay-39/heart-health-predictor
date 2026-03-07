// Simulated ML prediction based on Cleveland Heart Disease Dataset features
// In production, this would call a backend ML model API

export interface PatientData {
  age: number;
  sex: number; // 0 = female, 1 = male
  cp: number; // chest pain type (0-3)
  trestbps: number; // resting blood pressure
  chol: number; // serum cholesterol mg/dl
  fbs: number; // fasting blood sugar > 120 mg/dl (1 = true)
  restecg: number; // resting ECG results (0-2)
  thalach: number; // max heart rate achieved
  exang: number; // exercise induced angina (1 = yes)
  oldpeak: number; // ST depression
  slope: number; // slope of peak exercise ST segment (0-2)
  ca: number; // number of major vessels colored by fluoroscopy (0-3)
  thal: number; // thalassemia (1 = normal, 2 = fixed defect, 3 = reversable defect)
}

export interface PredictionResult {
  risk: number; // 0-100
  label: 'Low' | 'Moderate' | 'High';
  modelScores: {
    name: string;
    accuracy: number;
    precision: number;
    recall: number;
    f1: number;
  }[];
  topFactors: { name: string; impact: number }[];
}

export function predictHeartDisease(data: PatientData): PredictionResult {
  // Weighted risk scoring based on clinical literature
  let risk = 0;
  const factors: { name: string; impact: number }[] = [];

  // Age factor
  const ageFactor = data.age > 55 ? 12 : data.age > 45 ? 7 : 2;
  risk += ageFactor;
  factors.push({ name: 'Age', impact: ageFactor });

  // Sex factor
  const sexFactor = data.sex === 1 ? 6 : 2;
  risk += sexFactor;
  factors.push({ name: 'Sex', impact: sexFactor });

  // Chest pain
  const cpFactor = data.cp === 0 ? 15 : data.cp === 1 ? 8 : data.cp === 2 ? 5 : 2;
  risk += cpFactor;
  factors.push({ name: 'Chest Pain Type', impact: cpFactor });

  // Blood pressure
  const bpFactor = data.trestbps > 140 ? 10 : data.trestbps > 120 ? 5 : 2;
  risk += bpFactor;
  factors.push({ name: 'Blood Pressure', impact: bpFactor });

  // Cholesterol
  const cholFactor = data.chol > 240 ? 12 : data.chol > 200 ? 6 : 2;
  risk += cholFactor;
  factors.push({ name: 'Cholesterol', impact: cholFactor });

  // Max heart rate (inverse - lower is worse)
  const hrFactor = data.thalach < 120 ? 12 : data.thalach < 150 ? 5 : 1;
  risk += hrFactor;
  factors.push({ name: 'Max Heart Rate', impact: hrFactor });

  // Exercise angina
  const exangFactor = data.exang === 1 ? 10 : 1;
  risk += exangFactor;
  factors.push({ name: 'Exercise Angina', impact: exangFactor });

  // ST depression
  const oldpeakFactor = data.oldpeak > 2 ? 12 : data.oldpeak > 1 ? 7 : 1;
  risk += oldpeakFactor;
  factors.push({ name: 'ST Depression', impact: oldpeakFactor });

  // Vessels
  const caFactor = data.ca * 8;
  risk += caFactor;
  factors.push({ name: 'Major Vessels', impact: caFactor });

  // Thalassemia
  const thalFactor = data.thal === 3 ? 10 : data.thal === 2 ? 6 : 1;
  risk += thalFactor;
  factors.push({ name: 'Thalassemia', impact: thalFactor });

  // Normalize to 0-100
  const maxPossible = 12 + 6 + 15 + 10 + 12 + 12 + 10 + 12 + 24 + 10;
  risk = Math.min(100, Math.round((risk / maxPossible) * 100));

  const label: PredictionResult['label'] = risk < 35 ? 'Low' : risk < 65 ? 'Moderate' : 'High';

  // Simulated model comparison scores
  const modelScores = [
    { name: 'Random Forest', accuracy: 0.887, precision: 0.891, recall: 0.879, f1: 0.885 },
    { name: 'Logistic Regression', accuracy: 0.852, precision: 0.848, recall: 0.861, f1: 0.854 },
    { name: 'Decision Tree', accuracy: 0.793, precision: 0.801, recall: 0.782, f1: 0.791 },
    { name: 'K-Nearest Neighbors', accuracy: 0.831, precision: 0.825, recall: 0.839, f1: 0.832 },
  ];

  const topFactors = factors.sort((a, b) => b.impact - a.impact).slice(0, 5);

  return { risk, label, modelScores, topFactors };
}
