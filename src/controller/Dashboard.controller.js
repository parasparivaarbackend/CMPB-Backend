import { eventdetails } from "../model/Events/eventdetails.model.js";

const TotalUserForCurrentEvent = async (req, res) => {
  try {
    const data = await eventdetails
      .find()
      .sort({ availableDates: -1 })
      .limit(1);

    return res.status(200).json({
      message: "Total Number of users for the current event",

      Users: data[0]?.ClientDetails?.length ?? 0,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to get Users for the current event" });
  }
};

export { TotalUserForCurrentEvent };
