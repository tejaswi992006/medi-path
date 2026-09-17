import api from "./api";

// ============================================
// GET ALL FOLLOW-UPS
// ============================================
export const getFollowUps = async () => {
  const response = await api.get("/follow-ups/");
  return response.data;
};

// ============================================
// GET SINGLE FOLLOW-UP
// ============================================
export const getFollowUp = async (followUpId) => {
  const response = await api.get(
    `/follow-ups/${followUpId}`
  );

  return response.data;
};

// ============================================
// CREATE FOLLOW-UP
// ============================================
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

// ============================================
// UPDATE FOLLOW-UP TRACKING STAGE
// ============================================
//
// Allowed backend stages:
//
// Referral Created
// Referral Accepted
// Appointment Scheduled
// Consultation
// Follow-Up
// Treatment Completed
//
// ============================================

export const updateFollowUpTrackingStage = async (
  followUpId,
  trackingStage
) => {
  const response = await api.patch(
    `/follow-ups/${followUpId}/tracking-stage`,
    {
      tracking_stage: trackingStage,
    }
  );

  return response.data;
};