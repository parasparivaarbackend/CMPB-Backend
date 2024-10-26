import { UserModel } from "../model/user.model.js";

const getAllUserByAdmin = async (req, res) => {
  const { query } = req;
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const newPage = limit * (page - 1);
  try {
    const data = await UserModel.find({}).skip(newPage).limit(limit);
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

export { getAllUserByAdmin };
