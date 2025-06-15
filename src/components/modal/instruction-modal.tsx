export default function InstructionModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 flex justify-center items-center z-50"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.80)" }}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md text-center">
        <h2 className="text-xl font-bold mb-4 text-pink-600">
          Photo Instructions
        </h2>
        <p className="mb-4 text-gray-700">For accurate skin analysis:</p>
        <ul className="text-left mb-4 text-sm text-gray-600 list-disc list-inside">
          <li>Pull hair back.</li>
          <li>Make sure that you’re in a well-lit environment.</li>
          <li> Face the camera directly with your face centered.</li>
          <li>No glasses,No makeup</li>
        </ul>
        <button
          onClick={onClose}
          className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 transition"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
