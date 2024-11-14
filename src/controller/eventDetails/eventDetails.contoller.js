import { z } from "zod";
import mongoose from "mongoose";
import { eventdetails } from "../../model/Events/eventdetails.model.js";

function isDateInThePast(date) {
  const inputDate = new Date(date).setHours(0, 0, 0, 0);
  const today = new Date().setHours(0, 0, 0, 0);
  return inputDate < today;
}

//Mostly for Admin only get for All
const eventsSchema = z.object({
  availableDates: z.string().refine(
    (val) => {
      if (val) {
        return !isDateInThePast(val);
      }
    },
    { message: "Date must not be in the past" }
  ),
  state: z.string().min(2),
  amount: z.number().min(2),
  eventName: z.string().min(2),
  venues: z.string().min(2),
  description: z.string().min(2).optional(),
});
const eventPaymentSchema = z.object({
  razorpayOrderID: z.string().min(2),
  RazorPayPaymentID: z.string().min(2),
});

const GetEvents = async (req, res) => {
  let data;

  if (req._parsedUrl.pathname === "/get-admin") {
    data = await eventdetails.find();
  } else {
    data = await eventdetails.find().sort({ createdAt: -1 }).limit(1);
    data = data[0].toObject();
    delete data.ClientDetails;
  }

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
    return res.status(200).json({ message: "Events get Succesfull", data });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Failed to get All users who book event" });
  }
};

const GetPurchasedUserEvent = async (req, res) => {
  try {
    const userEvents = await eventdetails.aggregate([
      // Step 1: Unwind the ClientDetails array
      { $unwind: "$ClientDetails" },
      // Step 2: Match the specific UserID in ClientDetails
      {
        $match: {
          "ClientDetails.UserID": req?.user?._id,
        },
      },

      // Step 3: Optionally, group back to the original structure, if needed
      {
        $group: {
          _id: "$_id",
          eventName: { $first: "$eventName" },
          availableDates: { $first: "$availableDates" },
          venues: { $first: "$venues" },
          state: { $first: "$state" },
          amount: { $first: "$amount" },
          description: { $first: "$description" },
          ClientDetails: { $push: "$ClientDetails" }, // re-group ClientDetails matching the user
        },
      },
    ]);

    return res.status(200).json({ userEvents });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to get User Events" });
  }
};

export {
  CreateEventDetails,
  UpdateEventDetails,
  DeleteEventsDetails,
  GetEvents,
  createEventPayment,
  UserWhoBookedEvent,
  GetPurchasedUserEvent,
};
