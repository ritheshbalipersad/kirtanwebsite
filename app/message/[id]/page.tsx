"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { MessageCircle, Send, CameraOff, Shield } from "lucide-react";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { useAuth } from "@/app/context/AuthContext";

const MOCK_NAMES: Record<string, string> = {};
const CHAT_PREFIX = "skillswap_chat_";

type ChatMessage = {
  id: string;
  text: string;
  sender: "admin" | "user";
  createdAt: string;
};

export default function MessagePage() {
  const params = useParams();
  const { isAdmin, mounted } = useAuth();
  const id = params?.id as string;
  const name = id ? (MOCK_NAMES[id] ?? "User") : "User";
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const chatKey = useMemo(() => CHAT_PREFIX + (id || "unknown"), [id]);

  useEffect(() => {
    if (!mounted || !isAdmin) return;
    try {
      const raw = localStorage.getItem(chatKey);
      if (!raw) {
        setMessages([
          {
            id: "seed-1",
            text: `Hi, this is the private chat with ${name}.`,
            sender: "user",
            createdAt: new Date().toISOString(),
          },
        ]);
        return;
      }
      const parsed = JSON.parse(raw) as ChatMessage[];
      setMessages(parsed);
    } catch {
      setMessages([]);
    }
  }, [chatKey, mounted, isAdmin, name]);

  useEffect(() => {
    if (!mounted || !isAdmin) return;
    localStorage.setItem(chatKey, JSON.stringify(messages));
  }, [messages, chatKey, mounted, isAdmin]);

  if (!mounted) return null;
  if (!isAdmin) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-deep-50/30 dark:bg-deep-900/20 flex items-center justify-center">
          <div className="text-center px-4">
            <Shield className="h-12 w-12 mx-auto text-amber-500 mb-4" />
            <h1 className="font-display text-xl font-bold text-deep-900 dark:text-white">Admin only</h1>
            <p className="mt-2 text-deep-600 dark:text-deep-400">Only admins can access private chats.</p>
            <Link href="/admin/login" className="mt-4 inline-block text-brand-500 hover:underline">Admin login</Link>
            <span className="mx-2 text-deep-400">|</span>
            <Link href="/browse" className="text-deep-500 hover:underline">Browse</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-deep-50/30 dark:bg-deep-900/20">
        <div className="mx-auto max-w-2xl px-4 py-6">
          <div className="rounded-2xl border border-deep-200 bg-white dark:border-deep-700 dark:bg-deep-900/50">
            <div className="flex items-center gap-3 border-b border-deep-200 px-4 py-3 dark:border-deep-700">
              <MessageCircle className="h-5 w-5 text-brand-500" />
              <h1 className="font-display text-lg font-bold text-deep-900 dark:text-white">Private chat with {name}</h1>
              <Link href={id ? `/profile/${id}` : "/browse"} className="ml-auto text-sm text-deep-500 hover:text-brand-500">View profile</Link>
            </div>
            <p className="flex items-center gap-2 border-b border-deep-200 bg-amber-50/50 px-4 py-2 text-sm text-amber-800 dark:border-deep-700 dark:bg-amber-950/20 dark:text-amber-200">
              <CameraOff className="h-4 w-4" /> No screenshots of sessions or chat.
            </p>
            <div className="min-h-[300px] max-h-[420px] overflow-y-auto p-4 space-y-3">
              {messages.length === 0 ? (
                <p className="text-center text-sm text-deep-500 dark:text-deep-400">Start the conversation below.</p>
              ) : (
                messages.map((m) => (
                  <div key={m.id} className={`max-w-[80%] rounded-xl px-3 py-2 ${m.sender === "admin" ? "ml-auto bg-brand-500 text-white" : "bg-deep-100 text-deep-800 dark:bg-deep-800 dark:text-deep-100"}`}>
                    <p className="text-sm">{m.text}</p>
                    <p className={`mt-1 text-[10px] ${m.sender === "admin" ? "text-brand-100" : "text-deep-500 dark:text-deep-400"}`}>
                      {new Date(m.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                ))
              )}
            </div>
            <form
              className="flex gap-2 border-t border-deep-200 p-4 dark:border-deep-700"
              onSubmit={(e) => {
                e.preventDefault();
                const text = input.trim();
                if (!text) return;
                setMessages((prev) => [
                  ...prev,
                  {
                    id: "m-" + Date.now().toString(),
                    text,
                    sender: "admin",
                    createdAt: new Date().toISOString(),
                  },
                ]);
                setInput("");
              }}
            >
              <input
                type="text"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 rounded-lg border border-deep-200 bg-white px-4 py-2.5 text-deep-900 placeholder:text-deep-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-deep-700 dark:bg-deep-900 dark:text-white"
              />
              <button type="submit" disabled={!input.trim()} className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 font-medium text-white hover:bg-brand-600 disabled:opacity-50">
                <Send className="h-4 w-4" /> Send
              </button>
            </form>
          </div>
          <p className="mt-4 text-center">
            <Link href="/browse" className="text-sm text-deep-500 hover:text-brand-500">← Back to browse</Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
