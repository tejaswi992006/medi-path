export const submitTriage = async (triageData) => {
  console.log("Mock triage API:", triageData);

  return {
    success: true,
    message: "Triage submitted successfully",
    data: triageData,
  };
};