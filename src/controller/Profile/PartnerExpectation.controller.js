import { z } from "zod";
import { PartnerExpectationModel } from "../../model/Profile/PartnerExpectation.model.js";

const PartnerExpectationSchema = z.object({
  GernalRequirement: z.string().min(2),
  ResidenceCountry: z.string().min(2),
  Height: z.number().min(2),
  weight: z.number().min(2),
  MaritalStatus: z.string().min(2),
  Children: z.number().min(0),
  Religion: z.string().min(2),
  Caste: z.string().min(2),
  SubCaste: z.string().min(2),
  Language: z.string().min(2),
  Education: z.string().min(2),
  Profession: z.string().min(2),
  SmokingAcceptable: z.enum(["true", "false"]),
  DrinkAcceptable: z.enum(["true", "false"]),
  DietAcceptable: z.enum(["true", "false"]),
  personalValue: z.number().min(2),
  Manglik: z.enum(["true", "false"]),
  PreferredCountry: z.string().min(2),
  PreferredState: z.string().min(2),
  FamilyValue: z.number().min(2),
  Complexion: z.string().min(2),
});

const CreatePartnerExpectation = async (req, res) => {
  const ProfileID = req.user.ProfileID.toString();
  const createData = req.body;

  const validaData = PartnerExpectationSchema.safeParse(createData);
  if (validaData.success === false) {
    return res.status(400).json({ ...validaData.error.issues });
  }

  const checkPartnerExpectaion = await PartnerExpectationModel.findOne({
    ProfileID,
  });
  if (checkPartnerExpectaion) {
    return res
      .status(400)
      .json({ message: "Partner Expectation already exist" });
  }

  const data = await PartnerExpectationModel.create({
    ProfileID,
    ...validaData.data,
  });
  return res
    .status(200)
    .json({ message: "Partner Expectation Created Succesfull", data });
};

const UpdatePartnerExpectation = async (req, res) => {
  const ProfileID = req.user.ProfileID.toString();
  const updateData = req.body;

  const validateData = PartnerExpectationSchema.safeParse(updateData);
  if (validateData.success === false) {
    return res.status(400).json({ ...validateData.error.issues });
  }

  const data = await PartnerExpectationModel.findOneAndUpdate(
    { ProfileID },
    { ProfileID, ...validateData.data },
    { new: true }
  );
  return res
    .status(200)
    .json({ message: "Partner Expectation Updated Succesfull", data });
};

export { CreatePartnerExpectation, UpdatePartnerExpectation };
