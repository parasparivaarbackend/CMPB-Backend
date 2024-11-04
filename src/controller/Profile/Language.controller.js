import { z } from "zod";
import { LanguageModel } from "../../model/Profile/Language.model.js";

const validateLanguages = z.object({
  motherTounge: z.string().min(2),
  knownLanguage: z.string().min(2),
});

const CreateLanguages = async (req, res) => {
  const ProfileID = req.user.ProfileID.toString();
  const languageData = req.body;

  const validateData = validateLanguages.safeParse(languageData);
  if (validateData.success === false) {
    return res.status(400).json({ ...validateData.error.issues });
  }

  const checkData = await LanguageModel.findOne({ ProfileID });
  if (checkData) {
    return res.status(400).json({ message: "Languages already exist" });
  }

  const data = await LanguageModel.create({ ProfileID, ...validateData.data });
  return res
    .status(200)
    .json({ message: "Languages created Succesfull", data });
};

const UpdateLanguages = async (req, res) => {
  const ProfileID = req.user.ProfileID.toString();
  const updateData = req.body;

  const validateData = validateLanguages.safeParse(updateData);
  if (validateData.success === false) {
    return res.status(400).json({ ...validateData.error.issues });
  }

  const data = await LanguageModel.findOneAndUpdate(
    { ProfileID },
    { ...validateData.data },
    { new: true }
  );

  return res.status(200).json({ message: "Language Updated Succesfull", data });
};

export { CreateLanguages, UpdateLanguages };
