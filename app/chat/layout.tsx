"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Sidebar } from "@/components/layout/Sidebar"
import { ChevronDown } from "lucide-react"

export default function ChatLayout({ children }: { children: React.ReactNode }) {
    const [chats, setChats] = useState<{ _id: string; title: string }[]>([])
    const [isSidebarOpen, setSidebarOpen] = useState(true)
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        fetch("/api/chats")
            .then((res) => res.json())
            .then((data) => setChats(data))
    }, [pathname])

    const handleNewChat = async () => {
        const res = await fetch("/api/chats", {
            method: "POST",
            body: JSON.stringify({ title: `New Chat ${chats.length + 1}` }),
            headers: { "Content-Type": "application/json" },
        })
        const newChat = await res.json()
        setChats((prev) => [newChat, ...prev])
        router.push(`/chat/${newChat._id}`)
    }

    const activeChatId = pathname.startsWith("/chat/")
        ? pathname.split("/chat/")[1]
        : undefined

    return (
        <div className="flex h-screen bg-[#212121] text-white font-sans">
            <Sidebar
                isSidebarOpen={isSidebarOpen}
                setSidebarOpen={setSidebarOpen}
                chats={chats}
                activeChatId={activeChatId}
                setActiveChatId={(id) => router.push(`/chat/${id}`)}
                handleNewChat={handleNewChat}
            />

            <div className="flex-1 flex flex-col relative">
                <header className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-10">
                    <h1 className="text-xl flex gap-1 items-center">
                        Chatter <ChevronDown size={20} />
                    </h1>
                    <div className="w-8"></div>
                </header>

                {children}
            </div>
        </div>
    )
}
