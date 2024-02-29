
import mongoose, {Schema,Types,model} from 'mongoose';
const userSchema = new Schema ({
    userName:{
        type:String,
        required:[true, 'userName is required'],
        min:[2],
        max:[20]
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    confirmEmail:{
        type:Boolean,
        default:false,
    },
    // image:{
    //     type:Object,
    // },
    phone:{
        type:String,
    },
    role:{
        type:String,
        enum:['User', 'Admin'],
        default:'User',
    },
    status:{
        type:String,
        default:'Active',
        enum:['Active', 'Not Active'],
    },
    gender:{
        type:String,
        enum:['Male', 'Female'],

    },
    profilePic:{type:Object},
    coverPic:[{type:Object}],
    forgetCode:{
        type:String,
        default:null,
    },
    changePasswordTime:{
        type:Date,
        
    },
    wishList:[{type:Types.ObjectId, ref:'Product', required:true}]
    ,
},

{
    timestamps:true
})
const userModel = mongoose.models.User ||  model('User', userSchema);
export default userModel;


