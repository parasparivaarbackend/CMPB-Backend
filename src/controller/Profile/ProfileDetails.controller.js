import { z } from "zod";
import { ProfileModel } from "../../model/Profile/profile.model.js";
import mongoose from "mongoose";

export const ProfileDetailSchemaValidation = z.object({
  firstName: z.string().min(3).max(50),
  lastName: z.string().min(3).max(50),
  gender: z.enum(["male", "female"]),
  DOB: z.string(),
  profileImage: z.string().url().optional(),
});

const getProfileData = async (req, res) => {
  try {
    const profileDetails = await ProfileModel.aggregate([
      {
        $match: {
          _id: req.user.ProfileID,
        },
      },
      {
        $lookup: {
          from: "presentaddressmodels",
          localField: "PresentAddress",
          foreignField: "ProfileID",
          as: "addressDetails",
          pipeline: [
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
          foreignField: "ProfileID",
          as: "educationDetails",
          pipeline: [
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
          foreignField: "ProfileID",
          as: "careerDetails",
          pipeline: [
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
          foreignField: "ProfileID",
          as: "physicalattributeDetails",
          pipeline: [
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
          foreignField: "ProfileID",
          as: "languageDetails",
          pipeline: [
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
          foreignField: "ProfileID",
          as: "hoobiesandintrestDetails",
          pipeline: [
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
          foreignField: "ProfileID",
          as: "personalattitudeDetails",
          pipeline: [
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
          foreignField: "ProfileID",
          as: "residencyinfoDetails",
          pipeline: [
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
          foreignField: "ProfileID",
          as: "backgroundDetails",
          pipeline: [
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
          foreignField: "ProfileID",
          as: "lifestyleDetails",
          pipeline: [
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
          foreignField: "ProfileID",
          as: "astronomicDetails",
          pipeline: [
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
          from: "permanentaddresses",
          localField: "permanentaddress",
          foreignField: "ProfileID",
          as: "permanentaddressDetails",
          pipeline: [
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
          foreignField: "ProfileID",
          as: "familyinfoDetails",
          pipeline: [
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
          foreignField: "ProfileID",
          as: "partnerexpectationDetails",
          pipeline: [
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

    return res.status(200).json({
      message: "User Profile Data",
      profileDetails: { ...profileDetails[0], user: req.user },
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to get UserData" });
  }
};

const getAdminProfileData = async (req, res) => {
  const { id } = req.params;
  const objectId = new mongoose.Types.ObjectId(id);

  if (!objectId) return res.status(400).json({ message: "Wrong Profile" });

  try {
    const profileDetails = await ProfileModel.aggregate([
      {
        $match: {
          UserID: objectId,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "ProfileID",
          as: "User",
          pipeline: [
            {
              $project: {
                MemberID: 1,
                firstName: 1,
                lastName: 1,
                gender: 1,
                DOB: 1,
                profileImage: 1,
                email: 1,
                phone: 1,
                active: 1,
                RegisterPackage: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$User",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "presentaddressmodels",
          localField: "PresentAddress",
          foreignField: "ProfileID",
          as: "addressDetails",
          pipeline: [
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
          foreignField: "ProfileID",
          as: "educationDetails",
          pipeline: [
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
          foreignField: "ProfileID",
          as: "careerDetails",
          pipeline: [
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
          foreignField: "ProfileID",
          as: "physicalattributeDetails",
          pipeline: [
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
          foreignField: "ProfileID",
          as: "languageDetails",
          pipeline: [
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
          foreignField: "ProfileID",
          as: "hoobiesandintrestDetails",
          pipeline: [
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
          foreignField: "ProfileID",
          as: "personalattitudeDetails",
          pipeline: [
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
          foreignField: "ProfileID",
          as: "residencyinfoDetails",
          pipeline: [
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
          foreignField: "ProfileID",
          as: "backgroundDetails",
          pipeline: [
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
          foreignField: "ProfileID",
          as: "lifestyleDetails",
          pipeline: [
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
          foreignField: "ProfileID",
          as: "astronomicDetails",
          pipeline: [
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
          from: "permanentaddresses",
          localField: "permanentaddress",
          foreignField: "ProfileID",
          as: "permanentaddressDetails",
          pipeline: [
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
          foreignField: "ProfileID",
          as: "familyinfoDetails",
          pipeline: [
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
          foreignField: "ProfileID",
          as: "partnerexpectationDetails",
          pipeline: [
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

    return res.status(200).json({
      message: "User Profile Data",
      profileDetails: { ...profileDetails[0] },
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to get UserData" });
  }
};

export { getProfileData, getAdminProfileData };
