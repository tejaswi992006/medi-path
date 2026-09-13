import api from "./api";

// Get all medical records
export const getMedicalRecords = async () => {
  const response = await api.get("/medical-records/");
  return response.data;
};

// Get one medical record
export const getMedicalRecord = async (recordId) => {
  const response = await api.get(`/medical-records/${recordId}`);
  return response.data;
};

// Create a medical record
export const createMedicalRecord = async (recordData) => {
  const doctorId = window.localStorage.getItem(
    "medipath_user_id"
  );

  if (!doctorId) {
    throw new Error("Doctor login information was not found.");
  }

  const response = await api.post("/medical-records/", {
    patient_id: Number(recordData.patientId),
    doctor_id: Number(doctorId),
    diagnosis: recordData.diagnosis || null,
    symptoms: recordData.symptoms || null,
    treatment: recordData.treatment || null,
    notes: recordData.notes || null,
  });

  return response.data;
};