import { z } from "zod";
import { PermanentAddressModel } from "../../model/Profile/PermanentAddress.model.js";


const PermanentAddressSchema = z.object({
    Country: z.string().min(2),
    State: z.string().min(2),
    City: z.string().min(2),
    Pincode: z.string().min(6)
})

const CreatePermanentAddress = async(req, res)=>{
    const ProfileID = req.user.ProfileID.toString();
    const createData = req.body;

    const validateData = PermanentAddressSchema.safeParse(createData)
    if (!validateData.success) {
        return res.status(400).json({...validateData.error.issues})
    }

    const checkPermanentAddress = await PermanentAddressModel.findOne({ ProfileID })
    if (checkPermanentAddress) {
        return res.status(400).json({ message: "Permanent Address already exist" })

    }

    const data = await PermanentAddressModel.create({ProfileID, ...validateData.data})

    return res.status(200).json({ message:"Permanent Address Created Succesfull", data})

      
}


const UpdatePermanentAddress = async(req, res)=>{
    const ProfileID = req.user.ProfileID.toString()
    const updateData = req.body

    const validateData = PermanentAddressSchema.safeParse(updateData)
    if (validateData.success === false) {
        return res.status(400).json({ ...validateData.error.issues })

    }

    const data = await PermanentAddressModel.findOneAndUpdate({ProfileID}, {ProfileID, ...validateData.data}, {new:true})

    return res.status(200).json({ message: "Permanent Address Update Succesfull",data })

    
}

export { CreatePermanentAddress, UpdatePermanentAddress }