"use client";

import { useState, useMemo } from "react";
import { ArrowDownLeft, ArrowLeft, ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useGetTransactions } from "@/hooks/useTransactions";
import { TransactionItem } from "@/types/transaction.types";

export default function TransactionsPage() {
  const router = useRouter();

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

  /* ---------------- Fetch Transactions ---------------- */
  const { data: transactionData, isLoading: trxLoading } = useGetTransactions();

  const allTransactions = useMemo<TransactionItem[]>(() => {
    return transactionData?.data?.transactions ?? [];
  }, [transactionData]);
  /* ---------------- Pagination ---------------- */
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  const totalPages = Math.ceil(allTransactions.length / perPage);

  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * perPage;
    const end = currentPage * perPage;
    return allTransactions.slice(start, end);
  }, [allTransactions, currentPage]);

  const pagination = useMemo(() => {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }, [totalPages]);

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex cursor-pointer items-center gap-2 text-sm font-medium text-primary hover:-translate-x-1 transition">
        <ArrowLeft size={18} />
        Back
      </button>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold mb-1">Transactions</h1>
        <p className="text-gray-700">View your all transactions</p>
      </div>

      {/* Transactions List */}
      <div className="space-y-3">
        {/* Loading Skeleton */}
        {trxLoading &&
          [...Array(4)].map((_, i) => (
            <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />
          ))}

        {/* Empty State */}
        {!trxLoading && allTransactions.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-6">No transactions yet</p>
        )}

        {/* Transactions */}
        {!trxLoading &&
          paginatedTransactions.map((t: TransactionItem, index: number) => {
            const isDebit = t.transaction_type === "debit";

            return (
              <div
                key={index}
                className="w-full flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition rounded-xl p-4">
                <div className="flex items-center gap-3 min-w-0 w-[80%]">
                  <div
                    className={`p-2 rounded-xl ${
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

      {/* Pagination */}
      {!trxLoading && totalPages > 1 && (
        <div className="flex justify-end items-center gap-2 mt-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 border rounded-lg disabled:opacity-40 text-sm">
            Prev
          </button>

          {pagination.map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1.5 border rounded-lg ${
                currentPage === page
                  ? "bg-primary text-white border-primary text-sm"
                  : "text-gray-700 hover:bg-gray-100"
              }`}>
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 border rounded-lg disabled:opacity-40 text-white text-sm bg-primary">
            Next
          </button>
        </div>
      )}
    </div>
  );
}
