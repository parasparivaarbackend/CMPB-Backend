import { UserModel } from "../../model/user.model.js"

const DeactivateAccount = async (req, res) => {
    const id = req.user?._id;
    try {
        await UserModel.findByIdAndUpdate(id, { active: false })
        res.clearCookie("token").clearCookie("role")
        return res.status(200).json({ message: "Account Deactivate Succesfull" })
    } catch (error) {
        console.log(error);

    }


}

export { DeactivateAccount }