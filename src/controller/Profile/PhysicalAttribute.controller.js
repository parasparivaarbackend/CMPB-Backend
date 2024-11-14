import { z } from "zod";
import { PhysicalAttributeModel } from "../../model/Profile/PhysicalAttribute.model.js";

const validatePhysicalAttribute = z.object({
  Height: z.string().min(2),
  weight: z.string().min(2),
  skinComplexion: z.string().min(2),
  BloodGroup: z.string().min(2),
  Disablity: z.string().min(2),
});

const CreatePhysicalAttribute = async (req, res) => {
  const ProfileID = req.user.ProfileID.toString();
  const PhysicalAttributeData = req.body;

  const validateData = validatePhysicalAttribute.safeParse(
    PhysicalAttributeData
  );
  if (validateData.success === false) {
    return res.status(400).json({ ...validateData.error.issues });
  }

  const checkData = await PhysicalAttributeModel.findOne({ ProfileID });

  if (checkData) {
    return res.status(400).json({ message: "PhysicalAttribute already exist" });
  }

  const data = await PhysicalAttributeModel.create({
    ProfileID,
    ...validateData.data,
  });

  return res
    .status(200)
    .json({ message: "PhysicalAttribute Created Successfull", data });
};

const UpdatePhysicalAttribute = async (req, res) => {
  const ProfileID = req.user.ProfileID.toString();
  const physicalAttributeData = req.body;

  const validateData = validatePhysicalAttribute.safeParse(
    physicalAttributeData
  );
  if (validateData.success === false) {
    return res.status(400).json({ ...validateData.error.issues });
  }

  try {
    const data = await PhysicalAttributeModel.findOneAndUpdate(
      { ProfileID },
      { ...validateData.data },
      { new: true }
    );

    return res.status(200).json({
      message: "PhysicalAttribute Updated Succesfull",
      data,
    });
  } catch (error) {
    console.log(error);
  }
};

export { CreatePhysicalAttribute, UpdatePhysicalAttribute };
