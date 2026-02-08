"use client";

import { useState, useEffect } from "react";
import { getBalance } from "@/app/actions/dashboard/get-balance.action";

type ConfirmTransferModalProps = {
  isOpen: boolean;
  fullName: string;
  accountNumber: string;
  bankName: string;
  onCancel: () => void;
  onConfirm: (amount: number) => void;
};

export default function ConfirmTransferModal({
  isOpen,
  fullName,
  accountNumber,
  bankName,
  onCancel,
  onConfirm,
}: ConfirmTransferModalProps) {

  const [rawAmount, setRawAmount] = useState("");
  const [amountError, setAmountError] = useState("");

  // ✅ NEW: store balance
  const [balance, setBalance] = useState(0);


  /* ---------------------------------
     FETCH BALANCE WHEN MODAL OPENS
  ---------------------------------- */
  useEffect(() => {
    if (!isOpen) return;

    const loadBalance = async () => {
      const res = await getBalance();
      setBalance(Number(res?.data?.balance ?? 0));
    };

    loadBalance();
  }, [isOpen]);


  if (!isOpen) return null;


  /* -------------------------------
     Helpers
  -------------------------------- */
  const formatAmount = (value: string) => {
    if (!value) return "";

    const [intPart, decimalPart] = value.split(".");
    const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return decimalPart !== undefined
      ? `${formattedInt}.${decimalPart}`
      : formattedInt;
  };


  /* -------------------------------
     REALTIME VALIDATION
  -------------------------------- */
  const handleChange = (input: string) => {
    const clean = input.replace(/,/g, "");

    if (!/^\d*\.?\d{0,2}$/.test(clean)) return;

    setRawAmount(clean);

    const amount = Number(clean);

    if (!clean) {
      setAmountError("");
      return;
    }

    if (isNaN(amount)) {
      setAmountError("Invalid amount");
      return;
    }

    if (amount < 10) {
      setAmountError("Minimum transfer amount is ₦10.00");
      return;
    }

    // ✅ NEW: insufficient funds check
    if (amount > balance) {
      setAmountError("Insufficient funds");
      return;
    }

    setAmountError("");
  };


  const handleConfirm = () => {
    const amount = Number(rawAmount);

    if (amount < 10) {
      setAmountError("Minimum transfer amount is ₦10.00");
      return;
    }

    // ✅ NEW: block confirm if insufficient
    if (amount > balance) {
      setAmountError("Insufficient funds");
      return;
    }

    onConfirm(amount);
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl w-full max-w-lg p-8">

        {/* Title */}
        <h3 className="text-lg font-semibold text-primary mb-2">
          Confirm Transfer
        </h3>

        <p className="text-sm text-gray-600 mb-4">
          Please confirm the recipient and enter amount
        </p>

        {/* Recipient Info */}
        <div className="bg-gray-50 rounded-2xl p-4 mb-6 space-y-4">
          <div>
            <p className="text-[11px] text-gray-500 uppercase tracking-wide">
              Recipient Name
            </p>
            <p className="font-semibold text-green-600 text-lg leading-tight">
              {fullName}
            </p>
          </div>

          <div className="h-px bg-gray-200" />

          <div>
            <p className="text-[11px] text-gray-500 uppercase tracking-wide">
              Account Number
            </p>
            <p className="text-sm font-medium text-gray-700 font-mono tracking-wide">
              {accountNumber}
            </p>
          </div>

          <div>
            <p className="text-[11px] text-gray-500 uppercase tracking-wide">
              Bank Name
            </p>
            <p className="text-sm font-normal text-gray-600">
              {bankName}
            </p>
          </div>
        </div>

        {/* AMOUNT INPUT */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-primary mb-2">
            Amount
          </label>

          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
              ₦
            </span>
            <input
              type="text"
              inputMode="decimal"
              placeholder="0.00"
              value={formatAmount(rawAmount)}
              onChange={(e) => handleChange(e.target.value)}
              className="w-full h-14 pl-10 pr-4 rounded-xl border border-gray-300
              focus:outline-none focus:ring-2 focus:ring-yellow-400
              text-lg font-semibold"
            />
          </div>

          {amountError ? (
            <p className="text-xs text-red-600 mt-1">
              {amountError}
            </p>
          ) : (
            <p className="text-xs text-gray-500 mt-1">
              Example: 1,000.00 or 25,500.75
            </p>
          )}

        </div>

        {/* ACTIONS */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="w-1/2 h-12 rounded-xl border border-gray-300
            text-gray-600 hover:bg-gray-100 transition cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={!rawAmount || Number(rawAmount) <= 0 || !!amountError}
            className={`w-1/2 h-12 rounded-xl font-semibold transition
            ${!rawAmount || Number(rawAmount) <= 0 || amountError
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-primary text-white hover:opacity-90 cursor-pointer"}`}
          >
            Continue
          </button>
        </div>

      </div>
    </div>
  );
}
