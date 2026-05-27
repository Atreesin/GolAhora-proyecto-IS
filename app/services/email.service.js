import { EMAIL_USER, EMAIL_PASSWORD, EMAIL_HOST, EMAIL_PORT, EMAIL_SECURE, EMAIL_SENDGRID_KEY } from "../config.js";

//sendgrid
import sgMail from "@sendgrid/mail";

//SENDGRID
sgMail.setApiKey(EMAIL_SENDGRID_KEY);

export async function enviarBienvenidaEmail(destinatario, nombreUsuario) {
const mailOptions = {
    from: EMAIL_USER,
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
    const info = await sgMail.send(mailOptions);
    console.log("Correo de bienvenida enviado:", info);
  } catch (error) {
    console.error("Error al enviar correo:", error);
  }
}


