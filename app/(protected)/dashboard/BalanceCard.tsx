"use client";

import { useUser } from "@/context/UserContext";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

/* ✅ user shape */
type User = {
  first_name?: string;
  last_name?: string;
  accountno?: string;
  balance?: number;
  currency?: string;
};

export default function BalanceCard({ balance }: { balance: number }) {
  const { user } = useUser();

  const [balanceVisible, setBalanceVisible] = useState(true);
  const [cachedUser, setCachedUser] = useState<User | null>(null);

  const displayUser: User | null = user || cachedUser;

  useEffect(() => {
    const saved = localStorage.getItem("balanceVisible");
    if (saved !== null) setBalanceVisible(saved === "true");
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem("cachedUser");
    if (savedUser) setCachedUser(JSON.parse(savedUser));
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("cachedUser", JSON.stringify(user));
      setCachedUser(user);
    }
  }, [user]);

  const toggleBalance = () => {
    const next = !balanceVisible;
    setBalanceVisible(next);
    localStorage.setItem("balanceVisible", String(next));
  };

  const copyAccount = () => {
    const text = String(displayUser?.accountno ?? "");
    if (!text) return toast.error("Account number not available");

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);

    toast.success("Copied ✓");
  };

  return (
    <div className="rounded-3xl bg-gradient-to-br from-primary to-[#1f272f] text-white p-8 shadow-xl">
      <div className="flex flex-col md:flex-row justify-between gap-8">
        {/* LEFT */}
        <div className="flex-1 space-y-6">
          <p className="text-sm opacity-80">Available Balance</p>

          <div className="flex items-center gap-3">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              {balanceVisible
                ? `${displayUser?.currency ?? "₦"}${Number(balance).toLocaleString()}`
                : "•••••••"}
            </h1>

            <button onClick={toggleBalance} className="opacity-70 hover:opacity-100 text-lg">
              👁
            </button>
          </div>

          <Link
            href="/bank-transfer"
            className="inline-block bg-yellow-400 text-primary px-6 py-2 rounded-xl font-semibold"
          >
            Transfer
          </Link>
        </div>

        {/* RIGHT */}
        <div className="relative backdrop-blur-md rounded-2xl p-6 min-w-[260px] space-y-4">
          <button
            onClick={copyAccount}
            className="absolute top-4 right-4 text-xs bg-white/20 px-3 py-1.5 rounded-lg"
          >
            Copy
          </button>

          <div>
            <p className="text-xs opacity-70">Account Name</p>
            <p className="font-semibold capitalize">
              {displayUser?.first_name} {displayUser?.last_name}
            </p>
          </div>

          <div>
            <p className="text-xs opacity-70">Account Number</p>
            <p className="font-semibold tracking-wider">
              {displayUser?.accountno || "—"}
            </p>
          </div>

          <div>
            <p className="text-xs opacity-70">Bank</p>
            <p className="font-semibold">Asset Matrix MFB</p>
          </div>
        </div>
      </div>
    </div>
  );
}
