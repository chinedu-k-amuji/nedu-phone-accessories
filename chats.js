// Example Twilio integration (pseudo-code)
function sendSMSNotification(orderId) {
  fetch("https://api.twilio.com/send", {
    method: "POST",
    body: JSON.stringify({ orderId })
  });
}