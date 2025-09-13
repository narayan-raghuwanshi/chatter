"use client"
import { FC } from "react"
import { GPTLogo, HamburgerIcon, EditIcon } from "@/components/icons"
import { Search, Archive, PlayCircle, LayoutGrid } from "lucide-react"
import { SidebarUserSection } from "./SidebarUserSection"

interface Props {
    isSidebarOpen: boolean
    setSidebarOpen: (open: boolean) => void
}

export const Sidebar: FC<Props> = ({ isSidebarOpen, setSidebarOpen }) => {
    const recentChats = [
        "User input clarification",
        "React input box code",
        "Make logo white",
        "Export types TypeScript",
        "ChatGPT replica creation",
        "Fix append error",
        "Hydration error fix",
        "Send button issue debug",
        "Fix protect function error",
        "JSON prompt for v0.dev",
    ]

    const navItems = [
        { icon: <EditIcon className="w-5 h-5" />, text: "New chat" },
        { icon: <Search size={20} />, text: "Search chats" },
        { icon: <Archive size={20} />, text: "Library" },
        { icon: <PlayCircle size={20} />, text: "Sora" },
        { icon: <LayoutGrid size={20} />, text: "GPTs" },
    ]

    return (
        <div
            className={`bg-[#202123] flex flex-col flex-shrink-0 transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-20"
                }`}
        >
            <div className="p-2 h-[72px]">
                <div
                    className={`flex items-center h-full ${isSidebarOpen ? "justify-between" : "justify-center"
                        }`}
                >
                    {isSidebarOpen && (
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="p-2 hover:bg-zinc-700 rounded-md"
                        >
                            <GPTLogo className="w-8 h-8" />
                        </button>
                    )}
                    <button
                        onClick={() => setSidebarOpen(!isSidebarOpen)}
                        className="p-2 hover:bg-zinc-700 rounded-md"
                    >
                        <HamburgerIcon />
                    </button>
                </div>
            </div>

            <div className="flex-grow overflow-y-auto px-2 custom-scrollbar">
                <nav className="flex flex-col space-y-1">
                    {navItems.map((item, index) => (
                        <a
                            key={index}
                            href="#"
                            className={`flex items-center gap-3 p-3 rounded-md hover:bg-zinc-700 text-sm ${!isSidebarOpen ? "justify-center" : ""
                                }`}
                        >
                            {item.icon}
                            {isSidebarOpen && <span>{item.text}</span>}
                        </a>
                    ))}
                </nav>

                {isSidebarOpen && (
                    <div className="mt-8">
                        <p className="text-xs text-zinc-400 font-semibold px-3 mb-2">Chats</p>
                        <div className="flex flex-col space-y-1">
                            {recentChats.map((chat, index) => (
                                <a
                                    key={index}
                                    href="#"
                                    className="p-3 rounded-md hover:bg-zinc-700 text-sm text-zinc-200 truncate"
                                >
                                    {chat}
                                </a>
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
