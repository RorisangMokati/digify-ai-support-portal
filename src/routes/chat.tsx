import { useState } from "react";

export default function Chat() {
  const [message, setMessage] = useState("");

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">AI Support Chat</h1>

      <div className="border rounded-lg p-4 h-96 mb-4">
        Chat messages will appear here.
      </div>

      <div className="flex gap-2">
        <input
          className="border rounded p-2 flex-1"
          placeholder="Ask something..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button className="bg-blue-600 text-white px-4 rounded">
          Send
        </button>
      </div>
    </div>
  );
}
