const jwt = require('jsonwebtoken')
const RoleModel = require('../Models/roleModel');



const middlewares = {
    verifyToken: (req, res,  next) => {
        const token = req.headers.token;
        if(token){
            // bearar 1234 sẽ lấy được 1234
            const accessToken = token.split(" ")[1];
            jwt.verify(accessToken , process.env.JWT_ACCESS_KEY, (err, user)=>{
                if(err){
                    res.status(403).json('Token is not valid')
                }
                res.user = user;
                // return next();
            })
        }else{
            res.status(401).json("you're not login")
        }
    },

    verifyTokenDelete: (req,res,next) => {
        middlewares.verifyToken(req,res, async () =>{
            try {
                const roleName = req.user.role_name;
                console.log(roleName);
            //     if(!roleID) return res.status(403).json({error: 'no role in token'});

            //     const role = await RoleModel.findById(roleID).select('name')
            //     console.log(role);
            } catch (error) {
                return res.status(500).json({error: 'Auth check failed'})
            }
        }) 
    }
}


module.exports = middlewares;