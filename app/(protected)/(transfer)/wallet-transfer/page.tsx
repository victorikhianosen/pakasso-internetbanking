"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import { verifyBankAccount } from "@/lib/api/transfer/verifyBank";
import { toast } from "react-toastify";
import { walletNameEnquiry } from "@/app/actions/wallet-transfer/name-enquiry.action";
import { serverLogout } from "@/app/actions/auth/logout.action";
import { walletTransfers } from "@/app/actions/wallet-transfer/transfer.action";
import ConfirmTransferModal from "../components/ConfirmTransferModal";
import TransferPinModal from "../components/TransferPinModal";
import SuccessModal from "@/components/SuccessModal";




export default function WalletTransferPage() {
  const router = useRouter();
  const [account, setAccount] = useState("");
  const [bank, setBank] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fullName, setFullName] = useState("");

  const [accountNumber, setAccountNumber] = useState("");
  const [bankName, setBankName] = useState("Pakasso Credit Capital Ltd");

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [transferAmount, setTransferAmount] = useState<number | null>(null);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");




  async function handleNameEnquiry(e: React.FormEvent) {
    e.preventDefault();

    if (!account)
      return setError("Account number is required"),
        toast.error("Account number is required");

    if (account.length !== 10)
      return setError("Account number must be 11 digits"),
        toast.error("Account number must be 11 digits");



    const payload = {
      account_number: account
    }

    setLoading(true)

    try {
      const res = await walletNameEnquiry(payload);
      console.log("Wallet Form:", res);

      if (res?.responseCode === "000") {
        const { first_name, last_name, account_number } = res.data;

        const name = `${first_name ?? ""} ${last_name ?? ""}`.trim();
        setFullName(name);
        setAccountNumber(account_number);

        toast.success(res.message);

        setShowConfirmModal(true);


        return;
      }


      if (res?.responseCode === "400") {
        toast.error(res.message || "Session expired");

        await serverLogout();

        router.replace("/login");
        return;
      }

      if (res?.responseCode === "401") {
        toast.error(res.message || "Session expired");

        await serverLogout();

        router.replace("/login");
        return;
      }
      setLoading(false)

      if (res?.responseCode === "422") {
        const msg =
          res?.errors?.account_number?.[0] ||
          res?.message ||
          "Invalid account number";

        setError(msg);
        toast.error(msg);
        return;
      }
      toast.error(res?.message || "Account verification failed");
      setError(res?.message)
      return;
    } catch (error) {
      console.error("Name enquiry error:", error);
      toast.error("Unable to verify account. Try again.");
    } finally {
      setLoading(false);
    }



  }


  async function handleTransfer(pin: string) {

    // example payload
    const payload = {
      amount: transferAmount,
      destination_account: accountNumber,
      receipient_name: fullName,
      transaction_pin: pin,
      platform: 'web'
    };
    console.log('PayLoad..', payload)

    try {
      setLoading(true)
      const result = await walletTransfers(payload);
      if (result.responseCode === '000') {
        toast.info(result.message);
        setShowPinModal(false);
        setSuccessMessage(result.message);
        setShowConfirmModal(false);
        setShowSuccessModal(true); return;
      }
      if (result.responseCode == '30') {
        toast.error(result.message);
        setError(result.message)
        setShowPinModal(true)
        setLoading(false)
        return;
      }
      console.log(result);
      setLoading(false)
      toast.error(result.message);
      return;

    } catch (error) {

    } finally {
      setLoading(false)
    }

    // call transfer API here
  }


  return (
    <>




      <ConfirmTransferModal
        isOpen={showConfirmModal}
        fullName={fullName}
        accountNumber={accountNumber}
        bankName={bankName}
        onCancel={() => setShowConfirmModal(false)}
        onConfirm={(amount) => {
          setTransferAmount(amount);
          setShowPinModal(true); // Confirm stays open
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
          setError(""); // optional clear
        }}
        onConfirm={(pin) => {
          handleTransfer(pin);

          setShowPinModal(false);


        }}
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
                Transfer To Pakasso Account
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
            <form onSubmit={handleNameEnquiry} className="bg-background border border-border rounded-3xl p-10 max-w-6xl">

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
                  {error && (
                    <p className="text-xs text-red-600 mt-1">
                      {error}
                    </p>
                  )}
                </div>

                {/* {fullName} */}

                {/* NEXT BUTTON */}
                <button
                  className={`w-full cursor-pointer h-14 rounded-full font-semibold transition bg-primary text-white
                `}
                >
                  Next
                </button>
              </div>
            </form>

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
