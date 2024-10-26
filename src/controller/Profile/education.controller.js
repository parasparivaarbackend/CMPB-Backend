import { date, z } from 'zod';
import {EducationModel} from '../../model/Profile/education.model.js'

const educationValidate = z.object({
    Degree:z.string().min(2),
    insitution:z.string().min(2),
    start:z.string().min(2),
    end:z.string().min(2)
})

const CreateEducation =async(req, res)=>{
    const ProfileID = req.user.ProfileID.toString();
    const educationData = req.body;

    const validateData = educationValidate.safeParse(educationData)
    if (validateData.success === false) {
        return res.status(400).json({...validateData.error.issues})
    }

    const checkEducation = await EducationModel.findOne({ ProfileID })
    if (checkEducation) {
        return res.status(400).json({message:"Education already Exist"})
    }

    const data = await EducationModel.create({ProfileID, ...validateData.data})

    res.status(200).json({
        message:"Education Created Succesfull",
        data
    })
    

}

const UpdateEducation = async(req, res)=>{
    const ProfileID = req.user.ProfileID.toString();
    const educationData = req.body

    const validateData = educationValidate.safeParse(educationData)
    if (validateData.success === false) {
        return res.status(400).json({...validateData.error.issues})
    }

   const data = await EducationModel.findOneAndUpdate({ProfileID}, {...validateData.data}, {new:true})

    res.status(200).json({message:"Education Updated Successfull",
        data
    })
}

export { CreateEducation, UpdateEducation }