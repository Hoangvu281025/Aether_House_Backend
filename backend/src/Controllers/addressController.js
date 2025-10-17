const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const UserModel = require('../Models/userModel');
const AddressModel = require('../Models/addressModel');
const RoleModel = require('../Models/roleModel');
// const cloudinary = require('../config/cloudinary');



const addressController = {
    addAddress: async(req,res) =>{
        try {
           const {name , address, city , phone , ward , country , user_id } = req.body;
            const newAddress = await AddressModel.create({
                name,
                address,
                city,
                phone,
                ward,
                country,
                user_id,
            })

            return res.status(200).json({
                Success: true,
                message: 'Address successfully' ,
                newAddress
            })


        } catch (error) {
            res.status(500).json({error: 'Internal server error'})
        }
    },

    updateAddress: async(req,res) => {
        try{
            const {name , address, city , phone , ward , country , user_id } = req.body;

        //    const checkphone = await AddressModel.findOne({phone});

        //    if(checkphone) return res.status(400).json({error: "phone already exists"})


            await AddressModel.findByIdAndUpdate(
                req.params.id,
                {name,
                address,
                city,
                phone,
                ward,
                country,
                user_id,}
            )

            return res.status(200).json({
                Success: true,
                message: 'update Address successfully'
            })


        } catch (error) {
            console.log(error)
            res.status(500).json({error: 'Internal server error'})
        }
    }
   
}







module.exports = {addressController}
