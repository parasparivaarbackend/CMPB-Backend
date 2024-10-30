import { UserModel } from "../model/user.model.js";

const getAllUserByAdmin = async (req, res) => {
  const { query } = req;
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const newPage = limit * (page - 1);
  try {
    const data = await UserModel.find({})
      .skip(newPage)
      .limit(limit)
      .select("-password");
    const data2 = await UserModel.find({}).countDocuments();

    return res.status(200).json({
      message: "All user Data",
      data,
      totalUsers: data2,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to fetch user" });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await UserModel.findById(id).select("-password -__v");
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

    console.log(data);
  } catch (error) {
    console.log(error);
  }
};

const getActiveUser = async (req, res) => {
  const gender = req.user.gender === "male" ? "female" : "male";

  try {
    const AllUser = await UserModel.find({
      gender,
      active: true,
    }).select("-password -role -__v");

    if (!AllUser || AllUser.length === 0)
      return res.status(400).json({ message: "Failed to Fetch User" });

    return res.status(200).json({ message: "All User Data", data: AllUser });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to Fetch User" });
  }
};

export { getAllUserByAdmin, getUserById, getActiveUser };
