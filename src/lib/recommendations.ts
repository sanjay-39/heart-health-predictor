import { PatientData, PredictionResult } from './prediction';

export interface Recommendation {
  category: string;
  icon: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

export function generateRecommendations(
  data: PatientData,
  result: PredictionResult
): Recommendation[] {
  const recs: Recommendation[] = [];

  // Blood pressure recommendations
  if (data.trestbps > 140) {
    recs.push({
      category: 'Blood Pressure',
      icon: 'activity',
      title: 'Manage High Blood Pressure',
      description: 'Your resting blood pressure is elevated. Reduce sodium intake to under 2,300 mg/day, practice stress-relief techniques, and consult your doctor about antihypertensive medication.',
      priority: 'high',
    });
  } else if (data.trestbps > 120) {
    recs.push({
      category: 'Blood Pressure',
      icon: 'activity',
      title: 'Monitor Blood Pressure',
      description: 'Your blood pressure is slightly elevated. Maintain a low-sodium diet, stay hydrated, and monitor your readings regularly.',
      priority: 'medium',
    });
  }

  // Cholesterol recommendations
  if (data.chol > 240) {
    recs.push({
      category: 'Cholesterol',
      icon: 'droplets',
      title: 'Lower Cholesterol Urgently',
      description: 'Your cholesterol is high. Avoid trans fats and saturated fats, increase fiber intake with oats and legumes, and discuss statin therapy with your physician.',
      priority: 'high',
    });
  } else if (data.chol > 200) {
    recs.push({
      category: 'Cholesterol',
      icon: 'droplets',
      title: 'Improve Cholesterol Levels',
      description: 'Your cholesterol is borderline high. Incorporate heart-healthy fats like olive oil and nuts, eat more fruits and vegetables, and exercise regularly.',
      priority: 'medium',
    });
  }

  // Age-based recommendations
  if (data.age > 55) {
    recs.push({
      category: 'Age & Screening',
      icon: 'calendar',
      title: 'Schedule Regular Cardiac Screenings',
      description: 'At your age, regular cardiac check-ups including ECG and lipid panels are essential. Consider annual stress tests and discuss aspirin therapy with your doctor.',
      priority: 'high',
    });
  } else if (data.age > 45) {
    recs.push({
      category: 'Age & Screening',
      icon: 'calendar',
      title: 'Begin Preventive Screenings',
      description: 'Consider scheduling regular cardiovascular screenings. Early detection of risk factors can significantly improve outcomes.',
      priority: 'medium',
    });
  }

  // Blood sugar
  if (data.fbs === 1) {
    recs.push({
      category: 'Blood Sugar',
      icon: 'cookie',
      title: 'Control Blood Sugar Levels',
      description: 'Elevated fasting blood sugar increases heart disease risk. Limit refined carbohydrates and sugary foods, maintain a consistent eating schedule, and monitor glucose regularly.',
      priority: 'high',
    });
  }

  // Exercise recommendations based on heart rate and angina
  if (data.exang === 1) {
    recs.push({
      category: 'Exercise',
      icon: 'heart-pulse',
      title: 'Exercise Under Medical Supervision',
      description: 'Exercise-induced angina indicates your heart needs guided rehabilitation. Work with a cardiac rehab program to safely build cardiovascular fitness.',
      priority: 'high',
    });
  } else if (data.thalach < 120) {
    recs.push({
      category: 'Exercise',
      icon: 'heart-pulse',
      title: 'Improve Cardiovascular Fitness',
      description: 'Your maximum heart rate is low. Gradually increase aerobic activity — start with brisk walking 30 minutes daily and progress to moderate-intensity workouts.',
      priority: 'medium',
    });
  } else {
    recs.push({
      category: 'Exercise',
      icon: 'heart-pulse',
      title: 'Maintain Active Lifestyle',
      description: 'Continue regular physical activity. Aim for at least 150 minutes of moderate aerobic exercise per week, including strength training twice weekly.',
      priority: 'low',
    });
  }

  // ST depression / oldpeak
  if (data.oldpeak > 2) {
    recs.push({
      category: 'Cardiac Function',
      icon: 'heart',
      title: 'Seek Cardiac Evaluation',
      description: 'Significant ST depression suggests possible ischemia. Schedule an appointment with a cardiologist for further diagnostic testing such as angiography.',
      priority: 'high',
    });
  }

  // Lifestyle - general based on risk level
  if (result.label === 'High') {
    recs.push({
      category: 'Lifestyle',
      icon: 'shield',
      title: 'Adopt Comprehensive Lifestyle Changes',
      description: 'Your risk level requires immediate attention. Quit smoking if applicable, eliminate alcohol, follow a strict heart-healthy diet (DASH or Mediterranean), and ensure 7-8 hours of sleep nightly.',
      priority: 'high',
    });
  } else if (result.label === 'Moderate') {
    recs.push({
      category: 'Lifestyle',
      icon: 'shield',
      title: 'Strengthen Heart-Healthy Habits',
      description: 'Focus on a balanced Mediterranean diet, manage stress through mindfulness or yoga, limit alcohol consumption, and maintain a healthy weight.',
      priority: 'medium',
    });
  } else {
    recs.push({
      category: 'Lifestyle',
      icon: 'shield',
      title: 'Continue Healthy Living',
      description: 'Your current health indicators are favorable. Maintain your balanced diet, stay active, manage stress effectively, and keep up with routine health check-ups.',
      priority: 'low',
    });
  }

  // Diet recommendation
  recs.push({
    category: 'Diet',
    icon: 'apple',
    title: data.chol > 200 ? 'Follow a Heart-Healthy Diet' : 'Maintain Nutritious Eating',
    description: data.chol > 200
      ? 'Prioritize omega-3 rich foods (salmon, walnuts), increase soluble fiber (oats, beans), eat colorful vegetables, and limit processed meats and fried foods.'
      : 'Continue eating a variety of fruits, vegetables, whole grains, and lean proteins. Stay hydrated and limit added sugars and processed foods.',
    priority: data.chol > 200 ? 'medium' : 'low',
  });

  // Sort by priority
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  return recs.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
}
