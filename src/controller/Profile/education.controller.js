import { z } from 'zod';
import {EducationModel} from '../../model/Profile/education.model.js'

const educationValidate = z.object({
    Degree:z.string().min(2),
    insitution:z.string().min(2),
    start:z.string().min(2),
    end:z.string().min()
})

const CreateEducation =async(req, res)=>{
    const ProfileID = req.user.ProfileID.toString();
    const data = req.body;
    console.log(ProfileID);
    console.log(data);
    
}

export { CreateEducation }