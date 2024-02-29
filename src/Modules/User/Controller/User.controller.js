import userModel from "../../../../DB/model/User.model.js";
import cloudinary from "../../../Services/cloudinary.js";
import { asyncHandler } from "../../../Services/errorHandling.js";
import { compare, hash } from "../../../Services/hashAndCompare.js";

export const profilePic =async (req,res,next)=>{   
    if(!req.file){
        return next(new Error("please provide a file", {cause:400}));
    }
    // return res.json(req.file.path);
    const {secure_url,public_id} = await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.APP_NAME}/user/${req.user.userName}/profile`});
    const user = await userModel.findByIdAndUpdate(req.user._id,{profilePic:{secure_url,public_id}}
    ,{new:false})
    if(user.profilePic){
        await cloudinary.uploader.destroy(user.profilePic.public_id);
    }
    return res.json({message:"success"});

}

export const coverPic =async (req,res,next)=>{

    if(!req.files){
        return next(new Error("please provide a file", {cause:400}));
    }

    const coverPic=[];
    for(const file of req.files){
        const { secure_url, public_id } = await cloudinary.uploader.upload(
            file.path,
            { folder: `${process.env.APP_NAME}/user/${req.user.userName}/cover` }
          );
         coverPic.push({secure_url, public_id});
    }
    const user = await userModel.findByIdAndUpdate(req.user._id,{coverPic}
    ,{new:true})
    return res.json({message:"success",user});
}


export const updatePassword=async  (req,res,next)=>{

    const {oldPassword,newPassword} = req.body;

    const user = await userModel.findById(req.user._id);
    const match = compare(oldPassword,user.password)
    if(!match){
        return next(new Error("invalid password "));
    }
    const hashPassword = hash(newPassword);
    await userModel.findByIdAndUpdate(req.user._id,{password:hashPassword});
    return res.json({message:"success"})

}

export const shareProfile = async(req,res,next)=>{

    const user = await userModel.findById(req.params.id).select('userName email ');

    if(!user){
        return next(new Error("invalid profile id"));
    }else{

        return res.json({message:'success',user});
    }

}

export const makeAdmin = async (req, res, next) => {
    const {id} = req.params;
    const user = await userModel.findByIdAndUpdate({id}, {role: 'Admin'}, {new: true});
    if(!user)
        return next(new Error('no user found',{cause:404}));
    return res.status(200).json({message:'success', user});
}