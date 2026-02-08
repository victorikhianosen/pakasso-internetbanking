"use client";

import Image from "next/image";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Logout from "./Logout";

export default function AppHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
    const { auth } = useAuth();
      const FirstName = auth?.data?.user?.first_name


  return (
    <header className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* LEFT */}
        <div className="flex items-center gap-3">
          <Image
            src="/assets/images/logo.png"
            alt="Logo"
            width={120}
            height={32}
            className="h-8 w-auto"
          />
          <span className="font-semibold text-primary">
            Internet Banking
          </span>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          <button className="bg-[#F7F7F7] px-3 py-2 rounded-lg text-sm">
            🔔
          </button>

          <div className="relative">
            <button
              onClick={() => setMenuOpen((p) => !p)}
              className="cursor-pointer flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-sm"
            >
              {/* ✅ CORRECT ACCESS */}
              <span>
                Welcome, {FirstName}
              </span>

              <svg
                className="w-4 h-4 opacity-70"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 9l6 6 6-6"
                />
              </svg>
            </button>

            {/* DROPDOWN */}
            <div
              className={`absolute right-0 mt-3 w-52 rounded-2xl bg-white shadow-[0_12px_30px_rgba(0,0,0,0.08)]
              transition-all origin-top-right z-50
              ${
                menuOpen
                  ? "opacity-100 scale-100 pointer-events-auto"
                  : "opacity-0 scale-95 pointer-events-none"
              }`}
            >
              <div className="py-2 text-sm text-primary">
                <button className="cursor-pointer w-full text-left px-4 py-3 hover:bg-[#F7F7F7]">
                  Profile
                </button>

                <button className="cursor-pointer w-full text-left px-4 py-3 hover:bg-[#F7F7F7]">
                  Settings
                </button>

                <div className="my-1 h-px bg-gray-100"></div>

                <Logout />
              </div>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
}
