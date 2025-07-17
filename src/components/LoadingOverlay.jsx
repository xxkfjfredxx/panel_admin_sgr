// components/LoadingOverlay.jsx
export default function LoadingOverlay({ text = "Procesando..." }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500 mx-auto mb-4"></div>
        <p className="text-lg font-medium text-gray-700 dark:text-gray-200">{text}</p>
      </div>
    </div>
  );
}
