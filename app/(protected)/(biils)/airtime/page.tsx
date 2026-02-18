"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import Loader from "@/components/Loader";
import SuccessModal from "@/components/SuccessModal";
import PurchasePinModal from "../components/PurchasePinModal";
import { toast } from "react-toastify";
import { getBalance } from "@/app/actions/dashboard/get-balance.action";
import { buyAirtime } from "@/app/actions/bills/airtime/buy-airtime.action";

// airtime providers list
const airtimeProviders = [
  { value: "mtn", label: "MTN", image: "/assets/images/airtime-data/mtn.png" },
  { value: "airtel", label: "Airtel", image: "/assets/images/airtime-data/airtel.png" },
  { value: "glo", label: "GLO", image: "/assets/images/airtime-data/glo.png" },
  { value: "etisalat", label: "9Mobile", image: "/assets/images/airtime-data/9mobile.png" },
];

export default function AirtimePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState("");

  const [phoneNumber, setPhoneNumber] = useState("");
  const [network, setNetwork] = useState<string>("");
  const [airtimeAmount, setAirtimeAmount] = useState<number | null>(null);

  const [showPinModal, setShowPinModal] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [balance, setBalance] = useState("•••••••");
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const load = async () => {
      const res = await getBalance();
      console.log("BALANCE FROMM WALLET", res);
      setBalance(res?.data?.balance ?? 0);
    };

    load();
  }, []);

  async function handleTransfer(pin: string) {
    if (!airtimeAmount || airtimeAmount < 100) {
    toast.error("Amount must be at least 100");
    return;
  }

    const payload = {
      amount: airtimeAmount,
      phone_number: phoneNumber,
      network_provider: network,
      transaction_pin: pin,
      platform: "web"
    };

    console.log("AIRTIME PAYLOAD", payload);

    try {
      setLoading(true);

      const res = await buyAirtime(payload);
      console.log("AIRTIME RESPONSE", res);

      if (res.responseCode === "000" && res.status === "success") {
        setShowPinModal(false);
        setSuccessMessage(res.message);
        setShowSuccessModal(true);

        try {
          const bal = await getBalance();
          setBalance(bal?.data?.balance ?? 0);
        } catch {}

        setNetwork("");
        setPhoneNumber("");
        setAirtimeAmount(null);
        setErrors("");

        return;
      }

      toast.error(res.message);
    } finally {
      setLoading(false);
    }
  }

  const isValid = network.length > 0 && phoneNumber.length === 11 && airtimeAmount !== null;
  return (
    <>
      <PurchasePinModal
        isOpen={showPinModal}
        onCancel={() => {
          setShowPinModal(false);
          setAirtimeAmount(null);
          setPhoneNumber("");
          setNetwork("");
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
            className="flex cursor-pointer justify-center items-center gap-2 text-sm font-medium text-primary hover:opacity-70 w-fit">
            <span className="text-lg">←</span>
            Back
          </button>

          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold text-primary">Buy Airtime</h1>
              <button className="text-sm font-medium text-green-600 hover:underline">
                History
              </button>
            </div>

            {/* PROMO BANNER */}
            <div className="rounded-2xl bg-gradient-to-r from-yellow-600 to-primary text-white px-8 lg:py-6 py-4 lg:flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Transfer to Other Banks</p>
                <p className="font-semibold mt-1">Use your balance to send money instantly</p>
                <div className="text-4xl font-bold lg:hidden mt-4">₦{balance.toLocaleString()}</div>
                <button className="mt-4 bg-black text-white text-sm px-4 py-2 rounded-lg">
                  Top up Now
                </button>
              </div>

              <div className="text-4xl font-bold hidden lg:block">₦{balance.toLocaleString()}</div>
            </div>

            {/* FREE TRANSFERS */}
            <div className="bg-purple-50 text-purple-700 px-4 py-3 rounded-xl text-sm font-medium w-fit">
              ⚡ Free airtime purchase for the day: <strong>3</strong>
            </div>

            {/* FORM CARD */}
            <div className="bg-background border border-border rounded-3xl p-10 max-w-6xl">
              <h2 className="text-lg font-semibold text-primary mb-6">Recipient Details</h2>

              <div className="space-y-5">
                {/* NETWORK */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-primary ">Mobile Operator</label>
                  <div className="flex gap-7.5 mt-2">
                    {airtimeProviders.map((provider) => (
                      <button
                        key={provider.value}
                        onClick={() => setNetwork(provider.value)}
                        className={`flex items-center gap-2 text-sm font-medium text-primary hover:opacity-80 cursor-pointer w-fit ${
                          network === provider.value ? "bg-gray-100" : ""
                        }`}>
                        <Image
                          src={provider.image}
                          alt={provider.label}
                          width={50}
                          height={50}
                          className={`${network === provider.value ? "opacity-100 scale-110" : "opacity-50"}`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* PHONE NUMBER */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-primary">Phone Number</label>
                  <input
                    value={phoneNumber}
                    maxLength={11}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                    placeholder="Enter 11-digit phone number"
                    className="w-full h-12 px-4 rounded-xl border border-border mt-2
                focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                  {errors && <p className="text-red-600 text-base">{errors}</p>}
                </div>

                {/* AMOUNT */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-primary ">Amount</label>
                  <input
                    value={airtimeAmount || ""}
                    onChange={(e) => setAirtimeAmount(Number(e.target.value.replace(/\D/g, "")))}
                    placeholder="Enter amount"
                    className="w-full h-12 px-4 rounded-xl border border-border mt-2
                focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                  {errors && <p className="text-red-600 text-base">{errors}</p>}
                </div>

                {/* NEXT BUTTON */}
                <button
                  onClick={() => setShowPinModal(true)}
                  disabled={!isValid}
                  className={`w-full h-14  rounded-full font-semibold transition
                ${
                  isValid
                    ? "bg-primary text-white hover:opacity-90 cursor-pointer"
                    : "bg-primary/80 text-white cursor-not-allowed"
                }`}>
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
                <p className="font-medium text-primary">Airtime Purchase Success Rate Monitor</p>
              </div>
              <span className="text-gray-400 text-xl">›</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
