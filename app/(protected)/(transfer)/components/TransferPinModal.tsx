"use client";

import { useRef, useState } from "react";

type TransferPinModalProps = {
  isOpen: boolean;
  error?: string;
  onCancel: () => void;
  onConfirm: (pin: string) => void;
};

export default function TransferPinModal({
  isOpen,
  error,
  onCancel,
  onConfirm,
}: TransferPinModalProps) {
  const [pin, setPin] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl w-full max-w-lg p-8">
        <h3 className="text-lg font-semibold text-primary mb-6 pb-14">
          Confirm Transaction PIN
        </h3>

        <PinInput value={pin} onChange={setPin} />

        {error && (
          <p className="text-center text-red-600 text-sm mt-3">
            {error}
          </p>
        )}

        <div className="flex gap-3 pt-12">
          <button
            type="button"
            onClick={onCancel}
            className="w-1/2 h-12 rounded-xl border border-gray-300 text-gray-600"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={pin.length !== 4}
            onClick={() => onConfirm(pin)}
            className={`w-1/2 h-12 rounded-xl font-semibold
              ${
                pin.length !== 4
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-primary text-white cursor-pointer"
              }`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- PIN INPUT ---------------- */

function PinInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (pin: string) => void;
}) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (val: string, index: number) => {
    if (!/^\d?$/.test(val)) return;

    const pinArr = value.split("");
    pinArr[index] = val;

    const newPin = pinArr.join("").padEnd(4, "");
    onChange(newPin);

    if (val && index < 3) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (index: number) => {
    const pinArr = value.split("");
    pinArr[index] = "";
    onChange(pinArr.join(""));

    if (index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-center mb-4">
        Enter Transaction PIN
      </label>

      <div className="flex justify-center gap-4">
        {[0, 1, 2, 3].map((i) => (
       <input
  key={i}
  ref={(el) => {
    inputsRef.current[i] = el;
  }}
  type="password"
  inputMode="numeric"
  maxLength={1}
  value={value[i] || ""}
  onChange={(e) => handleChange(e.target.value, i)}
  onKeyDown={(e) =>
    e.key === "Backspace" && handleBackspace(i)
  }
  className="w-14 h-14 text-center text-xl font-semibold rounded-xl border"
/>

        ))}
      </div>
    </div>
  );
}
