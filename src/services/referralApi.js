const createReferral = async (referralData) => {
  console.log("Mock referral API:", referralData);

  return {
    success: true,
    message: "Referral created successfully",
    data: referralData,
  };
};

export default createReferral;