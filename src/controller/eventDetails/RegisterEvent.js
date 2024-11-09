import { RegisterModel } from "../../model/Events/Register.model.js";

export const CreateRegisterPackage = async (req, res) => {
  const { amount } = req.body;

  if (!typeof amount === "number" && amount < 0)
    return res.status(400).json({ message: "enter a valid amount" });
  try {
    const register = await RegisterModel.find({});

    if (register && register.length > 0)
      return res.status(400).json({ message: "Package already exist" });

    await RegisterModel.create({ amount });
    return res.status(200).json({ message: "Package Created successfully" });
  } catch (error) {
    return res.status(500).json({ message: "failed to add package", error });
  }
};
export const UpdateRegisterPackage = async (req, res) => {
  const { amount } = req.body;
  const { id } = req.params;

  if (!typeof amount === "number" && amount <= 0)
    return res.status(400).json({ message: "enter a valid amount" });

  try {
    const register = await RegisterModel.findById(id);

    if (!register)
      return res.status(400).json({ message: "Package Do not exist" });

    register.amount = amount;
    await register.save();

    return res.status(200).json({ message: "Package updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "failed to update package", error });
  }
};
export const GetRegisterPackage = async (_, res) => {
  try {
    const register = await RegisterModel.find({});

    if (!register)
      return res
        .status(400)
        .json({ message: "Currently dont have any package" });

    return res
      .status(200)
      .json({ message: "Package updated successfully", data: register[0] });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "failed to get package", error });
  }
};
