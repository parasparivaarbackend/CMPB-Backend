import { z } from "zod";
import { eventdetails } from "../../model/Events/eventdetails.model.js";


const eventsSchema = z.object({
    availableDates:z.string().min(2),
    venues:z.string().min(2),
    amount:z.string().min(2),
    eventName:z.string().min(2)
})

const CreateEventDetails = async(req, res)=>{
    const createData = req.body;
    
    const validationData = eventsSchema.safeParse(createData)
    if (validationData.success === false) {
        return res.status(400).json({...validationData.error.issues})
    }

    const data = await eventdetails.create({...validationData.data})

    return res.status(200).json({message:"Events Details Created Succesfull", data })
    
}

export { CreateEventDetails }