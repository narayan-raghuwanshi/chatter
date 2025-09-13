"use client"
import { useState, useEffect, useRef, useCallback } from "react"
import { ChatMessage } from "@/components/chat/ChatMessage"
import { InputArea } from "@/components/chat/InputArea"
import { Sidebar } from "@/components/layout/Sidebar"
import { Message } from "@/types/message"

export default function App() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isSidebarOpen, setSidebarOpen] = useState(true)
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  useEffect(() => {
    chatContainerRef.current?.scrollTo(0, chatContainerRef.current.scrollHeight)
  }, [messages])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [input])

  const handleSend = useCallback(() => {
    if (input.trim() && !isWaitingForResponse) {
      const userMessage: Message = { sender: "user", text: input }
      setMessages((prev) => [...prev, userMessage])
      setInput("")
      setIsWaitingForResponse(true)

      setTimeout(() => {
        const assistantResponse: Message = {
          sender: "assistant",
          text: "This is a high-fidelity replica of the ChatGPT interface. While the UI is fully interactive, the responses are simulated.",
        }
        setMessages((prev) => [...prev, assistantResponse])
        setIsWaitingForResponse(false)
      }, 500)
    }
  }, [input, isWaitingForResponse])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex h-screen bg-zinc-900 text-white font-sans">
      <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col relative">
        <header className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-10">
          <h1 className="text-lg font-semibold">ChatGPT</h1>
          <div className="w-8"></div>
        </header>

        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col justify-center items-center text-center px-4">
            <h2 className="text-3xl text-white mb-8">What's on your mind today?</h2>
            <InputArea
              input={input}
              setInput={setInput}
              isWaitingForResponse={isWaitingForResponse}
              textareaRef={textareaRef}
              handleSend={handleSend}
              handleKeyDown={handleKeyDown}
            />
          </div>
        ) : (
          <>
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto pt-20 pb-40">
              {messages.map((msg, index) => (
                <ChatMessage key={index} message={msg} />
              ))}
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-zinc-900 via-zinc-900 to-transparent">
              <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
                <InputArea
                  input={input}
                  setInput={setInput}
                  isWaitingForResponse={isWaitingForResponse}
                  textareaRef={textareaRef}
                  handleSend={handleSend}
                  handleKeyDown={handleKeyDown}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
