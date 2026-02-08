"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { serverLogout } from "../actions/auth/logout.action";

export default function Logout() {
    const router = useRouter();
    const { setAuth } = useAuth(); // ✅ this is enough

    async function handleLogout() {
        serverLogout()
        router.replace("/login");
    }

    return (
        <button
            type="button"
            onClick={handleLogout}
            className="cursor-pointer w-full text-left px-4 py-3 text-red-600 hover:bg-[#F7F7F7]"
        >
            Log out
        </button>
    );
}
