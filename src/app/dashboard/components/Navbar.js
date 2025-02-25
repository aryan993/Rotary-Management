"use client"
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Rotary Management App</h1>
        <div className="flex space-x-4">
          <Link href="/dashboard/home">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              New Home
            </button>
          </Link>
          <Link href="/">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Home
            </button>
          </Link>
          <Link href="/dashboard/new_user">
            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
              Create Member
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}