"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { jwtDecode } from "jwt-decode";

const SelectRole = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SelectRoleContent />
    </Suspense>
  );
};

const SelectRoleContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("Search Params:", searchParams.toString());
    console.log("Token from URL:", token);
  }, [searchParams, token]);

  const handleRoleSelection = async (role) => {
    if (!token) {
      console.error("Token is undefined");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("https://carebridge-backend-fys5.onrender.com/auth/select-role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role }),
      });

      const data = await response.json();
      console.log("Response from backend:", data);

      if (response.ok) {
        localStorage.setItem("role", role);
        router.push(data.redirect || "/fallback-route");
      } else {
        console.error("Error selecting role:", data.error || "Unknown error");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Check for existing login session and redirect
  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");

    if (storedToken) {
      try {
        const decodedToken = jwtDecode(storedToken);
        const role = decodedToken.role;

        if (role === "admin") {
          router.push("/admin-dashboard");
        } else if (role === "charity") {
          router.push("/charity-dashboard");
        } else if (role === "donor") {
          router.push("/donor-dashboard");
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        localStorage.removeItem("access_token");
        router.push("/login");
      }
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Select Your Role</h1>
        <button
          onClick={() => handleRoleSelection("donor")}
          className={`w-full py-2 rounded mb-2 text-white ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
          disabled={loading}
        >
          {loading ? "Processing..." : "Donor"}
        </button>
        <button
          onClick={() => handleRoleSelection("charity")}
          className={`w-full py-2 rounded mb-2 text-white ${loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"}`}
          disabled={loading}
        >
          {loading ? "Processing..." : "Charity"}
        </button>
        <button
          onClick={() => handleRoleSelection("admin")}
          className={`w-full py-2 rounded text-white ${loading ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"}`}
          disabled={loading}
        >
          {loading ? "Processing..." : "Admin"}
        </button>
      </div>
    </div>
  );
};

export default SelectRole;
