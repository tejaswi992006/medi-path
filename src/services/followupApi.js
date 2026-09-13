import api from "./api";

// Get all follow-ups
export const getFollowUps = async () => {
  const response = await api.get("/follow-ups/");
  return response.data;
};

// Create a new follow-up
export const createFollowUp = async (followUpData) => {
  const response = await api.post("/follow-ups/", {
    patient_id: Number(followUpData.patientId),
    referral_id: followUpData.referralId
      ? Number(followUpData.referralId)
      : null,
    doctor_id: Number(followUpData.doctorId),
    follow_up_date: followUpData.followUpDate,
    status: followUpData.status || "Scheduled",
    notes: followUpData.notes || null,
  });

  return response.data;
};