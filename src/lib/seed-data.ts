import { Donor, BloodRequest, Hospital, BLOOD_GROUPS, CITIES } from '@/types/blood-donation';

// Generate unique IDs
const generateId = () => Math.random().toString(36).substring(2, 15);

// Random date within last year
const randomPastDate = (daysBack: number) => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysBack));
  return date.toISOString();
};

// Random future date
const randomFutureDate = (daysAhead: number) => {
  const date = new Date();
  date.setDate(date.getDate() + Math.floor(Math.random() * daysAhead) + 1);
  return date.toISOString().split('T')[0];
};

// Sample Indian names
const firstNames = ['Rahul', 'Priya', 'Amit', 'Sneha', 'Vikram', 'Anjali', 'Rohit', 'Neha', 'Arjun', 'Pooja', 'Karan', 'Divya', 'Sanjay', 'Meera', 'Rajesh'];
const lastNames = ['Sharma', 'Patel', 'Singh', 'Kumar', 'Gupta', 'Reddy', 'Nair', 'Joshi', 'Verma', 'Iyer'];

const getRandomName = () => {
  const first = firstNames[Math.floor(Math.random() * firstNames.length)];
  const last = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${first} ${last}`;
};

const getRandomPhone = () => {
  return `+91 ${Math.floor(Math.random() * 9000000000 + 1000000000)}`;
};

const getRandomEmail = (name: string) => {
  const cleanName = name.toLowerCase().replace(' ', '.');
  const domains = ['gmail.com', 'yahoo.com', 'outlook.com'];
  return `${cleanName}@${domains[Math.floor(Math.random() * domains.length)]}`;
};

// Generate seed donors
export const generateSeedDonors = (): Donor[] => {
  const donors: Donor[] = [];
  
  for (let i = 0; i < 25; i++) {
    const name = getRandomName();
    const city = CITIES[Math.floor(Math.random() * CITIES.length)];
    const bloodGroup = BLOOD_GROUPS[Math.floor(Math.random() * BLOOD_GROUPS.length)];
    const hasRecentDonation = Math.random() > 0.5;
    
    donors.push({
      id: generateId(),
      name,
      email: getRandomEmail(name),
      phone: getRandomPhone(),
      bloodGroup,
      age: Math.floor(Math.random() * 30) + 18,
      city,
      address: `${Math.floor(Math.random() * 500) + 1}, Sector ${Math.floor(Math.random() * 50) + 1}`,
      lastDonationDate: hasRecentDonation ? randomPastDate(180) : null,
      isAvailable: Math.random() > 0.3,
      isVerified: Math.random() > 0.2,
      createdAt: randomPastDate(365),
      updatedAt: randomPastDate(30),
    });
  }
  
  return donors;
};

// Generate seed blood requests
export const generateSeedRequests = (): BloodRequest[] => {
  const requests: BloodRequest[] = [];
  const statuses: BloodRequest['status'][] = ['pending', 'approved', 'fulfilled', 'cancelled'];
  const urgencies: BloodRequest['urgency'][] = ['normal', 'urgent', 'critical'];
  const reasons = ['Surgery', 'Accident', 'Anemia', 'Cancer Treatment', 'Childbirth', 'Thalassemia'];
  
  const hospitals = [
    'City General Hospital', 'Apollo Hospital', 'Max Healthcare',
    'Fortis Hospital', 'AIIMS', 'Medanta', 'Narayana Health'
  ];
  
  for (let i = 0; i < 15; i++) {
    const city = CITIES[Math.floor(Math.random() * CITIES.length)];
    const hospital = hospitals[Math.floor(Math.random() * hospitals.length)];
    const patientName = getRandomName();
    
    requests.push({
      id: generateId(),
      patientName,
      contactPhone: getRandomPhone(),
      contactEmail: getRandomEmail(patientName),
      bloodGroup: BLOOD_GROUPS[Math.floor(Math.random() * BLOOD_GROUPS.length)],
      unitsRequired: Math.floor(Math.random() * 4) + 1,
      hospitalName: hospital,
      hospitalAddress: `${hospital}, Main Road, ${city}`,
      city,
      urgency: urgencies[Math.floor(Math.random() * urgencies.length)],
      reason: reasons[Math.floor(Math.random() * reasons.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      requiredByDate: randomFutureDate(14),
      createdAt: randomPastDate(30),
      updatedAt: randomPastDate(7),
    });
  }
  
  return requests;
};

// Generate seed hospitals
export const generateSeedHospitals = (): Hospital[] => {
  const hospitalNames = [
    'City General Hospital', 'Apollo Hospital', 'Max Healthcare',
    'Fortis Hospital', 'Medanta', 'Narayana Health', 'Manipal Hospital'
  ];
  
  return hospitalNames.slice(0, 5).map((name, index) => {
    const city = CITIES[index % CITIES.length];
    
    return {
      id: generateId(),
      name,
      email: `contact@${name.toLowerCase().replace(/\s+/g, '')}.com`,
      phone: getRandomPhone(),
      address: `${name}, Healthcare District, ${city}`,
      city,
      isVerified: true,
      bloodStock: BLOOD_GROUPS.map(bg => ({
        bloodGroup: bg,
        unitsAvailable: Math.floor(Math.random() * 20) + 5,
        lastUpdated: new Date().toISOString(),
      })),
      createdAt: randomPastDate(365),
    };
  });
};
