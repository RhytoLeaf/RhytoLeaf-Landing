/**
 * RhytoLeaf — "Craft Your Idea" Form Handler
 *
 * Firebase Cloud Function that:
 *   1. Validates the incoming payload (name, email, idea)
 *   2. Stores the submission in Firestore
 *   3. Sends a notification email to rhytoleaf.ops@gmail.com
 *   4. Sends a do-not-reply confirmation email to the submitter
 *
 * SETUP:
 *   Create functions/.env with:
 *     GMAIL_EMAIL=rhytoleaf.ops@gmail.com
 *     GMAIL_PASSWORD=YOUR_APP_PASSWORD
 *
 *   (Use a Gmail App Password — not your main password.
 *    Generate one at https://myaccount.google.com/apppasswords)
 */

const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const cors = require("cors");

admin.initializeApp();
const db = admin.firestore();

// Sanitize user input for safe HTML embedding in emails
function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// CORS middleware — allow requests from rhytoleaf.ca and localhost for dev
const corsMiddleware = cors({
  origin: [
    "https://rhytoleaf.ca",
    "https://www.rhytoleaf.ca",
    "https://rhytoleaf.github.io",
    "http://localhost:5500",
    "http://127.0.0.1:5500",
  ],
});

exports.submitIdea = onRequest({ region: "us-central1" }, (req, res) => {
  corsMiddleware(req, res, async () => {
    // Only allow POST
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { name, email, idea } = req.body;

    // ── Validation ──────────────────────────────────────
    if (!name || !email || !idea) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email address." });
    }

    if (idea.length > 5000) {
      return res.status(400).json({ error: "Idea must be under 5000 characters." });
    }

    try {
      // ── Store in Firestore ──────────────────────────────
      const docRef = await db.collection("idea-submissions").add({
        name,
        email,
        idea,
        submittedAt: admin.firestore.FieldValue.serverTimestamp(),
        status: "new",
      });

      // ── Send notification email ─────────────────────────
      const gmailEmail = process.env.GMAIL_EMAIL || "rhytoleaf.ops@gmail.com";
      const gmailPassword = process.env.GMAIL_PASSWORD;

      if (gmailPassword) {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: gmailEmail,
            pass: gmailPassword,
          },
        });

        const safeName = escapeHtml(name);
        const safeEmail = escapeHtml(email);
        const safeIdea = escapeHtml(idea);

        // ── Notification to RhytoLeaf team ──────────────────
        await transporter.sendMail({
          from: `"RhytoLeaf Form" <${gmailEmail}>`,
          to: "rhytoleaf.ops@gmail.com",
          replyTo: email,
          subject: `New STEM App Idea from ${safeName}`,
          html: `
            <div style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto;">
              <h2 style="color: #00CE7C; margin-bottom: 4px;">New Idea Submission</h2>
              <p style="color: #666; font-size: 14px;">Submitted via rhytoleaf.ca contact form</p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 16px 0;">
              <p><strong>Name:</strong> ${safeName}</p>
              <p><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
              <p><strong>Idea:</strong></p>
              <div style="background: #f4f7f5; padding: 16px; border-radius: 8px; white-space: pre-wrap;">${safeIdea}</div>
              <hr style="border: none; border-top: 1px solid #eee; margin: 16px 0;">
              <p style="color: #999; font-size: 12px;">Firestore doc ID: ${docRef.id}</p>
            </div>
          `,
        });

        // ── Confirmation email to the submitter (best-effort) ──
        try {
          const ideaPreview = safeIdea.length > 200 ? safeIdea.substring(0, 200) + "..." : safeIdea;
          await transporter.sendMail({
            from: `"RhytoLeaf (No Reply)" <${gmailEmail}>`,
            to: email,
            subject: "We received your idea \u2014 RhytoLeaf",
            html: `
              <div style="font-family: 'Segoe UI', system-ui, sans-serif; max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden;">
                <div style="background: #00CE7C; padding: 32px 24px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">Thank You, ${safeName}!</h1>
                </div>
                <div style="padding: 32px 24px;">
                  <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 16px;">
                    We have received your STEM app idea and are excited to review it. Our team will get back to you if we have questions or updates.
                  </p>
                  <div style="background: #f4f7f5; padding: 16px; border-radius: 8px; border-left: 4px solid #00CE7C; margin: 16px 0;">
                    <p style="color: #666; font-size: 14px; margin: 0 0 4px; font-weight: 600;">Your submission:</p>
                    <p style="color: #333; font-size: 14px; margin: 0; white-space: pre-wrap;">${ideaPreview}</p>
                  </div>
                  <p style="color: #999; font-size: 13px; line-height: 1.5; margin: 24px 0 0;">
                    This is an automated message from RhytoLeaf. Please do not reply to this email.
                    If you need to reach us, contact
                    <a href="mailto:rhytoleaf.ops@gmail.com" style="color: #00CE7C;">rhytoleaf.ops@gmail.com</a>.
                  </p>
                </div>
                <div style="background: #f4f7f5; padding: 16px 24px; text-align: center; border-top: 1px solid #e0e0e0;">
                  <p style="color: #999; font-size: 12px; margin: 0;">&copy; 2026 RhytoLeaf Inc. &mdash; Cultivating Innovators, One App at a Time</p>
                </div>
              </div>
            `,
          });
        } catch (confirmErr) {
          console.warn("Failed to send confirmation email:", confirmErr.message);
        }
      }

      return res.status(200).json({
        success: true,
        message: "Idea received! We'll be in touch.",
        id: docRef.id,
      });
    } catch (err) {
      console.error("submitIdea error:", err);
      return res.status(500).json({ error: "Internal server error. Please try again." });
    }
  });
});
