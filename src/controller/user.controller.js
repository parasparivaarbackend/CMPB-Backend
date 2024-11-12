import { z } from "zod";
import fs from "fs";
import { UserModel } from "../model/user.model.js";
import {
  DeleteBucketFile,
  ListFilesHandler,
  UploadBucketHandler,
} from "../utils/CloudBucketHandler.js";
import { ProfileModel } from "../model/Profile/profile.model.js";

export const UserProfileSchemaValidation = z.object({
  firstName: z.string().min(3).max(50),
  lastName: z.string().min(3).max(50),
  gender: z.enum(["male", "female"]),
  DOB: z.string(),
});

const UpdateProfileDetails = async (req, res) => {
  const data = req.body;
  const validateData = UserProfileSchemaValidation.safeParse(data);

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
    return res.status(500).json({ message: "Failed to update Basic Detail" });
  }
};
let img;
const ProfileImageUpdate = async (req, res) => {
  img = req.file;

  try {
    if (!img) {
      return res.status(400).json({ message: "Image is Required" });
    }
    const user = await UserModel.findById(req.user._id);

    if (user?.profileImage && user?.profileImage.ImageID) {
      await DeleteBucketFile(user?.profileImage?.ImageID);
    }

    const image = await UploadBucketHandler(img, "User");

    user.profileImage.ImageID = image.uploadID;
    user.profileImage.ImageURL = image.URL;
    await user.save();
    img = null;

    return res.status(200).json({ message: "Image updated Successfully" });
  } catch (error) {
    fs.unlinkSync(img.path);
    img = null;
    console.error("error is ", error);
    return res.status(500).json({ message: "Failed to upload Image" });
  }
};
const ProfileImageDelete = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id);

    if (user?.profileImage && user?.profileImage?.ImageID)
      await DeleteBucketFile(user?.profileImage?.ImageID);

    user.profileImage = undefined;
    await user.save();

    return res.status(200).json({ message: "Deleted Image Successfully" });
  } catch (error) {
    console.error("error is ", error);
    return res.status(500).json({ message: "Failed to Deleted Image" });
  }
};
const ManualDeleteImage = async (req, res) => {
  try {
    const deletedFile = await DeleteBucketFile(req?.body?.id);

    return res.status(200).json({ message: "Deleted Image Successfully" });
  } catch (error) {
    console.error("error is ", error);
  }
};

const getAllUserByAdmin = async (req, res) => {
  const { query } = req;

  if (
    typeof query.registered !== "string" &&
    query.registered !== "false" &&
    query.registered !== "true"
  )
    return res.status(400).json({ message: "Enter Valid Value" });

  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const newPage = limit * (page - 1);
  try {
    const data = await UserModel.find({
      " RegisterPackage.PremiumMember": query.registered,
    })
      .skip(newPage)
      .limit(limit)
      .select("-password");

    return res.status(200).json({
      message: "All user Data",
      data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to fetch user" });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await UserModel.findById(id).select("-password -__v");
    if (!user) return res.status(400).json({ message: "User not found" });

    const profileDetails = await ProfileModel.aggregate([
      {
        $match: {
          _id: user.ProfileID,
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
          foreignField: "profileid",
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
          foreignField: "profileid",
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
          foreignField: "profileid",
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
          foreignField: "profileid",
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
          foreignField: "profileid",
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
          foreignField: "profileid",
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
          foreignField: "profileid",
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
          foreignField: "profileid",
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
          foreignField: "profileid",
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
          foreignField: "profileid",
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
          foreignField: "profileid",
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
          foreignField: "profileid",
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
          foreignField: "profileid",
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
          foreignField: "profileid",
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

    console.log(profileDetails);
    return res.status(200).json({
      message: "User Profile Data",
      profileDetails: { ...profileDetails[0] },
    });
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

const getMemberByID = async (req, res) => {
  try {
    const id = req.query.id;
    let MemberID;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;
    if (hasSpecialChar.test(id) || id?.length !== 6) {
      return res.status(400).json({ message: "Wrong Member ID" });
    }
    const user = await UserModel.findOne({ MemberID }).select(
      "--password -__v"
    );
    if (!user) {
      return res.status(400).json({ message: "Member Not Found" });
    }

    return res.status(200).json({ message: "Member Found", user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const listFiles = async (_, res) => {
  try {
    const files = await ListFilesHandler();
    console.log(files);
    return res.status(200).json({ message: "all files", files });
  } catch (error) {
    console.log(error);
  }
};

const packagePaymentInUserModelValidation = z.object({
  PaymentID: z.string().min(5, "Wrong Payment ID"),
  OrderID: z.string().min(5, "Wrong Order ID"),
  amount: z.number().min(100),
});

const UserPackageData = async (req, res) => {
  const data = req.body;
  const validateData = packagePaymentInUserModelValidation.safeParse(data);
  if (!validateData?.success) {
    return res.status(400).json({ message: "wrong payment detail" });
  }
  try {
    const user = await UserModel.findById(req?.user?._id);

    user.RegisterPackage.PremiumMember = true;
    user.RegisterPackage.PaymentID = validateData?.data?.PaymentID;
    user.RegisterPackage.OrderID = validateData?.data?.OrderID;
    user.RegisterPackage.amount = validateData?.data?.amount;
    await user.save();
    return res.status(200).json({ message: "Payment updated successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Failed to update package payment" });
  }
};

export {
  getAllUserByAdmin,
  getUserById,
  getActiveUser,
  UpdateProfileDetails,
  ProfileImageUpdate,
  ProfileImageDelete,
  listFiles,
  ManualDeleteImage,
  getMemberByID,
  UserPackageData,
};
