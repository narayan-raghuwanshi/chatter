"use client"
import { FC } from "react"
import { Message } from "@/types/message"
import { useTypingEffect } from "@/hooks/useTypingEffect"

export const ChatMessage: FC<{ message: Message; isLast?: boolean }> = ({ message, isLast }) => {
    const { role, content } = message
    const isAssistant = role === "assistant"

    const typingText = useTypingEffect(content, 7, isAssistant && isLast)
    const displayedText = isAssistant && isLast ? typingText : content
    return (
        <div className={`flex mx-8 md:mx-64 ${isAssistant ? "justify-start" : "justify-end"}`}>
            <div className={`max-w-xl md:max-w-2xl py-3 px-4 my-2 rounded-full flex items-start gap-x-3 ${isAssistant ? "" : "bg-zinc-800"}`}>
                <div className="flex-grow text-zinc-100 message-text whitespace-pre-wrap">
                    {displayedText}
                    {isAssistant && isLast && !displayedText && (
                        <span className="animate-pulse">...</span>
                    )}
                </div>
            </div>
        </div>
    )
}
