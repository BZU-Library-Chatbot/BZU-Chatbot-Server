import { spawn } from 'child_process';
import sessionModel from '../../../../DB/model/Session.model.js';
import userModel from '../../../../DB/model/User.model.js';
import interactionModel from '../../../../DB/model/Interaction.model.js';

export const sendMessage = async (req, res, next) => {
    const { message, sessionID, userID } = req.body; // this mssg to be sent to chatbot
    let response;
    if(userID){
        const user = await userModel.findById(userID);
        if(!user){
            return next(new Error("user not found", {cause:404}));
        }
        req.body.user = user;
    }
    if(sessionID){
       const session = await sessionModel.findById(sessionID);
        if(!session){
            return next(new Error("session not found", {cause:404}));  
        }
        const user = req.body.user;
        if(user){
        if(session.userID && !session.userID==userID){
            return next(new Error("this user can not acsses this session", {cause:400}));
        }else if(!session.userID){
            session.userID = userID;
        }
    }
        req.body.session = session;
    }else{
        if(userID){
            const session = await sessionModel.create({userID});
            req.body.session = session;
        }else{
            const session = await sessionModel.create();
            req.body.session = session;
        }
    }
    const python = spawn('python', ['./script1.py', message]);
    python.stdout.on('data', (botResponse) => {
        //console.log('Data from Python script:', botResponse.toString());
        response = botResponse.toString();
    });

    python.stderr.on('data', (err) => {
        //console.error(`stderr: ${err}`);
    });

    python.on('close', async (code) =>{
        //console.log(`Python script exited with code ${code}`);
        console.log("here",req.body.session);
        const interaction = await interactionModel.create({message, response, sessionID:req.body.session._id});
        res.json(interaction);
    });
};