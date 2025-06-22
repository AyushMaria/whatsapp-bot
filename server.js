require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

const token = process.env.ACCESS_TOKEN;
const phoneNumberId = process.env.PHONE_NUMBER_ID;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

// ✅ Webhook Verification (GET /webhook)
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const tokenFromMeta = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && tokenFromMeta === VERIFY_TOKEN) {
    console.log("✅ WEBHOOK_VERIFIED");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// ✅ WhatsApp Message Handler (POST /webhook)
app.post("/webhook", async (req, res) => {
  try {
    console.log("📩 Incoming POST body:", JSON.stringify(req.body, null, 2));

    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const message = changes?.value?.messages?.[0];

    if (!message) {
      console.log("❗ No message found in the payload.");
      return res.sendStatus(200);
    }

    const from = message?.from;
    const text = message?.text?.body?.toLowerCase();

    console.log(`📬 Message from ${from}: ${text}`);

    if (text === "book") {
      const response = await axios.post(
        `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`,
        {
          messaging_product: "whatsapp",
          to: from,
          text: {
            body:
              "Please use the link below to view available slots and confirm your booking:\n👉 https://calendly.com/yourcourt/book",
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Message sent successfully:", response.data);
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("❌ Error in /webhook POST:");
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    } else {
      console.error(error.message);
    }
    res.sendStatus(500);
  }
});

// ✅ Root Route (optional for Render health check)
app.get("/", (req, res) => {
  res.send("WhatsApp bot is running");
});

// ✅ Start Server
app.listen(process.env.PORT || 3000, () =>
  console.log("🚀 Server is up and running on port", process.env.PORT || 3000)
);
