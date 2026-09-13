import api from "./api";

// Get all referrals
export const getReferrals = async () => {
  const response = await api.get("/referrals/");
  return response.data;
};

// Create a referral
export const createReferral = async (referralData) => {
  const response = await api.post("/referrals/", {
    patient_id: Number(referralData.patientId),
    from_facility_id: 1,
    to_facility_id: Number(referralData.toFacilityId),
    reason: referralData.reason,
    status: "Pending",
    notes: referralData.notes || null,
  });

  return {
    success: true,
    message: "Referral created successfully",
    data: response.data,
  };
};

// Keep default export for the existing Referral page
export default createReferral;