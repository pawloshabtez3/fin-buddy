import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">Welcome to FinBuddy</h1>
        <p className="text-xl text-gray-600 mb-8">AI-Powered Personal Finance Assistant</p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="px-6 py-3 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </main>
  );
}
