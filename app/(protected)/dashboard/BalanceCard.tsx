"use client";

import Link from 'next/link';
import React, { useState } from 'react';

export default function BalanceCard({ balance }) {
    const [balanceVisible, setBalanceVisible] = useState(true);

    const toggleBalance = () => {
        const next = !balanceVisible;
        setBalanceVisible(next);
        localStorage.setItem("balanceVisible", String(next));
    };

    return (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-[#1f272f] text-white p-8">
            <div className="relative z-10">
                <div className="flex items-center gap-3">

                    <h1 className="text-4xl font-bold">
                        {balanceVisible ? `₦${Number(balance).toLocaleString()}` : "•••••••"}
                    </h1>

                    <button
                        onClick={toggleBalance}
                        className="opacity-70 hover:opacity-100"
                    >
                        👁
                    </button>

                </div>

                <div className="mt-6 flex gap-3 flex-wrap">
                    <Link href='bank-transfer' className="bg-[#fee028] text-primary px-5 py-2 rounded-xl font-semibold">
                        Transfer
                    </Link>
                </div>
            </div>
        </div>
    );
}
