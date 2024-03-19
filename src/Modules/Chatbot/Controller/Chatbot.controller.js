import { spawn } from 'child_process';

export const sendMessage = (req, res, next) => {
    const { message } = req.body; // this mssg to be sent to chatbot
    let data1;

    const python = spawn('python', ['./script1.py', message]);

    python.stdout.on('data', (data) => {
        console.log('Data from Python script:', data.toString());
        data1 = data.toString();
    });

    python.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    python.on('close', (code) => {
        console.log(`Python script exited with code ${code}`);
        res.json({message: data1});
    });
};