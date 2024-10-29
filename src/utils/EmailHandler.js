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
      template,
    };

    console.log("mailingdetail", mailingdetail);

    mailTransporter.sendMail(mailingdetail, function (err, data) {
      if (err) {
        console.log("mail ka error ", err.message);
      }
    });
  } catch (error) {
    console.log(error);
  }
}
