import { z } from 'zod'
import { presentaddressmodels } from '../../model/Profile/PresentAddress.js';

const validateSchema = z.object({
    Country: z.string().min(2),
    State: z.string().min(2),
    City: z.string().min(2),
    Pincode: z.string().min(2)
})

const CreatePresentAddress = async (req, res) => {
    const data = req.body;
    const { ProfileID } = req.params
    const validateData = validateSchema.safeParse(data);

    if (validateData.success === false) {
        return res.status(400).json({ ...validateData.error.issues });
    }

    const insertData = await presentaddressmodels.create({ ProfileID, ...validateData.data })
    res.status(200).json({
        message: "Present Address create successfull",
        data: insertData
    })

}

const UpdatePresentAddress = async (req, res) => {
    const { id } = req.params
    const data = req.body
    const userId = req.user._id

    // const existUser = await 
 
    const validateData = validateSchema.safeParse(data);

    if (validateData.success === false) {
        return res.status(400).json({ ...validateData.error.issues });
    }
    try {

        const updateData = await presentaddressmodels.findByIdAndUpdate(id, { ...validateData.data }, { new: true })
        console.log(updateData);
        return res.status(200).json(updateData);
    } catch (error) {
        console.log(error);


    }
}


export { CreatePresentAddress, UpdatePresentAddress }