const express = require('express');
const nodemailer = require('nodemailer');
const fs = require("fs")
const app = express();
require("dotenv").config()
const puerto = 80;
var QRCode = require('qrcode')

app.post("/", (req, res) => {
    if(req.body.email != null && req.body.eventKey != null){
        console.log("AQUI X1")
        QRCode.toFile(
            `${email}.png`,
            [{ data: `${process.env.URL_LAMBDA}?event=${+req.body.eventKey}`, mode: 'byte' }]
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
                    filename: 'qr.png',
                    path: __dirname + '/qr.png',
                    cid: 'foo'
                }
            ]
        };
        console.log("AQUI X3")
        transporter.sendMail(mail_option, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                console.log('El correo se envío correctamente ' + info.response);
         }
        })
        res.json({
            "status":"OK"
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

