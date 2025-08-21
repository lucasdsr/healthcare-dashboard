export default function TestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-500 to-blue-500 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-2xl text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          🎨 Tailwind CSS Test
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          If you can see this styled page, Tailwind is working!
        </p>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-red-100 p-4 rounded-lg border border-red-300">
            <div className="text-2xl">🔴</div>
            <div className="text-red-800 font-semibold">Red Box</div>
          </div>
          <div className="bg-green-100 p-4 rounded-lg border border-green-300">
            <div className="text-2xl">🟢</div>
            <div className="text-green-800 font-semibold">Green Box</div>
          </div>
          <div className="bg-blue-100 p-4 rounded-lg border border-blue-300">
            <div className="text-2xl">🔵</div>
            <div className="text-blue-800 font-semibold">Blue Box</div>
          </div>
        </div>
      </div>
    </div>
  );
}
