const UserModel = require('../Models/userModel');
// const RoleModel = require('../Models/roleModel');
// const cloudinary = require('../config/cloudinary');



const userController = {
    getallUser: async (req, res) => {
        try {
            const user = await UserModel.find().populate('role_id' , 'name');

            res.status(200).json(user)
            
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },
    deleteUser: async (req, res) => {
        try {
            const user = await UserModel.findById(req.params.id);
            res.status(200).json("delete successfully")
            
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },


}




module.exports = {userController}
