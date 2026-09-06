// src/services/patientApi.js

import {
  getAllPatients,
  findPatient,
  getPatientById,
  addPatient,
} from "../mock/mockData";

// Get all patients
export const getPatients = async () => {
  return getAllPatients();
};

// Search patient by Patient ID or phone number
export const searchPatient = async (searchValue) => {
  return findPatient(searchValue);
};

// Get patient profile
export const getPatient = async (id) => {
  return getPatientById(id);
};

// Register a new patient
export const registerPatient = async (patientData) => {
  return addPatient(patientData);
};