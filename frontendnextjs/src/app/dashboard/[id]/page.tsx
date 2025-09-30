"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import OverviewContent from "@/components/overview-content";
import React from "react";

interface JwtPayload {
  sub: number;
  email: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [userInfo, setUserInfo] = useState<JwtPayload | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.replace("/auth/login");
    } else {
      const decoded = parseJwt(token);
      setUserInfo(decoded);
      setReady(true);
    }
  }, [router]);

  if (!ready) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-balance text-2xl font-semibold">
        Project Overview {userInfo?.email && `- Welcome ${userInfo.email}`}
      </h1>
      <OverviewContent />
    </div>
  );
}

function parseJwt(token: string): JwtPayload | null {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload) as JwtPayload;
  } catch (error) {
    return null;
  }
}
