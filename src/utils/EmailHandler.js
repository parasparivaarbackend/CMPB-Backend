import mailer from "nodemailer";
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
    let mailingdetail = {
      from: process.env.Auth_mail,
      to: item.email,
      subject: item.Sub,
      text: item.text,
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
