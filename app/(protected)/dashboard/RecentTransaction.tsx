import React from 'react'

export default function RecentTransaction() {
  return (
        <div className="bg-white rounded-3xl p-7">
        <h3 className="font-semibold mb-6 text-primary">Recent Transactions</h3>

        <div className="space-y-4">
          <div className="flex justify-between bg-[#F7F7F7] p-4 rounded-xl">
            <span>Transfer to John Doe</span>
            <span className="text-red-500 font-semibold">− ₦5,000</span>
          </div>
          <div className="flex justify-between bg-[#F7F7F7] p-4 rounded-xl">
            <span>Salary credit</span>
            <span className="text-green-600 font-semibold">+ ₦150,000</span>
          </div>
          <div className="flex justify-between bg-[#F7F7F7] p-4 rounded-xl">
            <span>Airtime purchase</span>
            <span className="text-red-500 font-semibold">− ₦2,000</span>
          </div>
        </div>
      </div>
  )
}
