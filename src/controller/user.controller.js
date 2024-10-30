import { ProfileModel } from "../model/Profile/profile.model.js";
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
    const data = await ProfileModel.findById(id).select("-password -__v");
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
