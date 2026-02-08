"use client"
import { useEffect, useRef, useState } from "react";
import QuickAction from "./QuickAction";
import BalanceCard from "./BalanceCard";
import AccountLimit from "./AccountLimit";
import RecentTransaction from "./RecentTransaction";
import { getBalance } from "@/app/actions/dashboard/get-balance.action";

export default function DashboardPage() {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [balance, setBalance] = useState("•••••••");
  const hasFetched = useRef(false); 

  useEffect(() => {
    const saved = localStorage.getItem("balanceVisible");
    if (saved !== null) {
      setBalanceVisible(saved !== "false");
    }
  }, []);




  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const load = async () => {
      const res = await getBalance();
      console.log("GET BALANCE", res);
      setBalance(res?.data?.balance ?? 0);
    };

    load();
  }, [])

  return (
    <div className="space-y-8">

      {/* BALANCE CARD */}

      <BalanceCard balance={balance}/>

      {/* QUICK ACTIONS */}

      <QuickAction />

      {/* LIMITS + ACCOUNTS */}

      <AccountLimit />

      {/* TRANSACTIONS */}

      <RecentTransaction />

    </div>
  );
}
