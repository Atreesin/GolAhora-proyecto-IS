import nodemailer from "nodemailer";
import { EMAIL_USER, EMAIL_PASSWORD } from "../config.js";
import e from "connect-flash";

const transporter = nodemailer.createTransport({
  service: "gmail", // Podés usar "Outlook", "Yahoo", o SMTP de tu dominio
  auth: {
    user: EMAIL_USER, // tu correo
    pass: EMAIL_PASSWORD  // App Password
  }
});

export async function enviarBienvenidaEmail(destinatario, nombreUsuario) {
  const mailOptions = {
    from: `"Gol Ahora" <${process.env.EMAIL_USER}>`,
    to: destinatario,
    subject: "¡Bienvenido a Gol Ahora!",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; padding: 5px;">
        <div style="text-align: center;">
          <img src="https://golahora-proyecto-is.onrender.com/images/Logo.png" alt="Gol Ahora" style="width: 250px; margin-bottom: 0px;" />
        </div>
        <h2 style="color: #0066cc;">¡Hola ${nombreUsuario}!</h2>
        <p>Gracias por registrarte en <strong>Gol Ahora</strong>.</p>
        <p>Ya podés comenzar a <strong>reservar tus partidos</strong> y disfrutar de nuestra plataforma.</p>
        <p style="margin-top: 20px;">Estamos felices de tenerte con nosotros.</p>
        <hr style="margin: 30px 0;" />
        <p style="font-size: 12px; color: #777;">
          Este es un correo automático, por favor no respondas a este mensaje.
        </p>
      </div>
    `,
    text: `Hola ${nombreUsuario}, bienvenido a Gol Ahora. Ya podés comenzar a reservar tus partidos.`
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Correo de bienvenida enviado:", info.response);
  } catch (error) {
    console.error("Error al enviar correo:", error);
  }
}

//await enviarBienvenidaEmail("atree.90@gmail.com", "Fernando");
/*
export async function enviarBienvenidaEmail(destinatario, nombreUsuario) {
  const recipients = [new Recipient(destinatario, nombreUsuario)];

  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setReplyTo(sentFrom)
    .setSubject("¡Bienvenido a Gol Ahora!")
    .setHtml(`
      <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
        <div style="text-align: center;">
          <img src="http://localhost/images/logo.png" alt="Gol Ahora" style="width: 150px; margin-bottom: 20px;" />
        </div>
        <h2 style="color: #0066cc;">¡Hola ${nombreUsuario}!</h2>
        <p>Gracias por registrarte en <strong>Gol Ahora</strong>.</p>
        <p>Ya podés comenzar a <strong>reservar tus partidos</strong> y disfrutar de nuestra plataforma.</p>
        <p style="margin-top: 20px;">Estamos felices de tenerte con nosotros.</p>
        <hr style="margin: 30px 0;" />
        <p style="font-size: 12px; color: #777;">
          Este es un correo automático, por favor no respondas a este mensaje.
        </p>
      </div>
    `)
    .setText(`Hola ${nombreUsuario}, bienvenido a Gol Ahora. Ya podés comenzar a reservar tus partidos.`);

  try {
    await mailerSend.email.send(emailParams);
    console.log("Correo de bienvenida enviado a:", destinatario);
  } catch (error) {
    console.error("Error al enviar correo de bienvenida:", error);
  }
}*/

