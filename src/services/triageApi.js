import api from "./api";

export const createTriage = async (triageData) => {
  const facilityId = localStorage.getItem("medipath_facility_id");

  if (!facilityId) {
    throw new Error("Facility information was not found.");
  }

  const response = await api.post("/triage/", {
    patient_id: Number(triageData.patientId),
    facility_id: Number(facilityId),

    chief_complaint: triageData.chiefComplaint,
    symptoms: triageData.symptoms || [],

    temperature:
      triageData.temperature !== "" &&
      triageData.temperature !== null
        ? Number(triageData.temperature)
        : null,

    heart_rate:
      triageData.heartRate !== "" &&
      triageData.heartRate !== null
        ? Number(triageData.heartRate)
        : null,

    respiratory_rate:
      triageData.respiratoryRate !== "" &&
      triageData.respiratoryRate !== null
        ? Number(triageData.respiratoryRate)
        : null,

    spo2:
      triageData.spo2 !== "" &&
      triageData.spo2 !== null
        ? Number(triageData.spo2)
        : null,

    blood_pressure: triageData.bloodPressure || null,

    urgency_level: triageData.urgencyLevel,

    notes: triageData.notes || null,
  });

  return response.data;
};


export const getTriageAssessments = async () => {
  const response = await api.get("/triage/");
  return response.data;
};


export const getTriageQueue = async (facilityId = null) => {
  const url = facilityId
    ? `/triage/queue?facility_id=${Number(facilityId)}`
    : "/triage/queue";

  const response = await api.get(url);

  return response.data;
};