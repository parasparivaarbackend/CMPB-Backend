import { z } from "zod";
import { PersonalAttitudeModel } from '../../model/Profile/PersonalAttitude.model.js'

const validatePersonalAttitude = z.object({  
        Affection: z.string().min(2),
        religionService: z.string().min(2)
    
})

const CreatePersonalAttitude = async(req, res)=>{
    const ProfileID = req.user.ProfileID.toString();
    const PersonalAttitudeData = req.body;

    const validateData = validatePersonalAttitude.safeParse(PersonalAttitudeData)
    if (validateData.success === false) {
        return res.status(400).json({...validateData.error.issues})
    }

    const checkData = await PersonalAttitudeModel.findOne({ ProfileID });
    if (checkData) {
        return res.status(400).json({ message:"Personal Attitude already exist"})
    }

    const data = await PersonalAttitudeModel.create({ProfileID, ...validateData.data})
    return res.status(200).json({ message: "Personal Attitude Created succesfull", data })
    
}

const UpdatePersonalAttitude = async(req, res)=>{
    const ProfileID = req.user.ProfileID.toString();
    const updateData = req.body;
    
    const validateData = validatePersonalAttitude.safeParse(updateData);
    if (validateData.success === false) {
        return res.status(400).json({...validateData.error.issues})
    }
    
    const data = await PersonalAttitudeModel.findOneAndUpdate({ProfileID}, {ProfileID, ...validateData.data}, {new:true});
    return res.status(200).json({ message:"Personal Attitude Updated Succesfull", data})

}

export { CreatePersonalAttitude, UpdatePersonalAttitude }
