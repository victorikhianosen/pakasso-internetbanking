"use client";

import React, { useEffect, useRef, useState } from "react";
import SideBar from "../../../features/auth/components/SideBar";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { resetPassword, forgotPassword } from "@/features/auth/services/auth.service";
import { toast } from "react-toastify";
import Loader from "@/components/shared/Loader";

export default function ResetPasswordPage() {
  const router = useRouter();

  const resetEmail = typeof window !== "undefined" ? sessionStorage.getItem("reset_email") : "";

  const RESEND_TIMEOUT = 10;

  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [timeLeft, setTimeLeft] = useState(RESEND_TIMEOUT);
  const [canResend, setCanResend] = useState(false);

  const inputsRef = useRef<HTMLInputElement[]>([]);

  /* -------------------------------
     REDIRECT IF EMAIL MISSING
  -------------------------------- */
  useEffect(() => {
    if (!resetEmail) {
      router.replace("/forgot-password");
    }
  }, [resetEmail, router]);

  /* -------------------------------
     COUNTDOWN
  -------------------------------- */
  useEffect(() => {
    if (timeLeft <= 0) {
      setCanResend(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  /* -------------------------------
     OTP HANDLERS
  -------------------------------- */
  const handleOtpChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key !== "Backspace") return;

    const updated = [...otp];

    if (updated[index]) {
      updated[index] = "";
    } else if (index > 0) {
      updated[index - 1] = "";
      inputsRef.current[index - 1]?.focus();
    }

    setOtp(updated);
    e.preventDefault();
  };

  /* -------------------------------
     PASSWORD RULES
  -------------------------------- */
  const passwordValid =
    password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password);

  const passwordsMatch = password && confirmPassword && password === confirmPassword;

  /* -------------------------------
     SUBMIT
  -------------------------------- */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const code = otp.join("");

    if (code.length !== 6) {
      toast.error("Enter the 6-digit OTP");
      return;
    }

    if (!passwordValid) {
      toast.error("Password does not meet requirements");
      return;
    }

    if (!passwordsMatch) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        email: resetEmail as string,
        otp_code: code,
        password,
      };
      
      const res = await resetPassword(payload);

      if (res?.status === "success" && res.responseCode === "000") {
        toast.success(res.message || "Password reset successful");
        sessionStorage.removeItem("reset_email");
        router.replace("/login");
        return;
      }

      if (res?.status === "error" && res?.errors) {
        const errors = res.errors as Record<string, string[]>;
        const firstKey = Object.keys(errors)[0];
        const firstError = firstKey ? errors[firstKey][0] : null;

        if (firstError) {
          toast.error(firstError);
          return;
        }
      }

      toast.error(res?.message || "Request failed");
    } catch {
      toast.error("Password reset failed");
    } finally {
      setLoading(false);
    }
  }

  /* -------------------------------
     RESEND OTP
  -------------------------------- */
  async function handleResendOtp() {
    if (!canResend || !resetEmail) return;

    setLoading(true);

    try {
      const res = await forgotPassword({ email: resetEmail });

      if (res?.status === "success" && res.responseCode === "000") {
        toast.success(res.message);
        setTimeLeft(RESEND_TIMEOUT);
        setCanResend(false);
        return;
      }

      toast.error(res?.message || "Failed to resend OTP");
    } catch {
      toast.error("Unable to resend OTP");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Loader show={loading} />

      <div className="min-h-screen flex bg-[#F7F7F7]">
        <SideBar />

        <div className="w-full lg:w-1/2 flex items-center justify-center px-6">
          <div className="w-full max-w-md">
            <div className="flex justify-center mb-8">
              <Image
                src="/assets/images/logo.png"
                alt="logo"
                width={200}
                height={100}
                className="h-12"
              />
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex justify-center gap-3">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => {
                      if (el) {
                        inputsRef.current[i] = el;
                      }
                    }}
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(e.target.value, i)}
                    onKeyDown={(e) => handleKeyDown(e, i)}
                    className="w-12 h-14 text-center text-xl border rounded-xl text-black"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={loading || !passwordValid || !passwordsMatch}
                className="w-full py-3 rounded-lg bg-primary text-white font-semibold disabled:opacity-50">
                Reset Password
              </button>
            </form>

            <div className="text-center mt-8">
              {canResend ? (
                <button onClick={handleResendOtp} className="text-primary font-semibold">
                  Resend OTP
                </button>
              ) : (
                <p className="text-gray-500">
                  Resend OTP in <span className="font-semibold">{formatTime(timeLeft)}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
