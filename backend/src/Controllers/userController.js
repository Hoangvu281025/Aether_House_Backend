const UserModel = require('../Models/userModel');
const RoleModel = require('../Models/roleModel');
// const cloudinary = require('../config/cloudinary');



const userController = {
    getallUser: async (req, res) => {
        try {
            // lấy page & limit từ query (mặc định page = 1, limit = 10)
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 8;
            const skip = (page - 1) * limit;
            const adminRole = await RoleModel.findOne({ name: "admin" }).select("_id");
            // query user
            const users = await UserModel.find({role_id: { $ne: adminRole._id } })
                .select("-password")
                .populate({
                    path: "role_id",
                    select: "name"
                })
                .skip(skip)   // bỏ qua bao nhiêu record
                .limit(limit) // lấy bao nhiêu record
                .lean();
                
            // đếm tổng số user (để frontend biết có bao nhiêu page)
            const total = await UserModel.countDocuments({ role_id: { $ne: adminRole._id } });
            res.status(200).json({
                total,         // tổng số user
                page,          // trang hiện tại
                limit,         // số user mỗi trang
                totalPages: Math.ceil(total / limit),
                users   // danh sách user
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: "Internal server error" });
        }
    },

    getallAdmin: async (req, res) => {
        try {
            const users = await UserModel.find()
            .select("-password")
            .populate({
                path: "role_id",
                select: "name"
            });

            // lọc bỏ những user có role là "user"
            const result = users.filter(u => u.role_id?.name !== "user");

            res.status(200).json(result);

            
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
