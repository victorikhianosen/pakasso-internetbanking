"use client";

import { useEffect, useState } from "react";
import QuickAction from "./QuickAction";
import BalanceCard from "./BalanceCard";
import AccountLimit from "./AccountLimit";
import RecentTransaction from "./RecentTransaction";

export default function DashboardPage() {
  const [balanceVisible, setBalanceVisible] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("balanceVisible");
    if (saved !== null) {
      setBalanceVisible(saved !== "false");
    }
  }, []);



  return (
    <div className="space-y-8">

      {/* BALANCE CARD */}

      <BalanceCard />

      {/* QUICK ACTIONS */}

      <QuickAction />

      {/* LIMITS + ACCOUNTS */}

      <AccountLimit />

      {/* TRANSACTIONS */}

      <RecentTransaction />

    </div>
  );
}
