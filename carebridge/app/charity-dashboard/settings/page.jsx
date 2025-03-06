"use client"; // Ensure this is a Client Component
import React, { useState, useEffect } from "react";
import axios from "axios";

const Settings = () => {
  const [charityInfo, setCharityInfo] = useState({
    name: "",
    description: "",
    email: "",
    logo: "",
    password: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [accessToken, setAccessToken] = useState(null); // Store token separately

  // Ensure localStorage is accessed only on the client
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      setAccessToken(token);
    }
  }, []);

  // Fetch charity data once accessToken is available
  useEffect(() => {
    if (!accessToken) return; // Prevent API call if token is not available

    const fetchCharityData = async () => {
      try {
        const response = await axios.get(
          "https://carebridge-backend-fys5.onrender.com/api/charity-settings",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setCharityInfo(response.data);
      } catch (err) {
        setError("Failed to load settings. Please try again.");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCharityData();
  }, [accessToken]); // Runs only when accessToken is set

  // Handle input change
  const handleChange = (e) => {
    setCharityInfo({ ...charityInfo, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!accessToken) {
      setError("Authentication error. Please log in again.");
      return;
    }

    try {
      await axios.patch(
        "https://carebridge-backend-fys5.onrender.com/api/charity-settings",
        charityInfo,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      alert("Settings Updated Successfully!");
    } catch (err) {
      setError("Failed to update settings. Please try again.");
      console.error("Update error:", err);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100 w-full">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Settings</h1>

      {/* Loading State */}
      {loading ? (
        <p className="text-center text-gray-600">Loading settings...</p>
      ) : (
        <div className="p-4 shadow-lg bg-white w-full max-w-2xl mx-auto rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              name="name"
              value={charityInfo.name}
              onChange={handleChange}
              placeholder="Charity Name"
              className="p-2 border rounded-md"
            />
            <input
              type="email"
              name="email"
              value={charityInfo.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="p-2 border rounded-md"
            />
            <textarea
              name="description"
              value={charityInfo.description}
              onChange={handleChange}
              placeholder="Charity Description"
              className="p-2 border rounded-md"
            />
            <input
              type="password"
              name="password"
              value={charityInfo.password}
              onChange={handleChange}
              placeholder="New Password"
              className="p-2 border rounded-md"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Save Changes
            </button>
          </form>
        </div>
      )}

      {/* Danger Zone */}
      <div className="p-4 shadow-lg bg-white w-full max-w-2xl mx-auto mt-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-red-600">Danger Zone</h2>
        <button className="bg-red-500 text-white px-4 py-2 rounded w-full hover:bg-red-600">
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default Settings;
