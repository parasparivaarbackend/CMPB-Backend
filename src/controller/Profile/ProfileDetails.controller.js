import { z } from "zod";
import { ProfileModel } from "../../model/Profile/profile.model.js";

export const ProfileDetailSchemaValidation = z.object({
  firstName: z.string().min(3).max(50),
  lastName: z.string().min(3).max(50),
  gender: z.enum(["male", "female"]),
  DOB: z.string(),
  profileImage: z.string().url().optional(),
});

// export const CreateProfileDetails = async (req, res) => {
//   const data = req.body;
//   const validateData = ProfileDetailSchemaValidation.safeParse(data);

//   if (validateData.success === false) {
//     return res.status(400).json({ ...validateData.error.issues });
//   }

//   try {
//     const ProfileDetails = await ProfileModel.create({
//       ...validateData.data,
//       UserID: req?.user._id,
//     });

//     if (!ProfileDetails)
//       return res.status(400).json({ message: "Failed to add Profile Details" });

//     return res
//       .status(200)
//       .json({ message: "Profile details Added Successfully" });
//   } catch (error) {
//     return res.status(500).json({ message: "Failed to add Profile Details" });
//   }
// };

export const UpdateProfileDetails = async (req, res) => {
  const data = req.body;
  const validateData = ProfileDetailSchemaValidation.safeParse(data);
  console.log(validateData);
  return;
  if (validateData.success === false) {
    return res.status(400).json({ ...validateData.error.issues });
  }
  try {
    const updatedProfile = await ProfileModel.findByIdAndUpdate(
      { _id: data.ProfileID },
      { ...data }
    );
    if (!updatedProfile) {
      return res.status(500).json({ message: "Failed to update Profile Data" });
    }
    return res.json(200).json({ message: "Data updated Successfully" });
  } catch (error) {
    console.error(error);
  }
};
