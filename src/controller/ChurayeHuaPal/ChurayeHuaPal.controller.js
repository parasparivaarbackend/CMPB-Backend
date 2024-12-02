import { z } from "zod";
import { ChurayeHuaPalModel } from "../../model/ChurayeHuaPal/ChurayeHuaPal.model.js";

const ChurayeHuaPalSchema = z.object({
  VideoURL: z.string().trim().url({ message: "Invalid URL" }),
});

const ChurayeHuaPalGet = async (req, res) => {
  const data = await ChurayeHuaPalModel.find({});
  if (!data) {
    return res.status(400).json({ message: "Data Not Found" });
  }
  return res
    .status(200)
    .json({ message: "Churaye Hua Pal get Succesfull", data });
};

const ChurayeHuaPalCreate = async (req, res) => {
  const createData = req.body;
  const validateData = ChurayeHuaPalSchema.safeParse(createData);
  if (validateData.success === false) {
    return res.status(400).json({ ...validateData.error.issues });
  }

  try {
    const data = await ChurayeHuaPalModel.create({ ...validateData.data });
    return res
      .status(200)
      .json({ message: "Churaye Hua Pal is Created Succesfull", data });
  } catch (error) {
    console.error(error);
  }
};

const ChurayeHuaPalUpdate = async (req, res) => {
  const updateData = req.body;
  const { id } = req.params;
  const validateData = ChurayeHuaPalSchema.safeParse(updateData);
  if (validateData.success === false) {
    return res.status(400).json({ ...validateData.error.issues });
  }
  try {
    const data = await ChurayeHuaPalModel.findByIdAndUpdate(
      id,
      { ...validateData.data },
      { new: true }
    );
    if (!data) {
      return res.status(400).json({ message: "Data Not Found", data });
    }
    return res
      .status(400)
      .json({ message: "Churaye Hua Pal is Updated Succesfull", data });
  } catch (error) {
    console.error(error);
  }
};

const ChurayeHuaPalDelete = async (req, res) => {
  const { id } = req.params;
  const data = await ChurayeHuaPalModel.findByIdAndDelete(id);
  if (!data) {
    return res.status(400).json({ message: "Data Not Found" });
  }

  return res
    .status(200)
    .json({ message: "Churaye Hua Pal Deleted Succesfull" });
};
export {
  ChurayeHuaPalCreate,
  ChurayeHuaPalUpdate,
  ChurayeHuaPalDelete,
  ChurayeHuaPalGet,
};
