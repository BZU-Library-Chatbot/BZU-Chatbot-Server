import connectDB from '../../DB/connection.js';
import { globalErrorHandel } from '../Services/errorHandling.js';
import AuthRouter from './Auth/Auth.router.js';
import UserRouter from './User/User.router.js';
import path from 'path'; 
import {fileURLToPath} from 'url';
import cors from 'cors';
 const __dirname = path.dirname(fileURLToPath(import.meta.url));
 const fullPath=path.join(__dirname,'../upload');

const initApp=(app,express)=>{
    app.use(cors());
    connectDB();
    app.use(express.json());
    app.use('/upload',express.static(fullPath));
    app.use("/auth", AuthRouter);
    app.use('/user', UserRouter);
    app.use('/*', (req,res)=>{
        return res.status(404).json({message:"page not found"});
    })

    //global error handler
    app.use(globalErrorHandel)

}

export default initApp;