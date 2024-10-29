import { z } from "zod";
import { ProfileModel } from "../../model/Profile/profile.model.js";
import { careermodel } from "../../model/Profile/Career.model.js";
import { UserModel } from "../../model/user.model.js";

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

  if (validateData.success === false) {
    return res.status(400).json({ ...validateData.error.issues });
  }
  try {
    const updatedProfile = await UserModel.findByIdAndUpdate(
      req.user._id,
      {
        ...validateData.data,
      },
      { new: true }
    );

    if (!updatedProfile) {
      return res.status(500).json({ message: "Failed to update Profile Data" });
    }
    return res.status(200).json({ message: "Data updated Successfully" });
  } catch (error) {
    console.error("error is ", error);
  }
};

const getProfileData = async (req, res) => {
  try {
    const profileDetails = await ProfileModel.aggregate([
      {
        $match: {
          _id: req.user.ProfileID,
        },
      },
      {
        $project: {
          basicDetails: {
            _id: "$_id",
            firstName: "$firstName",
            lastName: "$lastName",
            gender: "$gender",
            DOB: "$DOB",
            profileImage: "$profileImage",
          },
        },
      },
      {
        $lookup: {
          from: "presentaddressmodels",
          localField: "PresentAddress",
          foreignField: "profileid",
          as: "addressDetails",
          pipeline: [
            {
              $match: {
                ProfileID: req.user.ProfileID,
              },
            },
            {
              $project: {
                Country: 1,
                State: 1,
                City: 1,
                Pincode: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$addressDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "educations",
          localField: "education",
          foreignField: "profileid",
          as: "educationDetails",
          pipeline: [
            {
              $match: {
                ProfileID: req.user.ProfileID,
              },
            },
            {
              $project: {
                Degree: 1,
                insitution: 1,
                start: 1,
                end: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$educationDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "careers",
          localField: "careers",
          foreignField: "profileid",
          as: "careerDetails",
          pipeline: [
            {
              $match: {
                ProfileID: req.user.ProfileID,
              },
            },
            {
              $project: {
                designation: 1,
                company: 1,
                start: 1,
                end: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$careerDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "physicalattributes",
          localField: "physicalattributes",
          foreignField: "profileid",
          as: "physicalattributeDetails",
          pipeline: [
            {
              $match: {
                ProfileID: req.user.ProfileID,
              },
            },
            {
              $project: {
                Height: 1,
                weight: 1,
                skinComplexion: 1,
                BloodGroup: 1,
                Disablity: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$physicalattributeDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "languages",
          localField: "languages",
          foreignField: "profileid",
          as: "languageDetails",
          pipeline: [
            {
              $match: {
                ProfileID: req.user.ProfileID,
              },
            },
            {
              $project: {
                motherTounge: 1,
                knownLanguage: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$languageDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "hoobiesandintrests",
          localField: "hoobiesandintrests",
          foreignField: "profileid",
          as: "hoobiesandintrestDetails",
          pipeline: [
            {
              $match: {
                ProfileID: req.user.ProfileID,
              },
            },
            {
              $project: {
                Hobbies: 1,
                Intrest: 1,
                Music: 1,
                Books: 1,
                Movies: 1,
                tvShow: 1,
                Sports: 1,
                fitnessActivities: 1,
                cuisines: 1,
                dressStyle: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$hoobiesandintrestDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "personalattitudes",
          localField: "personalattitudes",
          foreignField: "profileid",
          as: "personalattitudeDetails",
          pipeline: [
            {
              $match: {
                ProfileID: req.user.ProfileID,
              },
            },
            {
              $project: {
                Affection: 1,
                religionService: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$personalattitudeDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "residencyinfos",
          localField: "residencyinfos",
          foreignField: "profileid",
          as: "residencyinfoDetails",
          pipeline: [
            {
              $match: {
                ProfileID: req.user.ProfileID,
              },
            },
            {
              $project: {
                birthCounty: 1,
                residencyCounty: 1,
                grownUpCountry: 1,
                ImmigrationStatus: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$residencyinfoDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "backgrounds",
          localField: "backgrounds",
          foreignField: "profileid",
          as: "backgroundDetails",
          pipeline: [
            {
              $match: {
                ProfileID: req.user.ProfileID,
              },
            },
            {
              $project: {
                Religion: 1,
                Caste: 1,
                SubCast: 1,
                SelfWorth: 1,
                FamilyWorth: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$backgroundDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "lifestyles",
          localField: "lifestyles",
          foreignField: "profileid",
          as: "lifestyleDetails",
          pipeline: [
            {
              $match: {
                ProfileID: req.user.ProfileID,
              },
            },
            {
              $project: {
                Diet: 1,
                Drink: 1,
                Smoke: 1,
                LivingWith: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$lifestyleDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "astronomics",
          localField: "astronomics",
          foreignField: "profileid",
          as: "astronomicDetails",
          pipeline: [
            {
              $match: {
                ProfileID: req.user.ProfileID,
              },
            },
            {
              $project: {
                SunSign: 1,
                MoonSign: 1,
                TimeOfBirth: 1,
                CityOfBirth: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$astronomicDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "permanentaddress",
          localField: "permanentaddress",
          foreignField: "profileid",
          as: "permanentaddressDetails",
          pipeline: [
            {
              $match: {
                ProfileID: req.user.ProfileID,
              },
            },
            {
              $project: {
                Country: 1,
                State: 1,
                City: 1,
                Pincode: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$permanentaddressDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "familyinfos",
          localField: "familyinfos",
          foreignField: "profileid",
          as: "familyinfoDetails",
          pipeline: [
            {
              $match: {
                ProfileID: req.user.ProfileID,
              },
            },
            {
              $project: {
                Father: 1,
                Mother: 1,
                siblings: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$familyinfoDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "partnerexpectations",
          localField: "partnerexpectations",
          foreignField: "profileid",
          as: "partnerexpectationDetails",
          pipeline: [
            {
              $match: {
                ProfileID: req.user.ProfileID,
              },
            },
            {
              $project: {
                GernalRequirement: 1,
                ResidenceCountry: 1,
                Height: 1,
                weight: 1,
                MaritalStatus: 1,
                Children: 1,
                Religion: 1,
                Caste: 1,
                SubCaste: 1,
                Language: 1,
                Education: 1,
                Profession: 1,
                SmokingAcceptable: 1,
                DietAcceptable: 1,
                DrinkAcceptable: 1,
                personalValue: 1,
                Manglik: 1,
                PreferredCountry: 1,
                PreferredState: 1,
                FamilyValue: 1,
                Complexion: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$partnerexpectationDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);

    if (!profileDetails) {
      return res.status(400).json({ message: "User do not exist" });
    }
    return res
      .status(200)
      .json({ message: "User Profile Data", profileDetails });
  } catch (error) {
    return res.status(500).json({ message: "Failed to get UserData" });
  }
};

export { UpdateProfileDetails, getProfileData };
