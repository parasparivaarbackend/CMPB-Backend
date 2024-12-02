import { z } from "zod";
import { AstronomicModel } from "../../model/Profile/Astronomic.model.js";

const AstronomicSchema = z.object({
  SunSign: z.string().min(2),
  MoonSign: z.string().min(2),
  TimeOfBirth: z.string().min(2),
  CityOfBirth: z.string().min(2),
});

const CreateAstronomic = async (req, res) => {
  const ProfileID = req.user.ProfileID.toString();
  const createData = req.body;

  const validateData = AstronomicSchema.safeParse(createData);
  if (validateData.success === false) {
    return res.status(400).json({ ...validateData.error.issues });
  }

  const checkAstronomic = await AstronomicModel.findOne({ ProfileID });
  if (checkAstronomic) {
    return res
      .status(400)
      .json({ message: "Astronomic Details already exist" });
  }

  const data = await AstronomicModel.create({
    ProfileID,
    ...validateData.data,
  });
  return res
    .status(200)
    .json({ message: "Astronomic Details Created Succesfull", data });
};

const UpdateAstronomic = async (req, res) => {
  const ProfileID = req.user.ProfileID.toString();
  const updateData = req.body;

  const validateData = AstronomicSchema.safeParse(updateData);
  if (validateData.success === false) {
    return res.status(400).json({ ...validateData.error.issues });
  }

  try {
    const data = await AstronomicModel.findOneAndUpdate(
      { ProfileID },
      { ProfileID, ...validateData.data },
      { new: true }
    );

    return res
      .status(200)
      .json({ message: "Astronomic Details Created Succesfull", data });
  } catch (error) {
    console.error(error);
  }
};

export { CreateAstronomic, UpdateAstronomic };
