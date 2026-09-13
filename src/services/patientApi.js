import api from "./api";

// Get all patients from the real backend
export const getPatients = async () => {
  const response = await api.get("/patients/");
  return response.data;
};

// Search patient by Patient ID or phone number
export const searchPatient = async (searchValue) => {
  const patients = await getPatients();

  const value = searchValue.trim().toLowerCase();

  return patients.find(
    (patient) =>
      String(patient.id).toLowerCase() === value ||
      String(patient.phone || "") === searchValue.trim()
  );
};

// Get patient profile
export const getPatient = async (id) => {
  const patients = await getPatients();

  return patients.find(
    (patient) => String(patient.id) === String(id)
  );
};

// Register a new patient
export const registerPatient = async (patientData) => {
  // Patient role ID confirmed from the backend
  const PATIENT_ROLE_ID = 1;

  // -----------------------------------------
  // STEP 1: Create the User
  // -----------------------------------------
  const userResponse = await api.post("/users/", {
    name: patientData.name,
    email: patientData.email,
    password: patientData.password,
    role_id: PATIENT_ROLE_ID,
    facility_id: 1,
  });

  const newUser = userResponse.data;

  // -----------------------------------------
  // STEP 2: Create the Patient profile
  // -----------------------------------------
  const patientResponse = await api.post("/patients/", {
    user_id: newUser.id,
    date_of_birth: patientData.date_of_birth,
    gender: patientData.gender,
    phone: patientData.phone,
    address: patientData.village,
    facility_id: 1,
  });

  return patientResponse.data;
};