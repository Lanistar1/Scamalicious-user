"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
//import { useRouter } from 'next/navigation';

interface FormData {
  code: string;
  password: string;
  confirmPassword: string; // Added confirmPassword field
}

const ForgotPassword: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    code: "",
    password: "",
    confirmPassword: "", // Initialize confirmPassword
  });
  const [status, setStatus] = useState<string | null>(null); // API call status
  const [message, setMessage] = useState<string>(""); // Response message
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [showModal, setShowModal] = useState(false); // Modal visibility
  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({}); // Validation errors

  //const router = useRouter();

  useEffect(() => {
    // Extract the `code` from the query string using `window.location.search`
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code") || ""; // Default to an empty string if `code` is not present
    setFormData((prev) => ({ ...prev, code }));
  }, []);

  const validateFields = (): boolean => {
    const newErrors: { password?: string; confirmPassword?: string } = {};

    if (!formData.password) {
      newErrors.password = "Password cannot be empty.";
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateFields()) {
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch(
        "https://server.thescamalicious.com/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code: formData.code,
            newPassword: formData.password,
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage(result.message || "Password reset successfully!");

        // Clear the password fields
        setFormData((prev) => ({
          ...prev,
          password: "",
          confirmPassword: "",
        }));
      } else {
        setStatus("fail");
        setMessage(result.message || "Failed to reset password.");
      }
    } catch (error) {
      console.error(error);
      setStatus("fail");
      setMessage("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
      setShowModal(true);
    }
  };

  // Modal Component
  const Modal: React.FC<{ status: string | null; message: string }> = ({
    status,
    message,
  }) => (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white shadow-lg rounded-lg p-8 text-center max-w-sm">
        {status === "success" ? (
          <p className="text-green-600 text-xl font-bold">{message}</p>
        ) : (
          <p className="text-red-600 text-xl font-bold">{message}</p>
        )}
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
          onClick={() => {
            setShowModal(false);
          }}
        >
          Close
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen">
      {/* Left Section */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-b from-[#023A5F] via-[#606CB6] to-[#9493DF] justify-center items-center">
        <div className="text-center">
          <Image
            src="/assets/images/logo.png"
            alt="SCAMalicious Logo"
            width={200}
            height={200}
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-gray-100 p-6 sm:p-8">
        <Image
          src="/assets/images/logo.png"
          alt="SCAMalicious Logo"
          width={80}
          height={80}
        />
        <h2 className="text-2xl font-normal text-[#A52A2A] mt-4">
          Reset Password
        </h2>

        <form
          className="mt-8 w-full md:w-1/2 space-y-4"
          onSubmit={handleSubmit}
        >
          {/* <div>
            <label className="block text-[#384554]">Code</label>
            <div className="relative mt-1">
              <input
                type="text"
                name="code"
                value={formData.code}
                className="w-full p-3 rounded-md bg-gray-200 cursor-not-allowed focus:outline-none"
                readOnly
              />
            </div>
          </div> */}
          <div>
            <label className="block text-[#384554]">New Password</label>
            <div className="relative mt-1">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                placeholder="Enter New Password"
                className={`w-full p-3 mb-1 rounded-md focus:outline-none focus:border-gray-400 ${
                  errors.password ? "border-red-500" : ""
                }`}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>
          </div>
          <div>
            <label className="block text-[#384554]">Confirm Password</label>
            <div className="relative mt-1">
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
                placeholder="Confirm Password"
                className={`w-full p-3 mb-1 rounded-md focus:outline-none focus:border-gray-400 ${
                  errors.confirmPassword ? "border-red-500" : ""
                }`}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className={`w-full py-3 ${
              isLoading ? "bg-gray-400" : "bg-[#A52A2A]"
            } text-white text-base rounded-md`}
            disabled={isLoading}
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>

      {/* Modal */}
      {showModal && <Modal status={status} message={message} />}
    </div>
  );
};

export default ForgotPassword;
