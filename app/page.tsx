"use client"
import { useState, useEffect, useRef } from "react"
import { ChatMessage } from "@/components/chat/ChatMessage"
import { InputArea } from "@/components/chat/InputArea"
import { Sidebar } from "@/components/layout/Sidebar"
import { Message } from "@/types/message"
import { chat } from "@/actions/chat"
import { readStreamableValue } from "@ai-sdk/rsc"
import { ChevronDown } from "lucide-react"

export default function App() {
  const [chats, setChats] = useState<{ _id: string; title: string }[]>([])
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isSidebarOpen, setSidebarOpen] = useState(true)
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  // Fetch all chats on mount
  useEffect(() => {
    fetch("/api/chats")
      .then((res) => res.json())
      .then((data) => {
        setChats(data)
        if (data.length > 0) setActiveChatId(data[0]._id)
      })
  }, [])

  // Fetch messages whenever activeChatId changes
  useEffect(() => {
    if (!activeChatId) return
    fetch(`/api/chats/${activeChatId}/messages`)
      .then((res) => res.json())
      .then((msgs: Message[]) => setMessages(msgs))
  }, [activeChatId])

  // Auto scroll
  useEffect(() => {
    chatContainerRef.current?.scrollTo(0, chatContainerRef.current.scrollHeight)
  }, [messages])

  // Auto resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [input])

  // Handle sending messages
  const handleSend = async () => {
    if (!input.trim() || isWaitingForResponse) return

    setIsWaitingForResponse(true)
    const userMessage: Message = { role: "user", content: input.trim() }
    setInput("")
    setMessages((prev) => [...prev, userMessage])

    try {
      let chatId = activeChatId
      if (!chatId) {
        const res = await fetch("/api/chats", {
          method: "POST",
          body: JSON.stringify({ title: `New Chat ${chats.length + 1}` }),
          headers: { "Content-Type": "application/json" },
        })
        const newChat = await res.json()
        chatId = newChat._id

        // update state
        setChats((prev) => [newChat, ...prev])
        setActiveChatId(chatId)
        setMessages([userMessage])
      }

      // Save user message
      await fetch(`/api/chats/${chatId}/messages`, {
        method: "POST",
        body: JSON.stringify(userMessage),
        headers: { "Content-Type": "application/json" },
      })

      // Get assistant response
      const { newMessage } = await chat([...messages, userMessage])
      let textContent = ""
      const assistantMessage: Message = { role: "assistant", content: "" }
      setMessages((prev) => [...prev, assistantMessage])

      for await (const chunk of readStreamableValue(newMessage)) {
        textContent += chunk
        assistantMessage.content = textContent
        setMessages((prev) => {
          const updated = [...prev]
          updated[updated.length - 1] = assistantMessage
          return updated
        })
      }

      // Save assistant message
      await fetch(`/api/chats/${chatId}/messages`, {
        method: "POST",
        body: JSON.stringify(assistantMessage),
        headers: { "Content-Type": "application/json" },
      })
    } catch (error) {
      console.error(error)
      setMessages((prev) => [...prev, { role: "assistant", content: "Error, try again." }])
    } finally {
      setIsWaitingForResponse(false)
    }
  }


  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleNewChat = async () => {
    const res = await fetch("/api/chats", {
      method: "POST",
      body: JSON.stringify({ title: `New Chat ${chats.length + 1}` }),
      headers: { "Content-Type": "application/json" },
    })
    const newChat = await res.json()
    setChats((prev) => [newChat, ...prev])
    setActiveChatId(newChat._id)
    setMessages([])
    return newChat._id
  }

  return (
    <div className="flex h-screen bg-[#212121] text-white font-sans">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setSidebarOpen={setSidebarOpen}
        chats={chats}
        activeChatId={activeChatId || undefined}
        setActiveChatId={setActiveChatId}
        handleNewChat={handleNewChat}
      // removed handleDeleteChat & handleEditChat
      />

      <div className="flex-1 flex flex-col relative">
        <header className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-10">
          <h1 className="text-xl flex gap-1 items-center">ChatGPT <ChevronDown size={20} /></h1>
          <div className="w-8"></div>
        </header>

        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col justify-center items-center text-center px-4">
            <h2 className="text-3xl text-white mb-8">What&apos;s on your mind today?</h2>
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
                <ChatMessage key={index} message={msg} isLast={index === messages.length - 1} />
              ))}
            </div>
            {/* Removed blur/gradient background */}
            <div className="absolute bottom-0 left-0 right-0">
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
