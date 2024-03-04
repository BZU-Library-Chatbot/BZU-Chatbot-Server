import { spawn } from 'child_process';

export const sendMessage = (req,res,next)=>{
    let data1;
    const python = spawn('python', ['./script1.py']);
    python.stdout.on('data', (data)=>{
        console.log('here data',data.toString());
        data1 = data.toString();
    });
    python.on('close', (code)=>{
        console.log('code',code);
        console.log(data1);
        return res.send(data1);
    });
   

}