"use client";

import React, { useMemo } from "react";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";

/* ✅ shared type */
export type Transaction = {
  amount: number | string;
  transaction_type?: "debit" | "credit";
  transfer_type?: string;
  sender_name?: string;
  recipient_name?: string;
  created_at?: string;
};

export default function RecentTransaction({
  transactions = [],
}: {
  transactions: Transaction[];
}) {
  const loading = transactions.length === 0;

  /* ---------------- Stats (frontend only) ---------------- */
  const stats = useMemo(() => {
    if (!transactions.length) return null;

    const amounts = transactions.map((t) => Number(t.amount));

    return {
      highest: Math.max(...amounts),
      lowest: Math.min(...amounts),
      total: amounts.reduce((a, b) => a + b, 0),
      count: transactions.length,
    };
  }, [transactions]);

  /* ---------------- Title logic ---------------- */
  const getTitle = (t: Transaction) => {
    if (t.transfer_type === "inward_transfer") {
      return `Transfer From ${t.sender_name}`;
    }

    if (t.transaction_type === "debit") {
      return `Transfer To ${t.recipient_name}`;
    }

    return t.recipient_name || "Transaction";
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
      <h3 className="font-semibold text-lg mb-5">Recent Transactions</h3>

      <div className="space-y-3">
        {loading &&
          [...Array(4)].map((_, i) => (
            <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />
          ))}

        {!loading && transactions.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-6">
            No transactions yet
          </p>
        )}

        {transactions.slice(0, 4).map((t, index) => {
          const isDebit = t.transaction_type === "debit";

          return (
            <div
              key={index}
              className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition rounded-xl p-4"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`p-2 rounded-xl ${
                    isDebit
                      ? "bg-red-100 text-red-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  {isDebit ? (
                    <ArrowUpRight size={18} />
                  ) : (
                    <ArrowDownLeft size={18} />
                  )}
                </div>

                <div>
                  <p className="font-medium text-sm truncate">
                    {getTitle(t)}
                  </p>
                  <p className="text-xs text-gray-400">{t.created_at}</p>
                </div>
              </div>

              <p
                className={`font-semibold text-sm ${
                  isDebit ? "text-red-500" : "text-green-600"
                }`}
              >
                {isDebit ? "−" : "+"} ₦{Number(t.amount).toLocaleString()}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
