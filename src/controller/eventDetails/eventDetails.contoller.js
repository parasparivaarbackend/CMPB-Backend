


const CreateEventDetails = async(req, res)=>{
    const ProfileID = req.user.ProfileID.toString();
    const createData = req.body;
    console.log(ProfileID);
    console.log(createData);   
}

export { CreateEventDetails }