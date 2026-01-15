
import { getThankYouTemplate } from "./templates/thank-you";
import { getAdminNotificationTemplate } from "./templates/admin-notification";
import fs from "fs";
import path from "path";

async function generateExamples() {
  const exampleDir = path.join(process.cwd(), "services/mail/examples");
  if (!fs.existsSync(exampleDir)) {
    fs.mkdirSync(exampleDir, { recursive: true });
  }

  console.log("Generating premium email examples...");

  const thankYouHtml = getThankYouTemplate("Nguyễn Văn A", "customer@example.com");
  fs.writeFileSync(path.join(exampleDir, "thank_you_email.html"), thankYouHtml);
  console.log(`Saved: services/mail/examples/thank_you_email.html`);

  const adminHtml = getAdminNotificationTemplate({
    name: "Nguyễn Văn A",
    email: "customer@example.com",
    phone: "0901234567",
    address: "123 Đường ABC, Quận 1, TP. HCM",
    message: "Tôi cần tư vấn về van công nghiệp cho hệ thống cấp nước."
  });
  fs.writeFileSync(path.join(exampleDir, "admin_notification_email.html"), adminHtml);
  console.log(`Saved: services/mail/examples/admin_notification_email.html`);

  console.log("Examples generated successfully.");
}

generateExamples().catch(console.error);
