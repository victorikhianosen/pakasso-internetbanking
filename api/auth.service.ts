"use server";

import { cookies } from "next/headers";

import { privateHeaders, publicHeaders } from "@/lib/httpHeaders";

const baseUrl = process.env.BASE_URL;


// import { publicHeaders } from "@/lib/httpHeaders";

export async function login(payload: any) {
    const res = await fetch(`${baseUrl}/api/customers/login`, {
        method: "POST",
        headers: publicHeaders(),
        body: JSON.stringify(payload),
    });

    const result = await res.json();
    console.log(process.env.NODE_ENV);


    if (result?.status === "success") {
        const token = result.data.access_token;
        const expiresAt = new Date(result.data.expired_at);

        const cookieStore = await cookies();
        console.log(process.env.NODE_ENV);

        cookieStore.set("access_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            expires: expiresAt,
            path: "/",
        });
    }

    return result;
}


export async function sendPhoneOtp(payload: any) {

    const res = await fetch(`${baseUrl}/api/customers/phone-otp`, {
        method: "POST",
        headers: publicHeaders(),
        body: JSON.stringify(payload),
    });

    return res.json();
}


export async function resentOtp(payload: any) {
    const res = await fetch(`${baseUrl}/api/customers/phone/resend-otp`, {
        method: "POST",
        headers: publicHeaders(),
        body: JSON.stringify(payload),
    });

    return res.json();
}

export async function verifyPhoneOtp(payload: any) {
    const res = await fetch(`${baseUrl}/api/customers/phone-verify`, {
        method: "POST",
        headers: publicHeaders(),
        body: JSON.stringify(payload),
    });

    return res.json();
}

export async function verifyBVN(payload: any) {
    const res = await fetch(`${baseUrl}/api/customers/bvn`, {
        method: "POST",
        headers: publicHeaders(),
        body: JSON.stringify(payload),
    });

    return res.json();
}

export async function registerAccount(payload: any) {
    const res = await fetch(`${baseUrl}/api/customers/register`, {
        method: "POST",
        headers: publicHeaders(),
        body: JSON.stringify(payload),
    });

    return res.json();
}


export async function forgotPassword(payload: any) {
    const res = await fetch(`${baseUrl}/api/customers/forget-password`, {
        method: "POST",
        headers: publicHeaders(),
        body: JSON.stringify(payload),
    });

    return res.json();
}


export async function resetPassword(payload: any) {
    const res = await fetch(`${baseUrl}/api/customers/reset-password`, {
        method: "POST",
        headers: publicHeaders(),
        body: JSON.stringify(payload),
    });
    return res.json();
}

