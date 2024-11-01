import { z } from "zod";
import { UploadBucketHandler, DeleteBucketFile } from "../../utils/CloudBucketHandler.js";
import { happystoriesmodel } from "../../model/HappyStories/HappyStories.model.js";


const HappyStoriesSchema = z.object({
    Groom: z.string().min(2),
    Bride: z.string().min(2),
    Content: z.string().min(2)
})


const CreateHappyStories = async(req, res)=>{
    const createData = req.body;
    const img = req.file
    if (!img) {
        return res.status(400).json({message:"Image is Required"})
    }

    const validateData = HappyStoriesSchema.safeParse(createData)
    if (validateData.success === false) {
        return res.status(400).json({...validateData.error.issues})
    }

    try {
        const uploadImage = await UploadBucketHandler(img, "happystories")
        const imageData ={
            ImageURL: uploadImage.URL,
            ImageID:uploadImage.uploadID
        }
        const data = await happystoriesmodel.create({ ...validateData.data, story:imageData})
        return res.status(200).json({ message: "Happy Story Created Ssuccesfull", data })
    } catch (error) {
        console.log(error);
    }
    
}

const UpdateHappyStories = async(req, res)=>{
    const updateData = req.body;
    const {id} = req.params;
    const img = req.file;

    try {
        const user = await happystoriesmodel.findById(id)
        if (!user) {
            return res.status(400).json({message:"Happy Story Not Found"})
        }
        
        console.log(user?.story?.ImageID);
        
    
        return res.status(200).json({ message: "Happy Story Found" })
    } catch (error) {
        return res.status(400).json({ message: "Something wrong try again" })
        
    }
}

export { CreateHappyStories, UpdateHappyStories }