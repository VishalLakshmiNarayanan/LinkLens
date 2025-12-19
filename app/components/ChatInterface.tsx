"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { Message, getMessages, sendMessage, updateMessageEventData } from "@/lib/supabase";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";

export function ChatInterface() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMessages();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    setLoading(true);
    const fetchedMessages = await getMessages(100);
    setMessages(fetchedMessages);
    setLoading(false);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (content: string) => {
    if (!session?.user) return;

    setSending(true);

    // Optimistic update
    const optimisticMessage: Message = {
      id: `temp-${Date.now()}`,
      user_id: session.user.id,
      user_email: session.user.email || "",
      user_name: session.user.name || null,
      user_image: session.user.image || null,
      content,
      event_data: null,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticMessage]);

    // Send to database
    const savedMessage = await sendMessage({
      user_id: session.user.id,
      user_email: session.user.email || "",
      user_name: session.user.name || null,
      user_image: session.user.image || null,
      content,
      event_data: null,
    });

    if (savedMessage) {
      // Replace optimistic message with real one
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === optimisticMessage.id ? savedMessage : msg
        )
      );
    }

    setSending(false);
  };

  const handleEventDetected = async (messageId: string, eventData: any) => {
    // Update local state
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, event_data: eventData } : msg
      )
    );

    // Persist to database (if not a temp message)
    if (!messageId.startsWith("temp-")) {
      await updateMessageEventData(messageId, eventData);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {messages.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No messages yet
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Start the conversation! Share an event link and watch it come to
                life with rich previews.
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                isOwnMessage={message.user_id === session?.user?.id}
                onEventDetected={handleEventDetected}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <ChatInput onSend={handleSendMessage} disabled={sending} />
    </div>
  );
}

