"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  User,
  Mail,
  Phone,
  CreditCard,
  Shield,
  ChevronRight,
  Camera,
  ArrowLeft,
} from "lucide-react";

type UserType = {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  accountno?: string;
  bvn?: string;
};

export default function ProfilePage() {
  const { user } = useUser() as { user: UserType | null };

  const [cachedUser, setCachedUser] = useState<UserType | null>(null);
  const displayUser = user || cachedUser;

  useEffect(() => {
    const saved = localStorage.getItem("cachedUser");
    if (saved) setCachedUser(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("cachedUser", JSON.stringify(user));
      setCachedUser(user);
    }
  }, [user]);

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-10">
      <ProfileHeader user={displayUser} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ProfileDetails user={displayUser} />
      </div>
    </div>
  );
}

function ProfileHeader({ user }: { user: UserType | null }) {
  const router = useRouter();

  return (
    <>
      <button
        onClick={() => router.back()}
        className="flex cursor-pointer items-center gap-2 mb-4 text-sm font-medium text-primary hover:-translate-x-1 transition"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-[#1f272f] text-white p-10 shadow-xl">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
            <div className="w-28 h-28 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-4xl font-bold">
              {user?.first_name?.[0] || "U"}
            </div>

            <button className="absolute -bottom-1 -right-1 bg-white text-primary p-2 rounded-full shadow hover:scale-95 transition">
              <Camera size={16} />
            </button>
          </div>

          <div className="text-center md:text-left">
            <h1 className="text-3xl font-semibold capitalize tracking-tight">
              {user?.first_name} {user?.last_name}
            </h1>

            <p className="opacity-80 text-sm mt-1">{user?.email}</p>

            <Link
              href="/edit-profile"
              className="inline-block mt-4 bg-white text-primary px-5 py-2 rounded-xl text-sm font-semibold hover:scale-95 transition"
            >
              Edit Profile
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

function ProfileDetails({ user }: { user: UserType | null }) {
  return (
    <div className="md:col-span-2 bg-white rounded-3xl p-7 shadow-sm border border-gray-100">
      <h3 className="font-semibold text-primary mb-6 text-lg">
        Personal Information
      </h3>

      <div className="divide-y">
        <Row icon={<User size={18} />} label="Full Name">
          {user?.first_name} {user?.last_name}
        </Row>

        <Row icon={<Mail size={18} />} label="Email">
          {user?.email || "—"}
        </Row>

        <Row icon={<Phone size={18} />} label="Phone">
          {user?.phone || "—"}
        </Row>

        <Row icon={<CreditCard size={18} />} label="Account Number">
          {user?.accountno || "—"}
        </Row>

        <Row icon={<Shield size={18} />} label="BVN">
          {user?.bvn || "—"}
        </Row>
      </div>
    </div>
  );
}

function Row({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
      <div className="flex items-center gap-3 text-gray-500 text-sm">
        {icon}
        {label}
      </div>
      <span className="font-medium text-primary text-sm">{children}</span>
    </div>
  );
}

function ActionLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between py-4 hover:translate-x-1 transition text-sm font-medium text-primary"
    >
      {label}
      <ChevronRight size={16} />
    </Link>
  );
}
