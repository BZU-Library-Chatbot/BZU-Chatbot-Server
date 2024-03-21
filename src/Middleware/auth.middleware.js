import userModel from "../../DB/model/User.model.js";
import { asyncHandler } from "../Services/errorHandling.js";
import { verifyToken } from "../Services/generateAndVerifyToken.js";

export const roles = {
    Admin:'Admin',
    User:'User',
    HR:'Super Admin',
}

export const auth =(accessRoles=Object.values(roles))=>{
     return asyncHandler( async (req,res,next)=>{

        const {authorization} = req.headers;

        if(!authorization?.startsWith(process.env.BEARERKEY)){
            return next(new Error("invalid bearer key", {cause:400}));
        }
        const token = authorization.split(process.env.BEARERKEY)[1];
        if(!token){
            return next(new Error("invalid token", {cause:400}));
        }
        const decoded = verifyToken(token, process.env.LOGIN_TOKEN);
        const user = await userModel.findById(decoded.id);//.select("userName role changePasswordTime");
        if(!user){
            return next(new Error("not register account", {cause:400}));
        }
        if(!accessRoles.includes(user.role)){
            return next(new Error("not authorized", {cause:403}));
        }

        if(parseInt(user.changePasswordTime) > decoded.iat){
            return next(new Error("expired token", {cause:400}));
        }
        req.user=user;
        return next();  
})
}

