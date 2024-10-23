import {z} from 'zod'
import { presentaddressmodels } from '../../model/Profile/PresentAddress.js';

const validateSchema = z.object({
    ProfileID:z.string().min(2),
    Country:z.string().min(2),
    State:z.string().min(2),
    City:z.string().min(2),
    Pincode:z.string().min(2)
})

const CreatePresentAddress =async(req, res)=>{
    const data = req.body;
    const validateData = validateSchema.safeParse(data);

    if (validateData.success === false) {
        return res.status(400).json({ ...validateData.error.issues });
    }

    const insertData = await presentaddressmodels.create(validateData.data)
    res.status(200).json({
        message:"Present Address create successfull",
        data:insertData
    })
    
}




export { CreatePresentAddress }