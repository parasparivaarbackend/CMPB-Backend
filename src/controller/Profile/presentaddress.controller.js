import { z } from "zod";
import { presentaddressmodels } from "../../model/Profile/PresentAddress.js";

const validateSchema = z.object({
  Country: z.string().min(2),
  State: z.string().min(2),
  City: z.string().min(2),
  Pincode: z.string().min(6),
  ResidencyType: z.enum(["own", "rented"]),
  ResidencySince: z.number().gte(0),
});

const CreatePresentAddress = async (req, res) => {
  const data = req.body;
  const validateData = validateSchema.safeParse(data);

  if (validateData.success === false) {
    return res.status(400).json({ ...validateData.error.issues });
  }
  const ProfileID = req.user.ProfileID;

  const checkProfile = await presentaddressmodels.findOne({ ProfileID });

  if (checkProfile) {
    return res.status(400).json({ message: "Present Address already Exist" });
  }

  const insertData = await presentaddressmodels.create({
    ProfileID: ProfileID,
    ...validateData.data,
  });
  res.status(200).json({
    message: "Present Address create successfull",
    data: insertData,
  });
};

const UpdatePresentAddress = async (req, res) => {
  const ProfileID = req.user.ProfileID.toString();
  const data = req.body;

  const validateData = validateSchema.safeParse(data);

  if (validateData.success === false) {
    return res.status(400).json({ ...validateData.error.issues });
  }
  try {
    const updateData = await presentaddressmodels.findOneAndUpdate(
      { ProfileID },
      { ...validateData.data },
      { new: true }
    );
    return res
      .status(200)
      .json({ message: "PresentAddress Updated Succesfull", updateData });
  } catch (error) {
    console.error(error);
  }
};

export { CreatePresentAddress, UpdatePresentAddress };
