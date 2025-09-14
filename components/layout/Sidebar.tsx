"use client"
import { FC } from "react"
import { GPTLogo, HamburgerIcon, EditIcon } from "@/components/icons"
import { Search, Archive, PlayCircle, LayoutGrid } from "lucide-react"
import { SidebarUserSection } from "./SidebarUserSection"

interface Chat {
    _id: string
    title: string
}

interface Props {
    isSidebarOpen: boolean
    setSidebarOpen: (open: boolean) => void
    chats?: Chat[]
    activeChatId?: string
    setActiveChatId?: (id: string) => void
    handleNewChat?: () => void
}

export const Sidebar: FC<Props> = ({
    isSidebarOpen,
    setSidebarOpen,
    chats = [],
    activeChatId,
    setActiveChatId,
    handleNewChat
}) => {
    const navItems = [
        { icon: <EditIcon className="w-5 h-5" />, text: "New chat", onClick: handleNewChat },
        { icon: <Search size={20} />, text: "Search chats" },
        { icon: <Archive size={20} />, text: "Library" },
        { icon: <PlayCircle size={20} />, text: "Sora" },
        { icon: <LayoutGrid size={20} />, text: "GPTs" },
    ]

    return (
        <div
            className={`bg-[#181818] flex flex-col flex-shrink-0 transition-all duration-300 ${isSidebarOpen ? "w-56 md:wd-64" : "w-16"}`}
        >
            {/* Header */}
            <div className={`p-2 h-[72px] flex items-center ${isSidebarOpen ? "justify-between" : "justify-center"}`}>
                {isSidebarOpen && <GPTLogo className="w-8.5 h-8.5" />}
                <button
                    onClick={() => setSidebarOpen(!isSidebarOpen)}
                    className="p-2 hover:bg-zinc-700 rounded-md"
                >
                    <HamburgerIcon />
                </button>
            </div>

            {/* Nav items */}
            <div className="flex-grow overflow-y-auto px-2 custom-scrollbar">
                <nav className="flex flex-col space-y-1">
                    {navItems.map((item, index) => (
                        <button
                            key={index}
                            onClick={item.onClick}
                            className={`flex items-center gap-3 p-3 rounded-md hover:bg-zinc-700 text-sm w-full text-left ${!isSidebarOpen ? "justify-center" : ""}`}
                        >
                            {item.icon}
                            {isSidebarOpen && <span>{item.text}</span>}
                        </button>
                    ))}
                </nav>

                {/* Chats list */}
                {isSidebarOpen && chats.length > 0 && (
                    <div className="mt-8">
                        <p className="text-xs text-zinc-400 font-semibold px-3 mb-2">
                            Chats
                        </p>
                        <div className="flex flex-col space-y-1">
                            {chats.map((chat) => (
                                <button
                                    key={chat._id}
                                    onClick={() => setActiveChatId?.(chat._id)}
                                    className={`flex items-center p-2 rounded-md hover:bg-zinc-700 text-sm text-zinc-200 truncate ${activeChatId === chat._id ? "bg-zinc-700" : ""}`}
                                >
                                    {chat.title}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <SidebarUserSection isSidebarOpen={isSidebarOpen} />

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #555; border-radius: 3px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #777; }
            `}</style>
        </div>
    )
}
