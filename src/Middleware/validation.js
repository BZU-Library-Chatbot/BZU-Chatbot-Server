
import joi from 'joi'
import { Types } from 'mongoose';
import userModel from '../../DB/model/User.model.js';
import { roles } from './auth.middleware.js';
import { verifyToken } from '../Services/generateAndVerifyToken.js';

// const dataMethods = ['body','query','params','headers','file'];

export const validationObjectId =(value,helper)=>{

    if(Types.ObjectId.isValid(value)){
        return true 
    }else {

        return helper.message("id is invalid");
    }
}


const validationRefreshToken = async (value)=>{
    try{
    const decoded = verifyToken(value.split(process.env.BEARERKEY)[1], process.env.REFRESH_TOKEN);
    const user = await userModel.findById(decoded?.id);//.select("userName role changePasswordTime");
        if(!user){
            return next(new Error("not register account", {cause:400}));
        }
        if(!Object.values(roles).includes(user.role)){
            return next(new Error("not authorized", {cause:403}));
        }

        if(parseInt(user.changePasswordTime) > decoded.iat){
            return next(new Error("expired token", {cause:400}));
        }
        
        return true;
    }
        catch(err) {
            return false;
        }
}

export const generalFields = {

    email:joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'edu'] } }),
    password:joi.string().min(8).required(),
    file:joi.object({
        fieldname:joi.string().required(),
        originalname:joi.string().required(),
        encoding:joi.string().required(),
        mimetype:joi.string().required(),
        destination:joi.string().required(),
        filename:joi.string().required(),
        path:joi.string().required(),
        size:joi.number().positive().required(),
        dest:joi.string(),
    }),
    id:joi.string().custom(validationObjectId),
    refreshToken:joi.string().custom(validationRefreshToken),
}

const validation = (schema)=>{
    return (req,res,next)=>{
        const inputsData = req.file?{...req.body, ...req.params, ...req.query, file:req.file}:req.files?{...req.body, ...req.params, ...req.query, files:{...req.files}}:{...req.body, ...req.params, ...req.query};
        const validationResult = schema.validate(inputsData,{abortEarly:false})
        if(validationResult.error?.details){
            return res.json({message:"validation error",error:validationResult.error.details});
        }
        return next();
}
}

export default validation;