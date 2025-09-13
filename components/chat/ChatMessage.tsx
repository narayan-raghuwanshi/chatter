"use client"
import { FC } from "react"
import { GPTLogo, UserIcon } from "@/components/icons"
import { Message } from "@/types/message"
import { useTypingEffect } from "@/hooks/useTypingEffect"

export const ChatMessage: FC<{ message: Message }> = ({ message }) => {
    const { sender, text } = message
    const isAssistant = sender === "assistant"
    const displayedText = isAssistant ? useTypingEffect(text, 20) : text

    const Icon = isAssistant ? (
        <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center">
            <GPTLogo className="w-5 h-5" />
        </div>
    ) : (
        <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center">
            <UserIcon />
        </div>
    )

    return (
        <div className={`py-6 ${isAssistant ? "bg-zinc-700/50" : ""}`}>
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 flex items-start space-x-4">
                <div className="flex-shrink-0">{Icon}</div>
                <div className="flex-grow pt-1 text-zinc-100 message-text">
                    {displayedText}
                    {!displayedText && isAssistant && <span className="animate-pulse">...</span>}
                </div>
            </div>
        </div>
    )
}
