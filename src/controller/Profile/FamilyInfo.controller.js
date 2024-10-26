import { z } from "zod";
import { FamilyInfoModel } from "../../model/Profile/FamilyInfo.model.js";

const FamilyInfoSchema = z.object({
    Father: z.string().min(2),
    Mother: z.string().min(2),
    siblings: z.string().min(1)
}) 

const CreateFamilyInfo = async(req, res)=>{
    const ProfileID = req.user.ProfileID.toString();
    const createData = req.body;
    
    const validateData = FamilyInfoSchema.safeParse(createData)
    if (validateData.success === false) {
        return res.status(400).json({...validateData.error.issues })
    }

    const checkFamilyInfo = await FamilyInfoModel.findOne({ ProfileID })
    if (checkFamilyInfo) {
        return res.status(400).json({ message: "Family Info Created Succesfull" })
    }

    const data = await FamilyInfoModel.create({ProfileID, ...validateData.data})
    return res.status(200).json({ message: "Family Info Created Succesfull", data })

}

const UpdateFamilyInfo = async(req, res)=>{
    const ProfileID = req.user.ProfileID.toString();
    const updateData = req.body;

    const validateData = FamilyInfoSchema.safeParse(updateData);
    if (validateData.success === false) {
        return res.status(400).json({...validateData.error.issues })
    }

    const data = await FamilyInfoModel.findOneAndUpdate({ProfileID}, {ProfileID, ...validateData.data}, {new:true})

    return res.status(200).json({ message: "Family Info Created Succesfull", data })

    
}

export { CreateFamilyInfo, UpdateFamilyInfo }