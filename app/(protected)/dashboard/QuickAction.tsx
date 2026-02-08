import React from "react";
import Link from "next/link";

export default function QuickAction() {
  const actions = [
    {
      label: "To Pakasso",
      color: "#fee028",
      href: "/wallet-transfer",
    },
    {
      label: "To Bank",
      color: "#16A34A",
      href: "/bank-transfer",
    },
    {
      label: "Buy Airtime",
      color: "#1D4ED8",
      href: "/airtime",
    },
    {
      label: "Buy Data",
      color: "#E4002B",
      href: "/data",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {actions.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className="bg-white rounded-2xl p-5 text-center hover:shadow-md transition cursor-pointer"
        >
          <div
            className="mx-auto w-10 h-10 mb-3 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          <p className="font-medium text-primary">{item.label}</p>
        </Link>
      ))}
    </div>
  );
}
