import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_APP_BACKEND_URL;

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi! 👋 I'm GM, and I’ll be your guide to Aura Interiors today.",
      time: "5:55 PM",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  // 1️⃣ Set up react-hook-form
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm({
    defaultValues: { message: "" },
  });

  // 2️⃣ Send the user's query to the backend RAG endpoint
  const sendToBackend = async (query) => {
    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    // append the user's message immediately
    setMessages((msgs) => [...msgs, { sender: "user", text: query, time }]);
    setIsLoading(true);

    try {
      const res = await axios.post(
        `${BASE_URL}/api/chatbot/chat/`,
        { query },
        { headers: { "Content-Type": "application/json" } }
    );
    console.log(res);

      setMessages((msgs) => [
        ...msgs,
        {
          sender: "bot",
          text: res.data.response,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((msgs) => [
        ...msgs,
        {
          sender: "bot",
          text: "❌ Oops! Something went wrong. Please try again.",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // 3️⃣ Called by react-hook-form when the user submits
  const onSubmit = async ({ message }) => {
    await sendToBackend(message);
    reset();
  };

  return (
    <div className="w-full max-w-md mx-auto mt-10 shadow-xl rounded-xl border p-4 bg-white font-sans flex flex-col h-[500px]">
      <div className="text-sm text-gray-500 mb-2">October 15, 2024</div>

      <div className="space-y-4 overflow-y-auto flex-1 pr-2 mb-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.sender === "bot" ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`rounded-lg px-4 py-2 max-w-xs ${
                msg.sender === "bot"
                  ? "bg-gray-100 text-black"
                  : "bg-purple-500 text-white"
              }`}
            >
              {msg.text}
              <div className="text-[10px] text-gray-100 text-right mt-1">
                {msg.time}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="rounded-lg px-4 py-2 max-w-xs bg-gray-100 text-gray-500 italic">
              GM is typing…
            </div>
          </div>
        )}
      </div>

      {/* 4️⃣ Wrap input + button in a <form> and wire handleSubmit */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex items-center border-t pt-3">
        <input
          {...register("message", { required: true })}
          type="text"
          placeholder="Type your message..."
          className={`flex-1 border rounded-full px-4 py-2 text-sm mr-2 focus:outline-none focus:ring-2 focus:ring-purple-300
            ${errors.message ? "border-red-500" : "border-gray-300"}`}
          disabled={isSubmitting}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-4 py-2 rounded-full transition ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed text-white"
              : "bg-purple-600 hover:bg-purple-700 text-white"
          }`}
        >
          Send
        </button>
      </form>

      {errors.message && (
        <p className="text-red-500 text-xs mt-1">Please enter a message.</p>
      )}

      <div className="text-xs text-gray-400 mt-4 text-center">
        Powered by <strong>Aura Interiors</strong>
      </div>
    </div>
  );
}
