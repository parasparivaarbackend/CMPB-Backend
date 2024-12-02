import { z } from "zod";
import { BackgroundModel } from "../../model/Profile/Background.model.js";

const BackgroundValidate = z.object({
  Religion: z.string().min(2),
  Caste: z.string().min(2),
  SubCast: z.string().min(2),
  SelfWorth: z.number().gte(20000),
  FamilyWorth: z.number().gte(20000),
  DependentMember: z.number().min(0),
  MotherName: z.string().min(2),
  FatherName: z.string().min(2),
  isMotherAlive: z.boolean(),
  isFatherAlive: z.boolean(),
});

const CreateBackground = async (req, res) => {
  const ProfileID = req.user.ProfileID.toString();
  const BackgroundData = req.body;

  const validateData = BackgroundValidate.safeParse(BackgroundData);
  if (validateData.success === false) {
    return res.status(400).json({ ...validateData.error.issues });
  }

  const checkBackground = await BackgroundModel.findOne({ ProfileID });
  if (checkBackground) {
    return res.status(400).json({ message: "Backgound already exist" });
  }

  const data = await BackgroundModel.create({
    ProfileID,
    ...validateData.data,
  });

  return res
    .status(200)
    .json({ message: "Backgound Created Succesfull", data });
};

const UpdateBackground = async (req, res) => {
  const ProfileID = req.user.ProfileID.toString();
  const updateData = req.body;

  const validateData = BackgroundValidate.safeParse(updateData);
  if (validateData.success === false) {
    return res.status(400).json({ ...validateData.error.issues });
  }

  const data = await BackgroundModel.findOneAndUpdate(
    { ProfileID },
    { ProfileID, ...validateData.data },
    { new: true }
  );

  return res
    .status(200)
    .json({ message: "Backround Details Updated Succesfull", data });
};

export { CreateBackground, UpdateBackground };
