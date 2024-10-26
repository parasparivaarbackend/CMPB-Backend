import { ShowIntrestInModel } from "../../model/Profile/ShowIntrestIn.model.js";


const CreateShowIntrestIn = async(req, res)=>{
    const ProfileID = req.user.ProfileID;
    const { IntrestedIn } = req.body;

    try {
        // const checkDB = await ShowIntrestInModel.findOne({ ClientID : req.user._id})

        
        // if (checkDB) {
        //     return
        // }

        const data = await ShowIntrestInModel.create( {IntrestedIn} )
        
        
        
    } catch (error) {
        console.log(error);
        
    }
    
}

export { CreateShowIntrestIn }