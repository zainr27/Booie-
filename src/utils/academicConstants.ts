
export const majors = [
  { id: 'cs', name: 'Computer Science' },
  { id: 'eng', name: 'Engineering' },
  { id: 'bus', name: 'Business Administration' },
  { id: 'econ', name: 'Economics' },
  { id: 'math', name: 'Mathematics' },
  { id: 'other', name: 'Other' }
];

export const degreePrograms = [
  { id: 'associates', name: "Associate's Degree" },
  { id: 'bachelors', name: "Bachelor's Degree" },
  { id: 'masters', name: "Master's Degree" },
  { id: 'mba', name: 'MBA' },
  { id: 'jd', name: 'JD' },
  { id: 'md', name: 'MD' },
  { id: 'pharmd', name: 'PharmD' },
  { id: 'phd', name: 'PhD' },
  { id: 'trade', name: 'Trade School Certificate' },
  { id: 'other', name: 'Other' }
];

export const studyModes = [
  { id: 'full-time', name: 'Full-time' },
  { id: 'part-time', name: 'Part-time' }
];

export const deliveryModes = [
  { id: 'in-person', name: 'In-person' },
  { id: 'hybrid', name: 'Hybrid' },
  { id: 'remote', name: 'Remote' }
];

// Generate future months starting from 2026
export const getGraduationMonths = () => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  return months.map((name, index) => ({
    id: (index + 1).toString(),
    name
  }));
};

export const graduationYears = [2026, 2027, 2028, 2029, 2030];
