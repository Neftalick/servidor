const express = require('express');
const nodemailer = require('nodemailer');
const fs = require("fs")
const app = express();
const request = require("request");
const bodyParser = require("body-parser")
app.use(bodyParser.json());
app.set('trust proxy', true);
require("dotenv").config()
const puerto = 80;
var QRCode = require('qrcode')

app.post("/", (req, res) => {
    if(req.body.email != null && req.body.eventKey != null){
        console.log("AQUI X1")
        QRCode.toFile(
            `${req.body.email}.png`,
            [{ data: `data uwu`, mode: 'byte' }]
          )
        
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user:"ronnypastorkolmakov@gmail.com",
                pass:"cordmknpybltemfw"
            }
        });
        console.log("AQUI X2")
        const mail_option = {
            from: 'proyectoiotpucp2022@gmail.com',
            to: req.body.email,
            subject: `Creación del evento con codigo ${req.body.eventKey}`,
            html: `
                    <table border="0" cellpadding="0" cellspacing="0" width="600px" background-color="#2d3436" bgcolor="#2d3436">
                    <tr height="200px">
                        <td bgcolor="" width="600px">
                            <h1 style="color: #fff; text-align:center">Felicidades!</h1>
                            <p  style="color: #fff; text-align:center">
                                <span style="color: #e84393">Evento creado exitosamente!</span>
                            </p>
                        </td>
                    </tr>
                    <tr bgcolor="#fff">
                        <td style="text-align:center">
                            <p style="color: #000">¡QR del evento creado!</p>
                            <img src="cid:foo" style="display: block;
                            margin-left: auto;
                            margin-right: auto;
                            width: 50%;">
                            <p style="color: #000">¡Un mundo de servicios a su disposición!</p>
                        </td>
                    </tr>
                    </table>
                `,
            attachments: [
                {
                    filename: `${req.body.email}.png`,
                    path: __dirname + `/${req.body.email}.png`,
                    cid: 'foo'
                }
            ]
        };
        console.log("AQUI X3")
        transporter.sendMail(mail_option, (error, info) => {
            if (error) {
                res.status(400).json({
                    "status":"Fail",
                    "error":"No se envio el correo al responsable"        
                })
                console.log(error);
            } else {
                console.log('El correo se envío correctamente ' + info.response);
         }
        })
        const myHeaders = {
            url:"https://fcm.googleapis.com/fcm/send",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"key=AAAAHd9dsQg:APA91bFbo4wacp3h6z7lfvswhwjbzd4MpZ4wujCLHuDv37zC2nxMmhFRMldhfIIXNQLCoJMkKG7_-N2f4eONyxbK0jI9ygqpc6_U2PzPKCvC8HiEMbFUdg8IJlaxQPbTTExv2oe_wAqm"
            },
            body:JSON.stringify(
                {
                    "to":"/topics/EPUCP",
                    "notification":{
                        "title":"EPUCP",
                        "body":"Nuevo evento"
                    }
                })
            
        }
        request.post(myHeaders,(err,res,body)=>{
            console.log(body)
        })
        res.json({
            "status":"OK",
            "error":"envie todos los parametros necesarios"
        })
    }else{
        res.status(400).json({
            "status":"FAIL"
        })
    }
})

app.listen(puerto,()=>{
    console.log(`servidor levantado en el puerto ${puerto}`)
})

