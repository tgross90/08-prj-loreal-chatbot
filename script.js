/* DOM elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

// Set initial message
chatWindow.textContent = "👋 Hello! How can I help you today?";

/* Handle form submit */
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Get user input
  const userMessage = userInput.value.trim();
  if (!userMessage) return;

  // Display user message in chat window
  chatWindow.innerHTML += `<div class="user-message">${userMessage}</div>`;
  userInput.value = ""; // Clear input field

  // Show loading message
  chatWindow.innerHTML += `<div class="bot-message">🤔 Thinking...</div>`;

  // Check if the question is related to L’Oréal products or beauty topics
  const isRelevant = /l'oréal|product|routine|beauty|skincare|makeup|haircare/i.test(userMessage);

  if (!isRelevant) {
    // Politely refuse unrelated questions
    chatWindow.innerHTML += `<div class="bot-message">I'm sorry, I can only answer questions related to L’Oréal products, routines, beauty, and related topics. 😊</div>`;
    chatWindow.scrollTop = chatWindow.scrollHeight;
    return;
  }

  try {
    // Send request to Cloudflare Worker
    const response = await fetch("https://loreal-worker.ttaylor-gross.workers.dev/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "user", content: userMessage }]
      })
    });

    // Parse response
    const data = await response.json();
    const botMessage = data.choices?.[0]?.message?.content || "Sorry, I couldn't understand that.";

    // Display bot response
    chatWindow.innerHTML += `<div class="bot-message">${botMessage}</div>`;
  } catch (error) {
    // Handle errors
    chatWindow.innerHTML += `<div class="bot-message">⚠️ An error occurred. Please try again later.</div>`;
  }

  // Scroll to the latest message
  chatWindow.scrollTop = chatWindow.scrollHeight;
});
