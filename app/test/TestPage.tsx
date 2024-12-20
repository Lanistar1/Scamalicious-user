import React from "react";
import Link from "next/link";

const TestPage = () => {
  return (
    <div>
      <div>
        <Link
          href={{
            pathname: "/verify",
            query: { code: "223344" },
          }}
        >
          <h2 className="text-red-700 text-3xl">Click me </h2>
        </Link>
      </div>
      <div>
        <Link
          href={{
            pathname: "/forgot-password",
            query: { code: "223344" },
          }}
        >
          <h2 className="text-red-700 text-3xl">Click me </h2>
        </Link>
      </div>
    </div>
  );
};

export default TestPage;
