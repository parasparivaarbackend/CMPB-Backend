import { ShowIntrestInModel } from "../../model/Profile/ShowIntrestIn.model.js";

const CreateShowIntrestIn = async (req, res) => {
  const ProfileID = req.user.ProfileID;
  const { IntrestedIn } = req.body;

  try {
    const profile = await ShowIntrestInModel.findOne({ ProfileID });
    if (!profile) {
      let ShowIntrest = await ShowIntrestInModel.create({
        ProfileID,
        IntrestedIn: [IntrestedIn],
      });
      if (!ShowIntrest) {
        return res.status(400).json({ message: "Something went wrong" });
      }
      return res.status(200).json({ message: "Intrest Added" });
    }
    const data = profile.IntrestedIn.filter(
      (item) => item.toString() === IntrestedIn
    );

    if (data && data.length > 0) {
      return res.status(200).json({ message: "Intrest Already exist" });
    }

    profile.IntrestedIn.push(IntrestedIn);
    await profile.save();

    return res.status(200).json({ message: "Intrest Added" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export { CreateShowIntrestIn };
