"use client";

import { useEffect, useState } from "react";
//import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Verify() {
  const [status, setStatus] = useState(null); // Store the status of the API call
  const [message, setMessage] = useState(""); // Store the response message
  const [isLoading, setIsLoading] = useState(true); // To track the loading state
  const [showModal, setShowModal] = useState(false); // To control the modal visibility
  const [code, setCode] = useState("");

  //const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const queryCode = params.get("code") || ""; // Extract the code
    setCode(queryCode); // Update state with the extracted code
  }, []);

  useEffect(() => {
    if (code) {
      const verifyEmail = async () => {
        try {
          const response = await fetch(
            "https://server.thescamalicious.com/auth/verify-email",
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json", // Specify JSON content
              },
              body: JSON.stringify({ code }), // Send code in the request body
            }
          );

          const result = await response.json(); // Parse JSON response

          if (response.ok) {
            setStatus("success");
            setMessage(result.message); // Set the success message
          } else {
            setStatus("fail");
            setMessage(
              result.message || "Verification failed. Please try again."
            );
          }
        } catch (error) {
          console.log(error);
          setStatus("fail");
          setMessage("An error occurred. Please try again.");
        } finally {
          setIsLoading(false); // Hide loader after verification
          setShowModal(true); // Show modal after verification is complete
        }
      };

      verifyEmail();
    }
  }, [code]); // Dependency on code to ensure API call happens when code is set

  // Modal Component
  const Modal = ({ status, message }) => (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white shadow-lg rounded-lg p-8 text-center max-w-sm">
        {status === "success" ? (
          <p className="text-green-600 text-xl font-bold">{message}</p>
        ) : (
          <p className="text-red-600 text-xl font-bold">{message}</p>
        )}
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
          onClick={() => setShowModal(false)} // Close modal button
        >
          Close
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex items-center justify-center w-full h-screen bg-gray-100">
      {/* Loader */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
          <div className="loader border-t-4 border-b-4 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
        </div>
      )}

      {/* Modal */}
      {showModal && <Modal status={status} message={message} />}

      {/* Verification Content */}
      <div className="bg-white shadow-lg rounded-lg p-8 text-center flex flex-col items-center justify-center">
        <Image
          src="/assets/images/verify-email.png"
          alt="Verifying Email"
          width={150}
          height={150}
        />
        <p className="mt-4">Verifying your email, please wait...</p>
      </div>
    </div>
  );
}
