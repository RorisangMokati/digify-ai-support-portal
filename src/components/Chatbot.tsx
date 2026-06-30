import { useState } from "react";

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState<
    { sender: "user" | "bot"; text: string }[]
  >([]);

 function getBotReply(input: string) {
  const msg = input.toLowerCase();

  // Greeting
  if (msg.includes("hi") || msg.includes("hello") || msg.includes("hey")) {
    return "Hello! Welcome to AI Support Operations. How can I assist you today?";
  }

  // Submit Request
  if (
    msg.includes("submit request") ||
    msg.includes("create request") ||
    msg.includes("ticket") ||
    msg.includes("new request")
  ) {
    return "To submit a request, click the 'Submit Request' option in the left menu, complete the form, attach any evidence if required, and click Submit.";
  }

  // Dashboard
  if (msg.includes("dashboard")) {
    return "The Dashboard provides an overview of your requests, resolved cases, high-priority tickets, and blockers.";
  }

  // Reports
  if (msg.includes("report")) {
    return "The Reports page allows you to view statistics and summaries of submitted support requests.";
  }

  // Settings
  if (msg.includes("setting") || msg.includes("profile")) {
    return "The Settings page lets you update your account preferences and application settings.";
  }

  // High Priority
  if (msg.includes("high priority") || msg.includes("urgent")) {
    return "High Priority requests require immediate attention and should only be used for critical issues affecting business operations.";
  }

  // Evidence
  if (
    msg.includes("evidence") ||
    msg.includes("attachment") ||
    msg.includes("upload")
  ) {
    return "You can attach screenshots, documents, or other supporting files when submitting a request to help the support team resolve your issue faster.";
  }

  // Status
  if (msg.includes("status") || msg.includes("track")) {
    return "You can track the progress of your submitted requests from the Dashboard or Reports page.";
  }

  // Contact
  if (
    msg.includes("support") ||
    msg.includes("contact") ||
    msg.includes("help")
  ) {
    return "If you need additional assistance, please contact the IT Support Team or submit a support request through this system.";
  }

  // Thanks
  if (msg.includes("thank")) {
    return "You're welcome! If you have any other questions, I'm here to help.";
  }

  return "I'm sorry, I don't understand that question. Try asking about submitting requests, reports, settings, request status, evidence, or the dashboard.";
}

  function sendMessage() {
    if (!message.trim()) return;

    const userMessage = {
      sender: "user" as const,
      text: message,
    };

    const botMessage = {
      sender: "bot" as const,
      text: getBotReply(message),
    };

    setMessages((prev) => [...prev, userMessage, botMessage]);
    setMessage("");
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: "#2563eb",
          color: "white",
          border: "none",
          fontSize: 24,
          cursor: "pointer",
        }}
      >
        💬
      </button>

      {open && (
        <div
          style={{
            position: "fixed",
            bottom: 90,
            right: 20,
            width: 320,
            height: 450,
            background: "white",
            borderRadius: 10,
            boxShadow: "0 0 15px rgba(0,0,0,.2)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              background: "#2563eb",
              color: "white",
              padding: 10,
              fontWeight: "bold",
            }}
          >
            AI Support Assistant
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              padding: 10,
              overflowY: "auto",
            }}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  textAlign: msg.sender === "user" ? "right" : "left",
                  marginBottom: 10,
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    padding: "8px 12px",
                    borderRadius: 10,
                    background:
                      msg.sender === "user" ? "#2563eb" : "#e5e7eb",
                    color: msg.sender === "user" ? "white" : "black",
                  }}
                >
                  {msg.text}
                </span>
              </div>
            ))}
          </div>

          {/* Input */}
          <div
            style={{
              display: "flex",
              padding: 10,
              gap: 5,
            }}
          >
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
              placeholder="Type your message..."
              style={{
                flex: 1,
                padding: 8,
              }}
            />

            <button onClick={sendMessage}>
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}