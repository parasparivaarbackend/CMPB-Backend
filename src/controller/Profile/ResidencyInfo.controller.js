import { z } from "zod";
import { residencyInfosModal } from "../../model/Profile/residencyCounty.model.js";

const validateResidencyInfo = z.object({
  birthCounty: z.string().min(2),
  residencyCounty: z.string().min(2),
  grownUpCountry: z.string().min(2),
  ImmigrationStatus: z.string().min(2),
});

const CreateResidencyInfo = async (req, res) => {
  const ProfileID = req.user.ProfileID.toString();
  const createData = req.body;

  const validateData = validateResidencyInfo.safeParse(createData);
  if (validateData.success === false) {
    return res.status(400).json({ ...validateData.error.issues });
  }

  const checkResidencyInfo = await residencyInfosModal.findOne({ ProfileID });
  if (checkResidencyInfo) {
    return res
      .status(400)
      .json({ message: "Residency Information already exist" });
  }

  const data = await residencyInfosModal.create({
    ProfileID,
    ...validateData.data,
  });

  return res
    .status(200)
    .json({ message: "Residency Information Created Succesfull", data });
};

const UpdateResidencyInfo = async (req, res) => {
  const ProfileID = req.user.ProfileID.toString();
  const data = req.body;

  const validateData = validateResidencyInfo.safeParse(data);

  if (validateData.success === false) {
    return res.status(400).json({ ...validateData.error.issues });
  }

  try {
    const updateData = await residencyInfosModal.findOneAndUpdate(
      { ProfileID },
      { ...validateData.data },
      { new: true }
    );
    return res
      .status(200)
      .json({
        message: "Residency Information Updated Succesfull",
        updateData,
      });
  } catch (error) {
    console.error(error);
  }
};

export { CreateResidencyInfo, UpdateResidencyInfo };
