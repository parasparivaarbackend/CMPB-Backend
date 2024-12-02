import { z } from "zod";
import { careermodel } from "../../model/Profile/Career.model.js";

const validateCarrer = z.object({
  currentJob: z.object({
    designation: z.string().trim().min(2),
    company: z.string().trim().min(2),
    start: z.string().trim().min(2),
    end: z.string().trim().min(2),
  }),
  previousJobs: z.object({
    designation: z.string(),
    company: z.string(),
    start: z.string(),
    end: z.string(),
  }),
});

const CreateCareer = async (req, res) => {
  const carrerData = req.body;
  const ProfileID = req.user.ProfileID.toString();
  const validateData = validateCarrer.safeParse(carrerData);

  if (validateData.success === false) {
    return res.status(400).json({ ...validateData.error.issues });
  }

  const checkCarrer = await careermodel.findOne({ ProfileID });
  if (checkCarrer) {
    return res.status(400).json({ message: "Carrer already Exist" });
  }

  const data = await careermodel.create({ ProfileID, ...validateData.data });

  return res.status(200).json({
    message: "Carrer Details Created",
    data,
  });
};

const UpdateCarrer = async (req, res) => {
  const ProfileID = req.user.ProfileID.toString();
  const data = req.body;
  const validateData = validateCarrer.safeParse(data);

  if (validateData.success === false) {
    return res.status(400).json({ ...validateData.error.issues });
  }
  try {
    const updateData = await careermodel.findOneAndUpdate(
      { ProfileID },
      { ...validateData.data },
      { new: true }
    );
    return res
      .status(200)
      .json({ message: "Carrer Detail Updated Succesfull", updateData });
  } catch (error) {
    console.error(error);
  }
};

export { CreateCareer, UpdateCarrer };
