import { z } from "zod"
import { HoobiesAndIntrestsModel } from "../../model/Profile/HoobiesAndIntrest.model.js"


const HoobiesAndIntrestSchema = z.object({
    Hobbies: z.string().min(2),
    Intrest: z.string().min(2),
    Music: z.string().min(2),
    Books: z.string().min(2),
    Movies: z.string().min(2),
    tvShow: z.string().min(2),
    Sports: z.string().min(2),
    fitnessActivities: z.string().min(2),
    cuisines: z.string().min(2),
    dressStyle: z.string().min(2)
})

const CreateHoobiesAndIntrest = async(req, res)=>{
    const ProfileID = req.user.ProfileID.toString()
    const HoobiesAndIntrestData = req.body

    const validateData = HoobiesAndIntrestSchema.safeParse(HoobiesAndIntrestData)
    if (validateData.success === false) {
        return res.status(400).json({...validateData.error.issues})
    }
    
    const checkHobbies = await HoobiesAndIntrestsModel.findOne({ ProfileID })
    if (checkHobbies) {
        return res.status(400).json({message:"Hobbies & Interest already exist" })
    }

    
    const data = await HoobiesAndIntrestsModel.create({ProfileID, ...validateData.data})

    return res.status(200).json({message:"Hobbies & Interest Created Succesfull", data})
}

const UpdateHoobiesAndIntrest = async(req, res)=>{
    const ProfileID = req.user.ProfileID.toString()
    const HoobiesAndIntrestData = req.body
    
    const validateData = HoobiesAndIntrestSchema.safeParse(HoobiesAndIntrestData)
    if (validateData.success === false) {
        return res.status(400).json({...validateData.error.issues})
    }

    const data = await HoobiesAndIntrestsModel.findOneAndUpdate({ProfileID}, {ProfileID, ...validateData.data}, {new:true})
    

    return res.status(200).json({ message:"Hoobbies & Interests Updated Succesfull", data})
}

export { CreateHoobiesAndIntrest, UpdateHoobiesAndIntrest }