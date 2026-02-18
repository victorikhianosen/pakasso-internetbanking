"use client";

import { useEffect, useRef, useState } from "react";
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
import { getBalance } from "@/app/actions/dashboard/get-balance.action";
import Select from "react-select";




export default function BankTransferPage() {
  const router = useRouter();
  const [account, setAccount] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [banks, setBanks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState("");


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

  const [balance, setBalance] = useState("•••••••");
  const hasFetched = useRef(false);


  useEffect(() => {
    const load = async () => {
      const res = await getBanks();
      setBanks(res.data || []);
    };

    load();
  }, [])



  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const load = async () => {
      const res = await getBalance();
      console.log("BALANCE FROMM WALLET", res);
      setBalance(res?.data?.balance ?? 0);
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

        try {
          const bal = await getBalance();
          setBalance(bal?.data?.balance ?? 0);
        } catch { }

        setAccount("");
        setAccountNumber("");
        setBankCode("");
        setBankName("");
        setFullName("");
        SetNameEquiry("");
        setNarration("");
        setTransferAmount(null);
        setErrors("");

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
                  Transfer to Other Banks
                </p>
                <p className="font-semibold mt-1">
                  Use your balance to send money instantly
                </p>

                <button className="mt-4 bg-black text-white text-sm px-4 py-2 rounded-lg">
                  Top up Now
                </button>
              </div>

              <div className="text-4xl font-bold">
                ₦{balance.toLocaleString()}
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

                  <div className="w-full">
                    <Select
                      options={banks.map((b) => ({
                        value: b.bank_code,
                        label: b.bank_name,
                      }))}
                      placeholder="Search & select bank"
                      value={
                        bankCode
                          ? {
                            value: bankCode,
                            label: bankName,
                          }
                          : null
                      }
                      onChange={(selected: any) => {
                        setBankCode(selected?.value || "");
                        setBankName(selected?.label || "");
                      }}
                      isSearchable
                      menuPortalTarget={typeof window !== "undefined" ? document.body : null}
                      menuPosition="fixed"
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          height: 48,
                          borderRadius: "12px",
                          borderColor: state.isFocused ? "#6366f1" : "#e5e7eb",
                          boxShadow: "none",
                          paddingLeft: "4px",
                          "&:hover": { borderColor: "#6366f1" },
                        }),
                        valueContainer: (base) => ({
                          ...base,
                          padding: "0 8px",
                        }),
                        menu: (base) => ({
                          ...base,
                          borderRadius: "12px",
                          overflow: "hidden",
                          zIndex: 9999,
                        }),
                      }}
                    />
                  </div>
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
