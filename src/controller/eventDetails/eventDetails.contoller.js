import { z } from "zod";

import { eventdetails } from "../../model/Events/eventdetails.model.js";
import { eventPaymentModel } from "../../model/Events/eventPayment.model.js";
import mongoose from "mongoose";

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
  razorpayOrderID: z.string().min(2),
  RazorPayPaymentId: z.string().min(2),
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
  const { id } = req.params;
  const data = req.body;
  const validateData = eventPaymentSchema.safeParse(data);
  if (!validateData.success)
    return res.status(400).json({ ...validateData.error.issues });
  console.log(validateData.data);

  try {
    const existingEvent = await eventdetails.findOne({
      _id: id,
      "ClientDetails.UserID": req?.user?._id,
    });

    if (existingEvent) {
      return res
        .status(400)
        .json({ message: "UserID already exists in ClientDetails." });
    }

    await eventdetails.findByIdAndUpdate(id, {
      $push: {
        ClientDetails: { ...validateData.data, UserID: req?.user?._id },
      },
    });

    return res.status(200).json({ message: "payment successfully" });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "Failed to update payment" });
  }
};

const UserWhoBookedEvent = async (req, res) => {
  const { id } = req.params;
  console.log("inside controller", id);
  let eventID = new mongoose.Types.ObjectId(id);
  try {
    const data = await eventdetails.aggregate([
      {
        $match: {
          _id: eventID,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "ClientDetails.UserID",
          foreignField: "_id",
          as: "users",
          pipeline: [
            {
              $project: {
                MemberID: 1,
                firstName: 1,
                lastName: 1,
                gender: 1,
                DOB: 1,
                profileImage: 1,
                email: 1,
                phone: 1,
                active: 1,
                RegisterPackage: 1,
              },
            },
            {
              $unwind: {
                path: "$users",
                preserveNullAndEmptyArrays: true,
              },
            },
          ],
        },
      },
      {
        $project: {
          availableDates: 1,
          venues: 1,
          state: 1,
          amount: 1,
          eventName: 1,
          description: 1,
          availableDates: 1,
          users: 1,
        },
      },
    ]);
    console.log(data?.[0]);
  } catch (error) {
    console.log(error);
  }
};

export {
  CreateEventDetails,
  UpdateEventDetails,
  DeleteEventsDetails,
  GetEvents,
  createEventPayment,
  UserWhoBookedEvent,
};
