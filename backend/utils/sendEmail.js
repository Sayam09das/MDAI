import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async ({ to, subject, html }) => {
  await sgMail.send({
    to,
    from: {
      email: "no-reply@mdai-self.vercel.app", // MUST be verified in SendGrid
      name: "Auth App",
    },
    subject,
    html,
  });
};

export default sendEmail;
