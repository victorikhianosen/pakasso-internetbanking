"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getBanks } from "@/app/actions/transfer/get-bank.action";
import { bankNameEnquiry } from "@/app/actions/transfer/bank-nameenquiry";
import Loader from "@/components/Loader";
import { walletTransfers } from "@/app/actions/wallet-transfer/transfer.action";
import SuccessModal from "@/components/SuccessModal";
import TransferPinModal from "../components/TransferPinModal";
import ConfirmTransferModal from "../components/ConfirmTransferModal";
import { toast } from "react-toastify";
import { bankTransfer } from "@/app/actions/transfer/bank-transfer.acrion";




export default function BankTransferPage() {
  const router = useRouter();
  const [account, setAccount] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [banks, setBanks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState();


  const [fullName, setFullName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [nameEquiry, SetNameEquiry] = useState("");
  const [narration, setNarration] = useState("");

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [transferAmount, setTransferAmount] = useState<number | null>(null);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");


  useEffect(() => {
    const load = async () => {
      const res = await getBanks();
      setBanks(res.data || []);
    };

    load();
  }, [])




  async function handleVerifyBanks() {
    const payload = {
      account_number: account,
      bank_code: bankCode,
    };

    try {
      setLoading(true);

      const res = await bankNameEnquiry(payload);
      console.log("NAME ENQUIRY", res);

      const isSuccess =
        res?.status === 'success' && res?.responseCode === "000";

      if (isSuccess) {
        const {
          account_name,
          account_number,
          bank_name,
          name_enquiry_ref,
        } = res.data;

        setFullName(account_name);
        setAccountNumber(account_number);
        setBankName(bank_name);
        SetNameEquiry(name_enquiry_ref);

        toast.success(res.message);

        setShowConfirmModal(true);
        return;
      }

      setErrors(res?.message || "Verification failed");
      toast.error(res?.message || "Verification failed");

    } catch (err) {
      toast.error("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }



  async function handleTransfer(pin: string) {
    const payload = {
      amount: transferAmount,
      destination_account: accountNumber,
      receipient_name: fullName,
      bank_code: bankCode,
      transaction_pin: pin,
      platform: "web",
      name_enquiry_ref: nameEquiry,
      description: narration


    };


    console.log('TRANSFER PAYLOAD', payload)

    try {
      setLoading(true);

      const res = await bankTransfer(payload);
      console.log('TRANSFER RESPONSE', res)

      if (res.responseCode === "000") {
        setShowPinModal(false);
        setShowConfirmModal(false);

        setSuccessMessage(res.message);
        setShowSuccessModal(true);
        return;
      }

      toast.error(res.message);
    } finally {
      setLoading(false);
    }
  }



  const isValid = account.length === 10 && bankCode.length > 0;
  return (
    <>

      <ConfirmTransferModal
        isOpen={showConfirmModal}
        fullName={fullName}
        accountNumber={accountNumber}
        bankName={bankName}
        onCancel={() => setShowConfirmModal(false)}
        onConfirm={(amount, narration) => {
          setTransferAmount(amount);
          setNarration(narration || "");
          setShowPinModal(true);
        }}
      />


      <TransferPinModal
        isOpen={showPinModal}
        fullName={fullName}
        accountNumber={accountNumber}
        bankName={bankName}
        onCancel={() => {
          setShowPinModal(false);
          setTransferAmount(null);
        }}
        onConfirm={(pin) => handleTransfer(pin)}
      />

      <SuccessModal
        isOpen={showSuccessModal}
        message={successMessage}
        onClose={() => setShowSuccessModal(false)}
      />


      <Loader show={loading} />

      <div className="min-h-screen bg-muted">

        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex cursor-pointer justify-center items-center gap-2 text-sm font-medium text-primary hover:opacity-70 w-fit"
          >
            <span className="text-lg">←</span>
            Back
          </button>

          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold text-primary">
                Transfer To Other Bank
              </h1>
              <button className="text-sm font-medium text-green-600 hover:underline">
                History
              </button>
            </div>

            {/* PROMO BANNER */}
            <div className="rounded-2xl bg-gradient-to-r from-yellow-600 to-primary text-white px-8 py-6 flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">
                  Get Up to ₦100 Cashback!
                </p>
                <p className="font-semibold mt-1">
                  Top up ₦100 – ₦1,000 & get cashback
                </p>

                <button className="mt-4 bg-black text-white text-sm px-4 py-2 rounded-lg">
                  Top up Now
                </button>
              </div>

              <div className="text-4xl font-bold">
                ₦100
              </div>
            </div>

            {/* FREE TRANSFERS */}
            <div className="bg-purple-50 text-purple-700 px-4 py-3 rounded-xl text-sm font-medium w-fit">
              ⚡ Free transfers for the day: <strong>3</strong>
            </div>

            {/* FORM CARD */}
            <div className="bg-background border border-border rounded-3xl p-10 max-w-6xl">

              <h2 className="text-lg font-semibold text-primary mb-6">
                Recipient Account
              </h2>

              <div className="space-y-5">

                {/* ACCOUNT NUMBER */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-primary">
                    Account Number
                  </label>
                  <input
                    value={account}
                    maxLength={10}
                    onChange={(e) =>
                      setAccount(e.target.value.replace(/\D/g, ""))
                    }
                    placeholder="Enter 10-digit account number"
                    className="w-full h-12 px-4 rounded-xl border border-border
                focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                  {errors &&
                    <p className="text-red-600 text-base">{errors}</p>
                  }
                </div>


                {/* BANK */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-primary">
                    Bank
                  </label>
                  {/* <select
                    value={bankCode}
                    onChange={(e) => setBankCode(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl border border-border bg-background
                focus:outline-none focus:ring-2 focus:ring-secondary"
                  > */}

                  <select
                    className="w-full h-12 px-4 rounded-xl border border-border bg-background
                focus:outline-none focus:ring-2 focus:ring-secondary"

                    value={bankCode}
                    onChange={(e) => {
                      const code = e.target.value;
                      setBankCode(code);

                      const selected = banks.find(b => b.bank_code === code);
                      setBankName(selected?.bank_name || "");

                    }}
                  >

                    <option value="">Select Bank</option>

                    {banks.map((b) => (
                      <option key={b.bank_code} value={b.bank_code}>
                        {b.bank_name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* NEXT BUTTON */}
                <button
                  onClick={handleVerifyBanks}
                  disabled={!isValid}
                  className={`w-full h-14  rounded-full font-semibold transition
                ${isValid
                      ? "bg-primary text-white hover:opacity-90 cursor-pointer"
                      : "bg-primary/80 text-white cursor-not-allowed"
                    }`}
                >
                  Next
                </button>
              </div>
            </div>

            {/* SUCCESS RATE */}
            <div className="bg-background border border-border rounded-2xl px-6 py-5 flex items-center justify-between hover:shadow-sm transition cursor-pointer max-w-2xl">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  📊
                </div>
                <p className="font-medium text-primary">
                  Bank Transfer Success Rate Monitor
                </p>
              </div>
              <span className="text-gray-400 text-xl">›</span>
            </div>
          </div>


        </div>
      </div>
    </>
  );
}
