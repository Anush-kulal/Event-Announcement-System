// Replace this placeholder with your own API Gateway base URL.
// Example: https://YOUR_API_ID.execute-api.ap-south-1.amazonaws.com
const API_BASE_URL = "YOUR_API_GATEWAY_URL";

const subscribeForm = document.getElementById("subscribeForm");
const subscribeMessage = document.getElementById("subscribeMessage");

subscribeForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = document.getElementById("email").value.trim();
  if (!email) { subscribeMessage.textContent = "Please enter your email address."; return; }
  subscribeMessage.textContent = "Sending subscription request...";
  try {
    const response = await fetch(`${API_BASE_URL}/subscribe`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({email})
    });
    const data = await response.json();
    if (response.ok) {
      subscribeMessage.textContent = "✅ Subscription request sent! Check your email to confirm.";
      subscribeForm.reset();
    } else {
      subscribeMessage.textContent = "❌ " + (data.message || "Subscription failed.");
    }
  } catch (error) {
    console.error(error);
    subscribeMessage.textContent = "❌ Unable to connect to the server.";
  }
});

const eventForm = document.getElementById("eventForm");
const eventMessage = document.getElementById("eventMessage");

eventForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const title = document.getElementById("title").value.trim();
  const date = document.getElementById("date").value.trim();
  const location = document.getElementById("location").value.trim();
  const description = document.getElementById("description").value.trim();
  if (!title || !date || !location) { eventMessage.textContent = "Please fill in all required fields."; return; }
  eventMessage.textContent = "Publishing event...";
  try {
    const response = await fetch(`${API_BASE_URL}/create-event`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({title, date, location, description})
    });
    const data = await response.json();
    if (response.ok) {
      eventMessage.textContent = "✅ Event published successfully! Subscribers have been notified.";
      eventForm.reset();
    } else {
      eventMessage.textContent = "❌ " + (data.message || "Failed to publish event.");
    }
  } catch (error) {
    console.error(error);
    eventMessage.textContent = "❌ Unable to connect to the server.";
  }
});