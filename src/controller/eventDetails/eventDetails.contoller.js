import { z } from "zod";


import { eventdetails } from "../../model/Events/eventdetails.model.js";
import { eventPaymentModel } from "../../model/Events/eventPayment.model.js";


//Mostly for Admin only get for All
const eventsSchema = z.object({
  availableDates: z.string().min(2),
  state: z.string().min(2),
  amount: z.number().min(2),
  eventName: z.string().min(2),
  venues: z.string().min(2),
  description: z.string().min(2).optional(),
});
const eventPaymentSchema = z.object({
  eventID: z.string().min(2),
  razorpayOrderID: z.string().min(2),
  RazorPayPaymentId: z.number().min(2),
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

  const checkDate = await eventdetails.findOne({
    availableDates: validationData.data.availableDates,
  });

  if (checkDate) return res.status(400).json({ message: "Date already exist" });

  const data = await eventdetails.create({ ...validationData.data });

  if (!data)
    return res.status(400).json({ message: "Events not inserted try again" });

  return res.status(200).json({ message: "Events Details Created Succesfull" });
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

  const data = await eventdetails.findByIdAndDelete(id);

  if (!data) return res.status(400).json({ message: "Event Not Found" });

  return res.status(200).json({ message: "Event Delete Successfull", data });
};

const createEventPayment = async (req, res) => {
  const data = req.body;
  const validateData = eventPaymentSchema.safeParse(data);
  if (!validateData.success)
    return res.status(400).json({ ...validateData.error.issues });

  try {
    await eventPaymentModel.create({
      ...validateData.data,
      UserID: req?.user?._id,
    });
    return res.status(200).json({ message: "payment successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update payment" });
  }
};

export {
  CreateEventDetails,
  UpdateEventDetails,
  DeleteEventsDetails,
  GetEvents,
  createEventPayment,
};
