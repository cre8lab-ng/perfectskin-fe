import React from "react";

export default function InstructionModal({
  onTakeSelfie,
  onUploadPhoto,
}: {
  onTakeSelfie: () => void;
  onUploadPhoto: () => void;
}) {
  return (
    <div
    className="fixed inset-0 flex justify-center items-center z-50"
    style={{ backgroundColor: "rgba(0, 0, 0, 0.80)" }}
  >
      <div className="bg-white p-6 rounded-lg w-full max-w-md text-center space-y-4">
        <h2 className="text-lg font-bold">Before You Start</h2>
        <ul className="text-sm text-left list-disc pl-5">
          <li>Take off your glasses and make sure bangs are not covering your forehead.</li>
          <li>Ensure you&apos;re in a well-lit environment.</li>
          <li>Remove makeup for accurate results.</li>
          <li>Look straight into the camera with your face centered.</li>
        </ul>

        <div className="flex flex-col gap-3 mt-4">
          <button
            onClick={onTakeSelfie}
            className="bg-pink-600 text-white py-2 rounded hover:bg-pink-700"
          >
            Take a Selfie
          </button>
          <button
            onClick={onUploadPhoto}
            className="bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300"
          >
            Upload a Photo
          </button>
        </div>
      </div>
    </div>
  );
}
