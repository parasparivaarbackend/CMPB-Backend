import { z } from "zod";
import { ConatctModel } from "../../model/Contact/Contact.model.js";

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10).max(12),
  message: z.string().min(5),
});

const getContact = async (req, res) => {
  const { query } = req;

  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 1;
  const newPage = limit * (page - 1);

  try {
    const data = await ConatctModel.find().skip(newPage).limit(limit);

    return res.status(200).json({ massage: "Contact Get succesfull", data });
  } catch (error) {
    console.error(error);
  }
};

const CreateContactUs = async (req, res) => {
  const contactData = req.body;

  const validateData = contactSchema.safeParse(contactData);
  if (validateData.success === false) {
    return res.status(400).json({ ...validateData.error.issues });
  }

  await ConatctModel.create({ ...validateData.data });

  return res.status(200).json({ massage: "message send succesfull" });
};

const DeleteContact = async (req, res) => {
  const { id } = req.params;
  try {
    await ConatctModel.findByIdAndDelete(id);
    return res.status(200).json({ massage: "Conatct Deleted succesfull" });
  } catch (error) {
    console.error(error);
  }
};

export { CreateContactUs, getContact, DeleteContact };
