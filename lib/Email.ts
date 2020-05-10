import * as nodemailer from "nodemailer";

export class Email {

    public transporter: nodemailer.Transporter;

    constructor(username: string, password: string) {
        this.transporter = nodemailer.createTransport( {
            auth: {
                pass: password,
                user: username,
            },
            service: "gmail",
        });
    }

    public sendEmail(from: string, to: string, subject: string, body: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const mailOptions = {
                from,
                html: body,
                subject,
                to,
            };

            this.transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                resolve(info);
            });
        });
    }


}