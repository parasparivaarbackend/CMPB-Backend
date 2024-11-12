import Razorpay from "razorpay";
import { UserModel } from "../model/user.model.js";
import { eventdetails } from "../model/Events/eventdetails.model.js";

const razorpayInstance = new Razorpay({
  key_id: process.env.PAYMENT_KEY_ID,
  key_secret: process.env.PAYMENT_KEY_SECRET,
});

export const payment = async (req, res) => {
  const { eventid, memberid } = req.query;
  const data = req.body;
  console.log(req._parsedUrl.pathname);

  if (data?.amount <= 0)
    return res.status(400).json({ message: "Invalid Amount" });
  try {
    let receiptId;

    if (req._parsedUrl.pathname === "/events" && eventid) {
      const existingEvent = await eventdetails.findOne({
        _id: eventid,
        "ClientDetails.UserID": req?.user?._id,
      });

      if (existingEvent) {
        return res
          .status(400)
          .json({ message: "You Already Booked this event." });
      }
      receiptId = `event_${eventid}_${memberid}`;
    } else if (req._parsedUrl.pathname === "/package") {
      const user = await UserModel.findById(req?.user?._id);

      if (user?.RegisterPackage?.PremiumMember) {
        return res.status(400).json({ message: "Already Premium Member" });
      }
      receiptId = `Package_${memberid}`;
    }
    const options = {
      amount: data?.amount * 100,
      currency: "INR",
      receipt: receiptId,
      payment_capture: 1,
      notes:
        eventid && req.baseUrl === "/api/v1/events"
          ? ["payment for event"]
          : ["payment for package"],
    };
    const order = await razorpayInstance.orders.create(options);

    return res.status(200).json({ order });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to make payment" });
  }
};
