import axios from "axios";

export const SendMobileOTP = async (mobiles, OTP) => {
  const message = `${OTP} is the OTP to verify your Mobile Number with Paras Parivaar . OTP is Valid for the next 5 min. Do Not Share with anyone.`;
  try {
    const res = await axios.post(
      `https://sms.shreetripada.com/api/sendapi.php?auth_key=${process.env.MOBILE_OTP_auth_key}&mobiles=${mobiles}&templateid=${process.env.MOBILE_OTP_templateid}&message=${message}&sender=${process.env.MOBILE_OTP_sender}`
    );
    // console.log(res.data);
  } catch (error) {
    console.log(error);
  }
};
