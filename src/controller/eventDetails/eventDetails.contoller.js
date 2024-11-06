import { z } from "zod";
import Razorpay from "razorpay";
import crypto from "crypto";
import { eventdetails } from "../../model/Events/eventdetails.model.js";

//Mostly for Admin only get for All
const eventsSchema = z.object({
  availableDates: z.string().min(2),
  state: z.string().min(2),
  amount: z.number().min(2),
  eventName: z.string().min(2),
  venues: z.string().min(2),
  description: z.string().min(2).optional(),
});

const GetEvents = async (req, res) => {
  const data = await eventdetails.find();
  if (!data) {
    return res.status(400).json({ message: "Events Get Failed" });
  }
  return res.status(200).json({ message: "Events get Succesfull", data });
};

const CreateEventDetails = async (req, res) => {
  const createData = req.body;
  const validationData = eventsSchema.safeParse(createData);
  if (validationData.success === false) {
    return res.status(400).json({ ...validationData.error.issues });
  }

  const checkDate = await eventdetails.find();

  if (checkDate && checkDate?.length > 0) {
    return res.status(400).json({ message: "Date already exist" });
  }

  const data = await eventdetails.create({ ...validationData.data });
  if (!data) {
    return res.status(400).json({ message: "Events not inserted try again" });
  }
  return res
    .status(200)
    .json({ message: "Events Details Created Succesfull", data });
};

const UpdateEventDetails = async (req, res) => {
  const updateData = req.body;
  const { id } = req.params;

  const validateData = eventsSchema.safeParse(updateData);
  if (validateData.success === false) {
    return res.status(400).json({ ...validateData.error.issues });
  }

  const data = await eventdetails.findByIdAndUpdate(
    id,
    { ...validateData.data },
    { new: true }
  );
  if (!data) {
    return res.status(400).json({ message: "Events not Updated try again" });
  }

  return res
    .status(200)
    .json({ message: "Events Details Update Successfull", data });
};

const DeleteEventsDetails = async (req, res) => {
  const { id } = req.params;

  const data = await eventdetails.findByIdAndDelete({ _id: id });
  if (!data) {
    return res.status(400).json({ message: "Event Not Found" });
  }

  return res.status(200).json({ message: "Event Delete Successfull", data });
};

const razorpayInstance = new Razorpay({
  key_id: process.env.PAYMENT_KEY_ID,
  key_secret: process.env.PAYMENT_KEY_SECRET,
});

const RegisterForEvent = async (req, res) => {
  const { eventid, memberid } = req.query;

  let receiptId;
  if (req.baseUrl === "/api/v1/events" && eventid) {
    receiptId = `event_${eventid}_${memberid}_${Date.now()}`;
  } else {
    receiptId = `Package_${memberid}_${Date.now()}`;
  }

  try {
    const options = {
      amount: req.body.amount * 100,
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

const verifyPayment = async (req, res) => {
  console.log(req.body);

  const { order_id, payment_id, signature } = req.body;
  const generated_signature = crypto
    .createHmac("sha256", process.env.PAYMENT_KEY_SECRET)
    .update(order_id + "|" + payment_id)
    .digest("hex");
  console.log("generated_signature is ", generated_signature);
  if (generated_signature === signature) {
    console.log("success");

    return res.json({ status: "success" });
  } else {
    console.log("Invalid signature");
    return res.status(400).send("Invalid signature");
  }
};

export {
  CreateEventDetails,
  UpdateEventDetails,
  DeleteEventsDetails,
  GetEvents,
  RegisterForEvent,
  verifyPayment,
};
