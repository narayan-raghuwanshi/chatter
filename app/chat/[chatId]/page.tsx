"use client"

import { useEffect, useState, useRef } from "react"
import { ChatMessage } from "@/components/chat/ChatMessage"
import { InputArea } from "@/components/chat/InputArea"
import { Message } from "@/types/message"
import { chat } from "@/actions/chat"
import { readStreamableValue } from "@ai-sdk/rsc"
import { useParams } from "next/navigation"

export default function ChatPage() {
    const { chatId } = useParams<{ chatId: string }>()
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState("")
    const [isWaitingForResponse, setIsWaitingForResponse] = useState(false)
    const chatContainerRef = useRef<HTMLDivElement>(null)
    const textareaRef = useRef<HTMLTextAreaElement | null>(null)

    useEffect(() => {
        fetch(`/api/chats/${chatId}/messages`)
            .then((res) => res.json())
            .then((msgs: Message[]) => setMessages(msgs))
    }, [chatId])

    useEffect(() => {
        chatContainerRef.current?.scrollTo(0, chatContainerRef.current.scrollHeight)
    }, [messages])

    const handleSend = async () => {
        if (!input.trim() || isWaitingForResponse) return
        setIsWaitingForResponse(true)

        const userMessage: Message = { role: "user", content: input.trim() }
        setInput("")
        setMessages((prev) => [...prev, userMessage])

        try {
            await fetch(`/api/chats/${chatId}/messages`, {
                method: "POST",
                body: JSON.stringify(userMessage),
                headers: { "Content-Type": "application/json" },
            })

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

            await fetch(`/api/chats/${chatId}/messages`, {
                method: "POST",
                body: JSON.stringify(assistantMessage),
                headers: { "Content-Type": "application/json" },
            })
        } finally {
            setIsWaitingForResponse(false)
        }
    }

    return (
        <>
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto pt-20 pb-40">
                {messages.map((msg, i) => (
                    <ChatMessage key={i} message={msg} isLast={i === messages.length - 1} />
                ))}
            </div>

            <div className="absolute bottom-0 left-0 right-0">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
                    <InputArea
                        input={input}
                        setInput={setInput}
                        isWaitingForResponse={isWaitingForResponse}
                        textareaRef={textareaRef}
                        handleSend={handleSend}
                        handleKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault()
                                handleSend()
                            }
                        }}
                    />
                </div>
            </div>
        </>
    )
}
