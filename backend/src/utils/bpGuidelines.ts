/**
 * Medical guidelines for blood pressure based on age and gender
 * 
 * Sources:
 * - American Heart Association (AHA)
 * - European Society of Cardiology (ESC)
 * - WHO Blood Pressure Guidelines
 * 
 * Note: These are general guidelines. Individual targets may vary based on
 * medical history, existing conditions, and doctor's recommendations.
 */

export interface BPRange {
  systolic: { min: number; max: number; optimal: number };
  diastolic: { min: number; max: number; optimal: number };
  category: 'optimal' | 'normal' | 'high-normal' | 'hypertension-grade1' | 'hypertension-grade2';
  description: string;
}

export interface BPGuidelines {
  optimal: BPRange;
  normal: BPRange;
  highNormal: BPRange;
  hypertensionGrade1: BPRange;
  hypertensionGrade2: BPRange;
  notes: string[];
}

/**
 * Get blood pressure guidelines based on age and gender
 * 
 * @param age - User's age in years
 * @param gender - User's gender ('male', 'female', 'other')
 * @returns Blood pressure guidelines object
 */
export function getBPGuidelines(age: number, gender: 'male' | 'female' | 'other'): BPGuidelines {
  // Age groups:
  // - Young adults (18-39)
  // - Middle age (40-59)
  // - Older adults (60-79)
  // - Elderly (80+)

  if (age < 40) {
    // Young adults - stricter targets
    return {
      optimal: {
        systolic: { min: 90, max: 119, optimal: 110 },
        diastolic: { min: 60, max: 79, optimal: 70 },
        category: 'optimal',
        description: 'Optimaalinen verenpaine'
      },
      normal: {
        systolic: { min: 120, max: 129, optimal: 125 },
        diastolic: { min: 80, max: 84, optimal: 82 },
        category: 'normal',
        description: 'Normaali verenpaine'
      },
      highNormal: {
        systolic: { min: 130, max: 139, optimal: 135 },
        diastolic: { min: 85, max: 89, optimal: 87 },
        category: 'high-normal',
        description: 'Tyydyttävä verenpaine'
      },
      hypertensionGrade1: {
        systolic: { min: 140, max: 159, optimal: 150 },
        diastolic: { min: 90, max: 99, optimal: 95 },
        category: 'hypertension-grade1',
        description: 'Lievä kohonnut verenpaine (1. asteen verenpainetauti)'
      },
      hypertensionGrade2: {
        systolic: { min: 160, max: 200, optimal: 170 },
        diastolic: { min: 100, max: 130, optimal: 105 },
        category: 'hypertension-grade2',
        description: 'Kohonnut verenpaine (2. asteen verenpainetauti)'
      },
      notes: [
        'Nuorilla aikuisilla tavoitteena on optimaalinen verenpaine',
        'Naisilla voi esiintyä matalampia arvoja miehiin verrattuna',
        'Säännöllinen liikunta ja terveellinen ruokavalio tärkeää',
        'Jos verenpaine pysyvästi yli 140/90, ota yhteyttä lääkäriin'
      ]
    };
  } else if (age < 60) {
    // Middle age - standard targets
    return {
      optimal: {
        systolic: { min: 90, max: 119, optimal: 115 },
        diastolic: { min: 60, max: 79, optimal: 75 },
        category: 'optimal',
        description: 'Optimaalinen verenpaine'
      },
      normal: {
        systolic: { min: 120, max: 129, optimal: 125 },
        diastolic: { min: 80, max: 84, optimal: 82 },
        category: 'normal',
        description: 'Normaali verenpaine'
      },
      highNormal: {
        systolic: { min: 130, max: 139, optimal: 135 },
        diastolic: { min: 85, max: 89, optimal: 87 },
        category: 'high-normal',
        description: 'Tyydyttävä verenpaine'
      },
      hypertensionGrade1: {
        systolic: { min: 140, max: 159, optimal: 150 },
        diastolic: { min: 90, max: 99, optimal: 95 },
        category: 'hypertension-grade1',
        description: 'Lievä kohonnut verenpaine (1. asteen verenpainetauti)'
      },
      hypertensionGrade2: {
        systolic: { min: 160, max: 200, optimal: 170 },
        diastolic: { min: 100, max: 130, optimal: 105 },
        category: 'hypertension-grade2',
        description: 'Kohonnut verenpaine (2. asteen verenpainetauti)'
      },
      notes: [
        'Keski-iässä verenpaineen nousu on yleistä',
        'Miehillä riski sydän- ja verisuonitauteihin kasvaa',
        'Naisilla vaihdevuodet voivat nostaa verenpainetta',
        'Tavoitteena alle 140/90 mmHg',
        'Elintapamuutokset ovat ensisijainen hoito'
      ]
    };
  } else if (age < 80) {
    // Older adults - slightly relaxed targets
    const isFemale = gender === 'female';
    
    return {
      optimal: {
        systolic: { min: 90, max: 129, optimal: 120 },
        diastolic: { min: 60, max: 84, optimal: 75 },
        category: 'optimal',
        description: 'Optimaalinen verenpaine'
      },
      normal: {
        systolic: { min: 130, max: 139, optimal: 135 },
        diastolic: { min: 85, max: 89, optimal: 87 },
        category: 'normal',
        description: 'Normaali verenpaine'
      },
      highNormal: {
        systolic: { min: 140, max: 149, optimal: 145 },
        diastolic: { min: 90, max: 94, optimal: 92 },
        category: 'high-normal',
        description: 'Tyydyttävä verenpaine'
      },
      hypertensionGrade1: {
        systolic: { min: 150, max: 159, optimal: 155 },
        diastolic: { min: 95, max: 99, optimal: 97 },
        category: 'hypertension-grade1',
        description: 'Lievä kohonnut verenpaine'
      },
      hypertensionGrade2: {
        systolic: { min: 160, max: 200, optimal: 170 },
        diastolic: { min: 100, max: 130, optimal: 105 },
        category: 'hypertension-grade2',
        description: 'Kohonnut verenpaine'
      },
      notes: [
        'Ikääntyneillä tavoite alle 150/90 mmHg',
        isFemale 
          ? 'Naisilla vaihdevuosien jälkeen verenpaine usein korkeampi'
          : 'Miehillä sydän- ja verisuonitautien riski suurempi',
        'Liian alhainen verenpaine voi aiheuttaa huimausta',
        'Yläpaine voi nousta, alapaine usein laskee',
        'Säännöllinen seuranta tärkeää'
      ]
    };
  } else {
    // Elderly (80+) - more relaxed targets to avoid hypotension risks
    return {
      optimal: {
        systolic: { min: 100, max: 139, optimal: 130 },
        diastolic: { min: 60, max: 89, optimal: 80 },
        category: 'optimal',
        description: 'Optimaalinen verenpaine'
      },
      normal: {
        systolic: { min: 140, max: 149, optimal: 145 },
        diastolic: { min: 90, max: 94, optimal: 92 },
        category: 'normal',
        description: 'Normaali verenpaine'
      },
      highNormal: {
        systolic: { min: 150, max: 159, optimal: 155 },
        diastolic: { min: 95, max: 99, optimal: 97 },
        category: 'high-normal',
        description: 'Tyydyttävä verenpaine'
      },
      hypertensionGrade1: {
        systolic: { min: 160, max: 169, optimal: 165 },
        diastolic: { min: 100, max: 104, optimal: 102 },
        category: 'hypertension-grade1',
        description: 'Lievä kohonnut verenpaine'
      },
      hypertensionGrade2: {
        systolic: { min: 170, max: 200, optimal: 180 },
        diastolic: { min: 105, max: 130, optimal: 110 },
        category: 'hypertension-grade2',
        description: 'Kohonnut verenpaine'
      },
      notes: [
        'Yli 80-vuotiailla tavoite alle 150/90 mmHg',
        'Liian alhainen paine voi lisätä kaatumisriskiä',
        'Huomioi muut sairaudet ja lääkitykset',
        'Yläpaine voi nousta merkittävästi',
        'Alapaine usein alhainen (alle 70 mmHg)',
        'Yksilöllinen hoitotavoite lääkärin kanssa tärkeää'
      ]
    };
  }
}

/**
 * Classify blood pressure reading based on age and gender
 * 
 * @param systolic - Systolic blood pressure (mmHg)
 * @param diastolic - Diastolic blood pressure (mmHg)
 * @param age - User's age in years
 * @param gender - User's gender
 * @returns BP category and personalized message
 */
export function classifyBP(
  systolic: number, 
  diastolic: number, 
  age: number, 
  gender: 'male' | 'female' | 'other'
): { category: string; status: 'good' | 'warning' | 'danger'; message: string; color: string } {
  const guidelines = getBPGuidelines(age, gender);

  // Check for hypotension (low BP)
  if (systolic < 90 || diastolic < 60) {
    return {
      category: 'hypotension',
      status: 'warning',
      message: 'Verenpaine on matala. Jos oireita (huimaus, väsymys), ota yhteyttä lääkäriin.',
      color: '#0288D1' // Blue
    };
  }

  // Check optimal
  if (systolic <= guidelines.optimal.systolic.max && diastolic <= guidelines.optimal.diastolic.max) {
    return {
      category: 'optimal',
      status: 'good',
      message: `✓ Verenpaineesi on optimaalinen ikäryhmällesi (${age} v)`,
      color: '#2E7D32' // Green
    };
  }

  // Check normal
  if (systolic <= guidelines.normal.systolic.max && diastolic <= guidelines.normal.diastolic.max) {
    return {
      category: 'normal',
      status: 'good',
      message: `✓ Verenpaineesi on normaalilla alueella ikäryhmällesi (${age} v)`,
      color: '#558B2F' // Light green
    };
  }

  // Check high-normal
  if (systolic <= guidelines.highNormal.systolic.max && diastolic <= guidelines.highNormal.diastolic.max) {
    return {
      category: 'high-normal',
      status: 'warning',
      message: 'Verenpaineesi on tyydyttävällä alueella. Seuraa säännöllisesti ja huolehdi elintavoista.',
      color: '#F57C00' // Orange
    };
  }

  // Check grade 1 hypertension
  if (systolic <= guidelines.hypertensionGrade1.systolic.max || diastolic <= guidelines.hypertensionGrade1.diastolic.max) {
    return {
      category: 'hypertension-grade1',
      status: 'warning',
      message: '⚠️ Verenpaine on koholla. Suosittelemme yhteyttä terveydenhuoltoon.',
      color: '#E65100' // Dark orange
    };
  }

  // Grade 2 or higher
  return {
    category: 'hypertension-grade2',
    status: 'danger',
    message: '⚠️ Verenpaine on merkittävästi koholla. Ota yhteyttä lääkäriin mahdollisimman pian.',
    color: '#C62828' // Red
  };
}

/**
 * Calculate age from birth year
 */
export function calculateAge(birthYear: number): number {
  const currentYear = new Date().getFullYear();
  return currentYear - birthYear;
}

/**
 * Calculate age from date of birth (more precise)
 */
export function calculateAgeFromDate(dateOfBirth: string): number {
  const birth = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  // Adjust if birthday hasn't occurred this year
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * Get personalized BP recommendations based on demographics
 */
export function getBPRecommendations(
  age: number,
  gender: 'male' | 'female' | 'other',
  currentSystolic?: number,
  currentDiastolic?: number
): string[] {
  const guidelines = getBPGuidelines(age, gender);
  const recommendations: string[] = [];

  // Age-specific recommendations
  if (age < 40) {
    recommendations.push('Rakenna terveet elintavat nyt - ne maksavat itsensä takaisin myöhemmin');
    recommendations.push('Säännöllinen liikunta 150 min/viikko');
  } else if (age < 60) {
    recommendations.push('Seuraa verenpainetta säännöllisesti');
    recommendations.push('Vähennä suolan käyttöä (alle 5g/päivä)');
    recommendations.push('Painonhallinta on tärkeää');
  } else {
    recommendations.push('Mittaa verenpaine samaan aikaan päivästä');
    recommendations.push('Älä nouse nopeasti ylös istuma- tai makuuasennosta');
    recommendations.push('Huomioi lääkityksen vaikutus verenpaineeseen');
  }

  // Gender-specific
  if (gender === 'female' && age >= 45) {
    recommendations.push('Vaihdevuodet voivat nostaa verenpainetta - keskustele lääkärin kanssa');
  }

  // Current reading specific
  if (currentSystolic && currentDiastolic) {
    const classification = classifyBP(currentSystolic, currentDiastolic, age, gender);
    
    if (classification.status === 'warning' || classification.status === 'danger') {
      recommendations.push('Rajoita alkoholin käyttöä');
      recommendations.push('Vähennä stressiä rentoutumisharjoituksilla');
      recommendations.push('Lisää kasviksia ja hedelmiä ruokavalioon');
    }
    
    if (classification.category === 'hypotension') {
      recommendations.push('Juo riittävästi nesteitä');
      recommendations.push('Nosta jalkapäätä sängyssä');
      recommendations.push('Vältä pitkää seisomista');
    }
  }

  return recommendations;
}
