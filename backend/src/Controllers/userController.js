const UserModel = require('../Models/userModel');
const RoleModel = require('../Models/roleModel');
const AddressModel = require('../Models/addressModel');
const cloudinary = require('../config/cloudinary');
const bcrypt = require('bcryptjs');



const userController = {
    getallUser: async (req, res) => {
        try {
            // lấy page & limit từ query (mặc định page = 1, limit = 10)
            const page = parseInt(req.query.page) || 1; 
            const limit = parseInt(req.query.limit) || 8;
            const skip = (page - 1) * limit;
            const adminRole = await RoleModel.find({ name: { $in: ["admin", "superadmin"] } }).select("_id");
            const excludeRoleIds = adminRole.map(r => r._id);
            const users = await UserModel.find({role_id: { $nin: excludeRoleIds } })
                .select("-password")
                .populate({
                    path: "role_id",
                    select: "name"
                })
                .skip(skip)   // bỏ qua bao nhiêu record
                .limit(limit) // lấy bao nhiêu record
                .lean();
                
            // đếm tổng số user (để frontend biết có bao nhiêu page)
            const total = await UserModel.countDocuments({ role_id: { $nin: excludeRoleIds } });
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
            // lấy page & limit từ query (mặc định page = 1, limit = 10)
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 8;
            const skip = (page - 1) * limit;
            const adminRole = await RoleModel.findOne({ name: "user" }).select("_id");
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

    getbyID: async (req, res) => {
        try {
            const id = req.params.id; // lấy id từ query
            if (!id) {
                return res.status(400).json({ error: "ID is required" });
            }

            const user = await UserModel.findById(id).populate("role_id",""); 
            const addresses = await AddressModel.find({ user_id: id });
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            res.status(200).json({
                user,
                addresses
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: "Internal server error" });
        }
    },





    

    updateApprovalStatusUser: async (req, res) => {
        try {
            const user = await UserModel.findById(req.params.id);

                if (!user) {
                return res.status(404).json({ error: "User not found" });
                }

                user.approvalStatus = user.approvalStatus === "pending" ? "approved" : "pending";
                await user.save();

                return res.status(200).json({
                    message: "User approved successfully",
                    user,
                });
            
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },



    updateImageAdmin: async (req , res) =>{
        try {
            const ID = req.params.id
            const user = await UserModel.findById(ID);

            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            const file = req.file;
            if (!file) {
                return res.status(400).json({ error: 'Image file is required' });
            }
            const localPath = file.path;

            const Uploadresults = await cloudinary.uploader.upload(localPath, { folder: 'AetherHouse/users/admin' });
            const updatedUser = await UserModel.findByIdAndUpdate(
                ID,
                {
                    avatar: {
                        url: Uploadresults.secure_url,
                        public_id: Uploadresults.public_id,
                        localPath: localPath
                    },
                },
                { new: true } // để trả về user mới đã update
                ).select("-password");

             return res.status(200).json({
                success: true,
                message: "Avatar updated successfully",
                user: updatedUser,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    updateImageUser: async (req , res) =>{
        try {
            const ID = req.params.id
            const user = await UserModel.findById(ID);

            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            const file = req.file;
            if (!file) {
                return res.status(400).json({ error: 'Image file is required' });
            }
            const localPath = file.path;

            const Uploadresults = await cloudinary.uploader.upload(localPath, { folder: 'AetherHouse/users/client' });
            const updatedUser = await UserModel.findByIdAndUpdate(
                ID,
                {
                    avatar: {
                        url: Uploadresults.secure_url,
                        public_id: Uploadresults.public_id,
                        localPath: localPath
                    },
                },
                { new: true } // để trả về user mới đã update
                ).select("-password");

             return res.status(200).json({
                success: true,
                message: "Avatar updated successfully",
                user: updatedUser,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },



    updateName: async (req,res) => {
        try {
            const{name} = req.body;
            if(!name || !name.trim()) {
                return res.status(404).json({error: "Name is bắt buộc "});
            }
            const updated = await UserModel.findByIdAndUpdate(
                req.params.id,
                {name: name.trim()},
                {name: true, runValidators: true}
            )
            .select("-password")
            .populate("role_id","name");

            if(!updated) return res.status(404).json({ error: "User not thấy"});

            return res.status(202).json({
                message: "Name updated successfully",
                user: updated,
            });
        }catch (err) {
            console.log(err);
            return res.status(500).json({ error: "Internal server error" });
        }
    },







    updatePassword: async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: "New password must be ít nhất 6 characters" });
    }

    const actor = req.user;               
    const targetId = req.params.id;       

    const target = await UserModel.findById(targetId); // có password sẵn trong schema
    if (!target) return res.status(404).json({ error: "User not found" });

    const isSelf  = actor && String(actor.id) === String(targetId); 
    const isAdmin = ["admin", "superadmin"].includes(actor?.role_name); 

    if (!isSelf && !isAdmin) {
      return res.status(403).json({ error: "Forbidden" });
    }

    // User tự đổi thì phải cung cấp & xác thực currentPassword
    if (isSelf) {
      if (!currentPassword) {
        return res.status(400).json({ error: "Current password is required" });
      }
      const ok = await bcrypt.compare(currentPassword, target.password);
      if (!ok) {
        return res.status(400).json({ error: "Current password is incorrect" });
      }
    }

    const hash = await bcrypt.hash(newPassword, 10);
    target.password = hash;
    await target.save();

    return res.status(200).json({ message: "Password updated thành công ròi quí dị" });
  } catch (err) {
    return res.status(500).json({ message: "Internal sever lỗi" });
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
