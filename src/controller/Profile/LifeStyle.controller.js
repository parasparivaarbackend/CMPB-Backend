import { z } from "zod";

const ValidateLifeStyle = z.object({
  Diet: z.boolean(),
  Drink: z.boolean(),
  Smoke: z.boolean(),
  LivingWith: z.string().min(2),
});

export const CreateLifeStyle = async (req, res) => {
  try {
    const validateData = ValidateLifeStyle.safeParse(req.body);

    if (!validateData.success)
      return res.status(400).json({ ...validateData.error.issues });

    /*
    const filter = { uniqueField: "someValue" };
    const update = { $set: { otherField: "newValue" } };
    const options = { upsert: true, new: true };

    YourModel.findOneAndUpdate(filter, update, options)
      .then((result) => console.log(result))
      .catch((error) => console.error("Error during upsert:", error.message));
    */
  } catch (error) {
    console.log(error);
  }
};
