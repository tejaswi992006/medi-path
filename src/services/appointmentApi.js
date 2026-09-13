import api from "./api";

// Get all appointments
export const getAppointments = async () => {
  const response = await api.get("/appointments/");
  return response.data;
};

// Get one appointment
export const getAppointment = async (appointmentId) => {
  const response = await api.get(`/appointments/${appointmentId}`);
  return response.data;
};

// Create an appointment
export const createAppointment = async (appointmentData) => {
  const doctorId = window.localStorage.getItem("medipath_user_id");

  if (!doctorId) {
    throw new Error("User login information was not found.");
  }

  const response = await api.post("/appointments/", {
    patient_id: Number(appointmentData.patientId),
    doctor_id: Number(doctorId),
    facility_id: Number(appointmentData.facilityId),
    appointment_date: appointmentData.appointmentDate,
    status: appointmentData.status || "Scheduled",
    reason: appointmentData.reason || null,
  });

  return response.data;
};