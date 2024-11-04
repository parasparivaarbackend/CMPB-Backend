import { ShowIntrestInModel } from "../../model/Profile/ShowIntrestIn.model.js";
import { UserModel } from "../../model/user.model.js";

const CreateShowIntrestIn = async (req, res) => {
  const ProfileID = req.user.ProfileID;
  const { IntrestedIn } = req.body; //User ID

  try {
    const profile = await ShowIntrestInModel.findOne({ ProfileID });
    if (!profile) {
      let ShowIntrest = await ShowIntrestInModel.create({
        ProfileID,
        IntrestedIn: [IntrestedIn],
      });

      if (!ShowIntrest)
        return res.status(400).json({ message: "Something went wrong" });

      return res.status(200).json({ message: "Intrest Added" });
    }
    const data = profile?.IntrestedIn.filter(
      (item) => item.toString() === IntrestedIn
    );

    if (data && data.length > 0)
      return res.status(200).json({ message: "Intrest Already exist" });

    profile.IntrestedIn.push(IntrestedIn);
    await profile.save();

    return res.status(200).json({ message: "Intrest Added" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const getAdminIntrestedIn = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) return res.status(400).json({ message: "Wrong profileID" });

    const Data = await ShowIntrestInModel.findOne({ ProfileID: id });

    if (!Data || Data.IntrestedIn.length === 0) {
      return res
        .status(200)
        .json({ message: "This user is not intrested in anyone" });
    }

    const IntrestedInData = Data.IntrestedIn;

    if (!Array.isArray(IntrestedInData) || IntrestedInData.length === 0)
      return res.status(400).json({ message: "Error" });

    // Use the $in operator to find users with the specified IDs
    const users = await UserModel.find({ _id: { $in: IntrestedInData } });

    return res.status(200).json({ message: "All intrested user", users });
  } catch (error) {
    console.log(error);
  }
};

export { CreateShowIntrestIn, getAdminIntrestedIn };
