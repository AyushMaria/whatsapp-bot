# WhatsApp Booking Bot

This is a simple Node.js bot that listens for the word "Book" and replies with a Calendly booking link using the WhatsApp Cloud API.

## Setup

1. Clone this repo
2. Run `npm install`
3. Create a `.env` file with:
   ```
   ACCESS_TOKEN=your_meta_token
   PHONE_NUMBER_ID=your_phone_number_id
   PORT=3000
   ```
4. Run the server:
   ```
   node server.js
   ```

5. Use `ngrok` or deploy to Render to expose the `/webhook` endpoint and register it with Meta.

## Test

Send "Book" to your test WhatsApp number and you'll receive your booking link.