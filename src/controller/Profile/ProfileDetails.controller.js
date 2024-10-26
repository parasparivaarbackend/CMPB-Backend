import { z } from "zod";
import { ProfileModel } from "../../model/Profile/profile.model.js";
import { careermodel } from "../../model/Profile/Career.model.js";

export const ProfileDetailSchemaValidation = z.object({
  firstName: z.string().min(3).max(50),
  lastName: z.string().min(3).max(50),
  gender: z.enum(["male", "female"]),
  DOB: z.string(),
  profileImage: z.string().url().optional(),
});



const UpdateProfileDetails = async (req, res) => {
  const data = req.body;
  const validateData = ProfileDetailSchemaValidation.safeParse(data);
  console.log(validateData);
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


const getProfileData = async (req, res) => {
  console.log(req.user._id);
  let a = req.user.ProfileID.toString()
  console.log("a", a);

  const data = await ProfileModel.aggregate([
    {
      $match:{_id:req.user.ProfileID}
    },
    {
      $lookup:{
        from:'presentaddressmodels',
        localField:'PresentAddress',
        foreignField:'_id',
        as: 'PresentAddress',
        
      }
     
     
    }
  ])
  
  console.log(data);

}


export { UpdateProfileDetails, getProfileData }
