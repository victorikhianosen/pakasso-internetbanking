"use server";

import { cookies } from "next/headers";
import { privateHeaders } from "@/lib/httpHeaders";

const baseUrl = process.env.BASE_URL;

export async function walletNameEnquiry(payload: any) {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;
    if (!token) {

        return {
            success: 'error',
            responseCode: '401',
            message: "Unauthenticated",
        };
    }
    try {
        const res = await fetch(
            `${baseUrl}/api/transactions/wallet/verify-account`,
            {
                method: "POST",
                headers: privateHeaders(token),
                cache: "no-store",
                body: JSON.stringify(payload),
            }
        );

        const data = await res.json();
        return data;
    } catch (error: any) {
        console.error("SERVER ACTION ERROR:", error);

        return {
            success: 'error',
            message: "Something went wrong",
        };
    }
}
