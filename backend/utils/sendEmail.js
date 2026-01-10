import { Resend } from "resend";

const sendEmail = async ({ to, subject, html }) => {
  const resend = new Resend(process.env.RESEND_API_KEY); // ✅ moved here

  return resend.emails.send({
    from: "Sayam Admin <onboarding@resend.dev>",
    to,
    subject,
    html,
  });
};

export default sendEmail;
