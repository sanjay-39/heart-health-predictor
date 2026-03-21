import jsPDF from 'jspdf';
import { PredictionResult, PatientData } from './prediction';

interface ReportData {
  patientName: string;
  patientData: PatientData;
  result: PredictionResult;
}

const COLORS = {
  primary: [22, 130, 120] as [number, number, number],
  dark: [20, 30, 45] as [number, number, number],
  muted: [120, 130, 140] as [number, number, number],
  light: [245, 247, 250] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
  low: [46, 160, 110] as [number, number, number],
  moderate: [230, 160, 30] as [number, number, number],
  high: [200, 60, 60] as [number, number, number],
};

const sexLabel = (v: number) => v === 1 ? 'Male' : 'Female';
const cpLabel = (v: number) => ['Typical Angina', 'Atypical Angina', 'Non-anginal Pain', 'Asymptomatic'][v] ?? 'Unknown';
const yesNo = (v: number) => v === 1 ? 'Yes' : 'No';
const ecgLabel = (v: number) => ['Normal', 'ST-T Abnormality', 'LV Hypertrophy'][v] ?? 'Unknown';
const slopeLabel = (v: number) => ['Upsloping', 'Flat', 'Downsloping'][v] ?? 'Unknown';
const thalLabel = (v: number) => ({ 1: 'Normal', 2: 'Fixed Defect', 3: 'Reversable Defect' }[v] ?? 'Unknown');

export function generatePDFReport({ patientName, patientData, result }: ReportData) {
  const doc = new jsPDF();
  const pageW = doc.internal.pageSize.getWidth();
  let y = 0;

  // --- Header ---
  doc.setFillColor(...COLORS.dark);
  doc.rect(0, 0, pageW, 42, 'F');
  doc.setFillColor(...COLORS.primary);
  doc.rect(0, 42, pageW, 3, 'F');

  doc.setTextColor(...COLORS.white);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('CardioPredict', 14, 18);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('ML-Based Heart Disease Prediction Report', 14, 26);
  doc.setFontSize(9);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 34);

  const riskColor = result.label === 'Low' ? COLORS.low : result.label === 'Moderate' ? COLORS.moderate : COLORS.high;
  doc.setFillColor(...riskColor);
  doc.roundedRect(pageW - 60, 8, 46, 28, 3, 3, 'F');
  doc.setTextColor(...COLORS.white);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(`${result.risk}%`, pageW - 37, 22, { align: 'center' });
  doc.setFontSize(9);
  doc.text(`${result.label} Risk`, pageW - 37, 30, { align: 'center' });

  y = 55;

  // --- Patient Info ---
  doc.setTextColor(...COLORS.dark);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('Patient Information', 14, y);
  y += 8;

  doc.setFillColor(...COLORS.light);
  doc.roundedRect(14, y - 4, pageW - 28, 20, 2, 2, 'F');
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.muted);
  doc.text('Name:', 20, y + 4);
  doc.text('Sex:', 100, y + 4);
  doc.text('Age:', 150, y + 4);
  doc.setTextColor(...COLORS.dark);
  doc.setFont('helvetica', 'bold');
  doc.text(patientName || 'Unknown', 38, y + 4);
  doc.text(sexLabel(patientData.sex), 112, y + 4);
  doc.text(String(patientData.age), 165, y + 4);
  y += 26;

  // --- Clinical Parameters Table ---
  doc.setTextColor(...COLORS.dark);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('Clinical Parameters', 14, y);
  y += 8;

  const params = [
    ['Chest Pain Type', cpLabel(patientData.cp)],
    ['Resting Blood Pressure', `${patientData.trestbps} mm Hg`],
    ['Serum Cholesterol', `${patientData.chol} mg/dl`],
    ['Fasting Blood Sugar > 120', yesNo(patientData.fbs)],
    ['Resting ECG', ecgLabel(patientData.restecg)],
    ['Max Heart Rate', String(patientData.thalach)],
    ['Exercise Induced Angina', yesNo(patientData.exang)],
    ['ST Depression (Oldpeak)', String(patientData.oldpeak)],
    ['Slope of Peak ST', slopeLabel(patientData.slope)],
    ['Major Vessels (0-3)', String(patientData.ca)],
    ['Thalassemia', thalLabel(patientData.thal)],
  ];

  // Table header
  doc.setFillColor(...COLORS.primary);
  doc.roundedRect(14, y - 4, pageW - 28, 10, 2, 2, 'F');
  doc.setTextColor(...COLORS.white);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Parameter', 20, y + 2);
  doc.text('Value', 130, y + 2);
  y += 10;

  params.forEach(([label, value], i) => {
    if (i % 2 === 0) {
      doc.setFillColor(...COLORS.light);
      doc.rect(14, y - 4, pageW - 28, 9, 'F');
    }
    doc.setTextColor(...COLORS.dark);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(label, 20, y + 2);
    doc.setFont('helvetica', 'bold');
    doc.text(value, 130, y + 2);
    y += 9;
  });

  y += 6;

  // --- Top Risk Factors ---
  doc.setTextColor(...COLORS.dark);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('Top Contributing Risk Factors', 14, y);
  y += 8;

  const maxImpact = result.topFactors[0]?.impact || 1;
  result.topFactors.forEach((factor, i) => {
    const barW = (factor.impact / maxImpact) * 100;
    // Bar background
    doc.setFillColor(230, 232, 236);
    doc.roundedRect(60, y - 3, 100, 7, 2, 2, 'F');
    // Bar fill
    doc.setFillColor(...riskColor);
    doc.roundedRect(60, y - 3, barW, 7, 2, 2, 'F');

    doc.setTextColor(...COLORS.dark);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(factor.name, 20, y + 2);
    doc.setFont('helvetica', 'bold');
    doc.text(String(factor.impact), 165, y + 2);
    y += 11;
  });

  y += 6;

  // --- Model Performance ---
  doc.setTextColor(...COLORS.dark);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('Model Performance Comparison', 14, y);
  y += 8;

  // Table header
  doc.setFillColor(...COLORS.primary);
  doc.roundedRect(14, y - 4, pageW - 28, 10, 2, 2, 'F');
  doc.setTextColor(...COLORS.white);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Model', 20, y + 2);
  doc.text('Accuracy', 95, y + 2);
  doc.text('Precision', 120, y + 2);
  doc.text('Recall', 148, y + 2);
  doc.text('F1 Score', 172, y + 2);
  y += 10;

  result.modelScores.forEach((m, i) => {
    if (i % 2 === 0) {
      doc.setFillColor(...COLORS.light);
      doc.rect(14, y - 4, pageW - 28, 9, 'F');
    }
    doc.setTextColor(...COLORS.dark);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(m.name, 20, y + 2);
    doc.setFont('helvetica', 'bold');
    doc.text(`${(m.accuracy * 100).toFixed(1)}%`, 95, y + 2);
    doc.setFont('helvetica', 'normal');
    doc.text(`${(m.precision * 100).toFixed(1)}%`, 120, y + 2);
    doc.text(`${(m.recall * 100).toFixed(1)}%`, 148, y + 2);
    doc.text(`${(m.f1 * 100).toFixed(1)}%`, 172, y + 2);
    y += 9;
  });

  y += 8;

  // --- Recommendations ---
  doc.setTextColor(...COLORS.dark);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('Health Recommendations', 14, y);
  y += 8;

  const recommendations = result.label === 'Low'
    ? [
        'Maintain a balanced diet rich in fruits, vegetables, and whole grains.',
        'Continue regular physical activity (at least 150 min/week of moderate exercise).',
        'Schedule routine health check-ups annually.',
        'Monitor blood pressure and cholesterol levels periodically.',
      ]
    : result.label === 'Moderate'
    ? [
        'Consult a cardiologist for a comprehensive cardiac evaluation.',
        'Adopt a heart-healthy diet low in saturated fats and sodium.',
        'Increase physical activity under medical guidance.',
        'Monitor and manage blood pressure, cholesterol, and blood sugar closely.',
        'Consider stress management techniques such as meditation or yoga.',
      ]
    : [
        'Seek immediate consultation with a cardiologist.',
        'Undergo advanced cardiac diagnostic tests (ECG, echocardiogram, stress test).',
        'Strictly follow prescribed medications and treatment plans.',
        'Adopt significant lifestyle changes: quit smoking, limit alcohol, heart-healthy diet.',
        'Monitor vital signs daily and report any chest pain or shortness of breath immediately.',
      ];

  doc.setFillColor(riskColor[0], riskColor[1], riskColor[2], 0.08);
  const recBoxH = recommendations.length * 8 + 6;
  doc.setFillColor(...COLORS.light);
  doc.roundedRect(14, y - 4, pageW - 28, recBoxH, 2, 2, 'F');
  doc.setDrawColor(...riskColor);
  doc.setLineWidth(0.5);
  doc.roundedRect(14, y - 4, pageW - 28, recBoxH, 2, 2, 'S');

  doc.setTextColor(...COLORS.dark);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  recommendations.forEach((rec) => {
    doc.text(`•  ${rec}`, 20, y + 2);
    y += 8;
  });

  // --- Footer ---
  const footerY = doc.internal.pageSize.getHeight() - 12;
  doc.setDrawColor(200, 205, 210);
  doc.setLineWidth(0.3);
  doc.line(14, footerY - 4, pageW - 14, footerY - 4);
  doc.setTextColor(...COLORS.muted);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'italic');
  doc.text('CardioPredict — ML-Based Heart Disease Prediction System · Cleveland Heart Disease Dataset · For educational purposes only', pageW / 2, footerY, { align: 'center' });

  doc.save(`CardioPredict_Report_${patientName?.replace(/\s+/g, '_') || 'Patient'}.pdf`);
}
