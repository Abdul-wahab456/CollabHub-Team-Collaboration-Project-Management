"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const accessToken = searchParams.get("access_token");
    const refreshToken = searchParams.get("refresh_token");

    if (accessToken && refreshToken) {
      // Store in localStorage (simple demo)
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);

      // Optionally remove query params from URL
      router.replace("/dashboard");
    }
  }, [router, searchParams]);

  const accessToken = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      {accessToken ? (
        <p className="mt-4">✅ Logged in! Your access token is stored locally.</p>
      ) : (
        <p className="mt-4">⚠️ No access token found. Please log in.</p>
      )}
    </div>
  );
}
