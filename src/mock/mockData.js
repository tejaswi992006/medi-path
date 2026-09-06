const patients = [
  {
    id: "P1001",
    name: "Ravi Kumar",
    age: 45,
    gender: "Male",
    phone: "9876543210",
    village: "Rampur",
    medicalHistory: "Diabetes",
    visits: [],
    referrals: [],
    followup: {
      status: "Pending",
      dueDate: "2026-09-10"
    }
  },
  {
    id: "P1002",
    name: "Sita Devi",
    age: 32,
    gender: "Female",
    phone: "9123456789",
    village: "Lakshmipur",
    medicalHistory: "No known medical history",
    visits: [],
    referrals: [],
    followup: {
      status: "Completed",
      dueDate: "2026-08-30"
    }
  }
];

export const getAllPatients = () => {
  return patients;
};

export const findPatient = (searchValue) => {
  const value = searchValue.trim().toLowerCase();

  return patients.find(
    (patient) =>
      patient.id.toLowerCase() === value ||
      patient.phone === searchValue.trim()
  );
};

export const getPatientById = (id) => {
  return patients.find(
    (patient) =>
      patient.id.toLowerCase() === id.toLowerCase()
  );
};

export const addPatient = (patientData) => {
  const newPatient = {
    id: `P${1001 + patients.length}`,
    name: patientData.name,
    age: Number(patientData.age),
    gender: patientData.gender,
    phone: patientData.phone,
    village: patientData.village,
    medicalHistory:
      patientData.medicalHistory || "No known medical history",
    visits: [],
    referrals: [],
    followup: {
      status: "Pending",
      dueDate: "2026-09-15"
    }
  };

  patients.push(newPatient);

  return newPatient;
};

export const updateFollowup = (patientId, status) => {
  const patient = patients.find(
    (item) => item.id === patientId
  );

  if (!patient) {
    return null;
  }

  patient.followup.status = status;

  return patient;
};