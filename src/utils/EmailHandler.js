import mailer from "nodemailer";
import fs from "fs";
import path from "path";
import ejs from "ejs";
import { fileURLToPath } from "url";
export async function SendMailTemplate(item, template) {
  try {
    let mailTransporter = mailer.createTransport({
      service: "gmail",
      secure: true,
      auth: {
        user: process.env.Auth_mail,
        pass: process.env.Auth_pass,
      },
    });
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const templatePath = path.join(__dirname, "templates", template.url);
    console.log("templatePath is ", templatePath);

    const templatefile = fs.readFileSync(templatePath, "utf-8");

    const html = ejs.render(templatefile, template);

    let mailingdetail = {
      from: process.env.Auth_mail,
      to: item.email,
      subject: item.Sub,
      html,
    };

    mailTransporter.sendMail(mailingdetail, function (err, data) {
      if (err) {
        console.log(err.message);
      }
    });
  } catch (error) {
    console.log(error);
  }
}
