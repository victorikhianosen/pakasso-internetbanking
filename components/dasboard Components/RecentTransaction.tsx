"use client";

import { ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { TransactionItem } from "@/types/transaction.types";
import { useRouter } from "next/navigation";

export default function RecentTransaction({
  transactions = [],
  loading,
}: {
  transactions: TransactionItem[];
  loading?: boolean;
}) {
  /* ---------------- Title logic ---------------- */
  const getTitle = (t: TransactionItem) => {
    if (t.transfer_type === "inward_transfer") {
      return `Transfer From ${t.sender_name}`;
    }

    if (t.transfer_type === "wallet_transfer" || t.transfer_type === "bank_transfer") {
      return `Transfer To ${t.recipient_name}`;
    }

    if (t.transfer_type === "data") {
      return `Purchased  ${t.transfer_type}`;
    }

    if (t.transfer_type === "artime") {
      return `Purchased  ${t.transfer_type}`;
    }

    return t.recipient_name || "Transaction";
  };

  const router = useRouter();

  /* ---------------- UI ---------------- */
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 w-full">
      <div className="flex justify-between items-center w-full mb-6">
        <h3 className="font-semibold text-lg mb-5">Recent Transactions</h3>
        <button
          className="text-sm font-medium text-primary hover:-translate-x-1 transition hover:bg-primary hover:text-white bg-gray-100 rounded-xl py-2.5 px-5"
          onClick={() => {
            router.push("/transactions");
          }}>
          View All
        </button>
      </div>

      <div className="space-y-3">
        {loading &&
          [...Array(4)].map((_, i) => (
            <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />
          ))}

        {!loading && transactions.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-6">No transactions yet</p>
        )}

        {transactions.slice(0, 4).map((t, index) => {
          const isDebit = t.transaction_type === "debit";

          return (
            <div
              key={index}
              className="w-full flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition rounded-xl p-4">
              <div className="flex items-center gap-3 min-w-0 w-[80%]">
                <div
                  className={`p-2 rounded-xl  ${
                    isDebit ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
                  }`}>
                  {isDebit ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
                </div>

                <div className="overflow-hidden">
                  <p className="font-medium text-sm truncate">{getTitle(t)}</p>
                  <p className="text-xs text-gray-400">{t.created_at}</p>
                </div>
              </div>

              <p
                className={`flex font-semibold text-sm w-[20%] justify-end ${
                  isDebit ? "text-red-500" : "text-green-600"
                }`}>
                {isDebit ? "−" : "+"} ₦{Number(t.amount).toLocaleString()}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
