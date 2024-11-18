import React from 'react'
import Link from "next/link";


const TestPage = () => {
  return (
    <div >
      <Link href="/forgot-password">
        <h2 className="text-red-700 text-3xl">Click me </h2>
      </Link>
    </div>
  )
}

export default TestPage
