/**
 * RhytoLeaf — "Craft Your Idea" Form Handler
 *
 * Firebase Cloud Function that:
 *   1. Validates the incoming payload (name, email, idea)
 *   2. Stores the submission in Firestore
 *   3. Sends a notification email to rhytoleaf.ops@gmail.com
 *
 * SETUP:
 *   firebase functions:config:set
 *     gmail.email="rhytoleaf.ops@gmail.com"
 *     gmail.password="YOUR_APP_PASSWORD"
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

        await transporter.sendMail({
          from: `"RhytoLeaf Form" <${gmailEmail}>`,
          to: "rhytoleaf.ops@gmail.com",
          replyTo: email,
          subject: `New STEM App Idea from ${name}`,
          html: `
            <div style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto;">
              <h2 style="color: #00CE7C; margin-bottom: 4px;">New Idea Submission</h2>
              <p style="color: #666; font-size: 14px;">Submitted via rhytoleaf.ca contact form</p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 16px 0;">
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
              <p><strong>Idea:</strong></p>
              <div style="background: #f4f7f5; padding: 16px; border-radius: 8px; white-space: pre-wrap;">${idea}</div>
              <hr style="border: none; border-top: 1px solid #eee; margin: 16px 0;">
              <p style="color: #999; font-size: 12px;">Firestore doc ID: ${docRef.id}</p>
            </div>
          `,
        });
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
