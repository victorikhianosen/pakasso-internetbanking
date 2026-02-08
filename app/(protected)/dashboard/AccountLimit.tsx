import { useAuth } from '@/context/AuthContext';
import React from 'react'

export default function AccountLimit() {
    
  return (
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="relative overflow-hidden bg-primary text-white rounded-3xl p-6">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#fee028]/10 rounded-full"></div>
          <div className="relative space-y-4">
            <p className="text-sm opacity-80">Account limits {name}fffjf</p>
            <p className="text-2xl font-semibold">₦500,000</p>

            <div>
              <div className="flex justify-between text-xs opacity-70">
                <span>Used ₦85,000</span>
                <span>Available</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full mt-1">
                <div
                  className="h-full bg-[#fee028]"
                  style={{ width: "17%" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ACCOUNT STATS */}
        <div className="md:col-span-2 bg-white rounded-2xl p-6">
          <h3 className="font-semibold mb-4 text-primary">My Accounts</h3>

          <div className="space-y-4">
            <div className="flex justify-between bg-[#F7F7F7] p-4 rounded-xl">
              <span>Highest Transaction</span>
              <span className="font-semibold">₦120,000</span>
            </div>
            <div className="flex justify-between bg-[#F7F7F7] p-4 rounded-xl">
              <span>Lowest Transaction</span>
              <span className="font-semibold">₦5,300</span>
            </div>
          </div>
        </div>
      </div>
  )
}
