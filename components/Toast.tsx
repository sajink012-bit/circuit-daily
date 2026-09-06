'use client'

export default function Toast({ message }: { message: string }) {
  return (
    <div className="fixed bottom-6 right-6 bg-gray-900 border border-gray-800 text-white px-4 py-3 rounded-lg shadow-lg text-sm z-50">
      {message}
    </div>
  )
}
