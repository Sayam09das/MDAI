import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async ({ to, subject, html }) => {
  try {
    // Plain-text fallback (important for deliverability)
    const plainText = html.replace(/<[^>]+>/g, "");

    await sgMail.send({
      to,
      from: {
        name: "Schedulo",
        email: process.env.SENDGRID_FROM_EMAIL || "sayamprogrammingworld@gmail.com",
      },
      subject,
      html,
      text: plainText,
    });

    console.log(`✅ Email sent to ${to}`);
  } catch (error) {
    console.error(
      "❌ SendGrid Error:",
      error.response?.body || error.message
    );
    // IMPORTANT: do NOT throw — avoid breaking register flow
  }
};

export default sendEmail;
