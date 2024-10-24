import { z } from "zod";
import { careermodel } from "../../model/Profile/Career.model.js";


const validateCarrer = z.object({
    designation:z.string().min(2),
    company:z.string().min(2),
    start:z.string().min(2),
    end:z.string().min(2)
})

const CreateCareer = async(req, res)=>{
    const carrerData = req.body;
    const ProfileID = req.user.ProfileID.toString()
    const validateData = validateCarrer.safeParse(carrerData);
   
    if (validateData.success === false) {
        return res.status(400).json({ ...validateData.error.issues });

    }

    const checkCarrer = await careermodel.findOne({ ProfileID })
    if (checkCarrer) {
        return res.status(400).json({ message: "Carrer already Exist" });
    }

    const data = await careermodel.create({ ProfileID, ...validateData.data})

    // console.log(validateData);
    return res.status(200).json({
        message:"Carrer Details Created",
        data
    })
    

}


const UpdateCarrer = async(req, res)=>{

    const ProfileID = req.user.ProfileID.toString();
    const data = req.body
    const validateData = validateCarrer.safeParse(data);
    // console.log(validateData.error.issues);

    if (validateData.success === false) {
        return res.status(400).json({ ...validateData.error.issues });

    }
    try {
        const updateData = await careermodel.findOneAndUpdate({ ProfileID }, { ...validateData.data }, { new: true })
        return res.status(200).json(updateData);
    } catch (error) {
        console.log(error);

    }

}

export { CreateCareer, UpdateCarrer }