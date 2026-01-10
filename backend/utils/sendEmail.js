import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ to, subject, html }) => {
  try {
    await resend.emails.send({
      from: "OTP <onboarding@resend.dev>", // works instantly
      to, // normal Gmail, Outlook, etc.
      subject,
      html,
    });

    console.log("✅ OTP email sent via Resend");
  } catch (error) {
    console.error("❌ Resend error:", error);
  }
};

export default sendEmail;
