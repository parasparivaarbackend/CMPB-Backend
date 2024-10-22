import { z } from "zod";
import { BasicDetailsModel } from "../../model/Profile/BasicDetails.model.js";
import { UserModel } from "../../model/user.model.js";

export const BasicDetailSchemaValidation = z.object({
  firstName: z.string().min(3).max(50),
  lastName: z.string().min(3).max(50),
  gender: z.enum(["male", "female"]),
  DOB: z.string(),
  maritalStatus: z.enum(["Single", "Divorced", "Widowed"]),
  children: z.number().nonnegative().optional(),
  profileImage: z.string().url().optional(),
});

export const CreateBasicDetails = async (req, res) => {
  const data = req.body;
  try {
    const user = await UserModel.findById({ _id: req.user._id });

    if (!user) return res.status(400).json({ message: "Invalid User" });

    const BasicDetails = await BasicDetailsModel.create({
      ...data,
      UserID: user._id,
    });
    if (!BasicDetails)
      return res.status(400).json({ message: "Failed to add Basic Details" });

    return res.status(200).json({ message: "Basic details Added" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to add Basic Details" });
  }
};
