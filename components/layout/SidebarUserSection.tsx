"use client"
import { SignedIn, UserButton } from "@clerk/nextjs"

export const SidebarUserSection = ({ isSidebarOpen }: { isSidebarOpen: boolean }) => (
    <div className="p-2 border-t border-zinc-700">
        <SignedIn>
            <div
                className={`flex items-center gap-3 p-2 rounded-md hover:bg-zinc-700 w-full text-left text-sm cursor-pointer ${!isSidebarOpen ? "justify-center" : ""
                    }`}
            >
                <UserButton afterSignOutUrl="/sign-in" />
                {isSidebarOpen && (
                    <>
                        <div className="flex-1 overflow-hidden">
                            <p className="font-semibold truncate">Narayan Raghuwanshi</p>
                            <p className="text-xs text-zinc-400">Free</p>
                        </div>
                        <button className="ml-auto px-3 py-1 text-xs bg-zinc-700 rounded-md hover:bg-zinc-600">
                            Upgrade
                        </button>
                    </>
                )}
            </div>
        </SignedIn>
    </div>
)
