import { z } from "zod";
import { LifeStyleModel } from "../../model/Profile/LifeStyle.model.js";

const ValidateLifeStyle = z.object({
  Diet: z.boolean(),
  Drink: z.boolean(),
  Smoke: z.boolean(),
  LivingWith: z.string().min(2),
});

export const CreateLifeStyle = async (req, res) => {
  try {
    const validateData = ValidateLifeStyle.safeParse(req.body);

    if (!validateData.success)
      return res.status(400).json({ ...validateData.error.issues });

    const lifeStyle = await LifeStyleModel.findOne({
      ProfileID: req.user.ProfileID,
    });

    if (lifeStyle)
      return res.status(400).json({ message: "LifeStyle already Exist" });

    await LifeStyleModel.create({
      ProfileID: req.user.ProfileID,
      ...validateData.data,
    });

    return res.status(200).json({ message: "LifeStyle created Successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to create LifeStyle" });
  }
};
export const UpdateLifeStyle = async (req, res) => {
  const ProfileID = req.user.ProfileID.toString();
  try {
    const validateData = ValidateLifeStyle.safeParse(req.body);

    if (!validateData.success)
      return res.status(400).json({ ...validateData.error.issues });

    const UpdatedData = await LifeStyleModel.findOneAndUpdate(
      {
        ProfileID,
      },
      {
        ...validateData.data,
      },
      { new: true }
    );

    return res
      .status(200)
      .json({ message: "LifeStyle created Successfully", data: UpdatedData });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to create LifeStyle" });
  }
};
