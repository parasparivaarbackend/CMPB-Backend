import { eventdetails } from "../../model/Events/eventdetails.model.js";


const CreateEventDetails = async(req, res)=>{
    const ProfileID = req.admin.ProfileID.toString();
    const createData = req.body;
    console.log(ProfileID);
    console.log(createData);   
}

export { CreateEventDetails }