"use client"
import { FC } from "react"
import { GPTLogo, UserIcon } from "@/components/icons"
import { Message } from "@/types/message"
import { useTypingEffect } from "@/hooks/useTypingEffect"

export const ChatMessage: FC<{ message: Message; isLast?: boolean }> = ({ message, isLast }) => {
    const { role, content } = message
    const isAssistant = role === "assistant"

    // Apply typing effect ONLY if assistant and last message
    const displayedText =
        isAssistant && isLast ? useTypingEffect(content, 7) : content

    const Icon = isAssistant ? (
        <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0">
            <GPTLogo className="w-5 h-5" />
        </div>
    ) : (
        <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center flex-shrink-0">
            <UserIcon />
        </div>
    )

    return (
        <div className={`flex mx-8 md:mx-64 ${isAssistant ? "justify-start" : "justify-end"}`}>
            <div className={`max-w-xl md:max-w-2xl py-3 px-4 my-2 rounded-full flex items-start gap-x-3 ${isAssistant ? "" : "bg-zinc-800"}`}>
                {/* {Icon} */}
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
