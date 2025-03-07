"use client";

import React, { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const DashboardPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
};

const DashboardContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      router.push("/login");
    } else {
      localStorage.setItem("token", token);
      console.log("Token stored:", token);
    }
  }, [token, router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
        Welcome to the Dashboard!
      </h1>
      <p className="text-center text-gray-700">
        This is a test web page to show that Google authentication works.
        <br />
        The site is still under construction.
      </p>
      <button
        onClick={handleLogout}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
};

export default DashboardPage;
