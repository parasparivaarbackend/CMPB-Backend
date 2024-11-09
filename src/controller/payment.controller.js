import Razorpay from "razorpay";

const razorpayInstance = new Razorpay({
  key_id: process.env.PAYMENT_KEY_ID,
  key_secret: process.env.PAYMENT_KEY_SECRET,
});

export const payment = async (req, res) => {
  const { eventid, memberid } = req.query;
  const { amount } = req.body;

  if (amount <= 0)
    return res.status(400).json({ message: "Invalid Amount" })

  let receiptId;
  if (req._parsedUrl.pathname === "/events" && eventid) {
    receiptId = `event_${eventid}_${memberid}_${Date.now()}`;
  } else {
    receiptId = `Package_${memberid}_${Date.now()}`;
  }

  try {
    const options = {
      amount: amount * 100,
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
