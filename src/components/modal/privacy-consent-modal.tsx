import { useState } from "react";

export default function PrivacyConsentModal({
  onAgree,
}: {
  onAgree: () => void;
}) {
  const [agreed, setAgreed] = useState(false);

  return (
    <div
      className="fixed inset-0 flex justify-center items-center z-50"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.80)" }}
    >
      {" "}
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg text-center relative">
        <h2 className="text-lg font-bold mb-4">PRIVACY CONSENT</h2>
        <p className="text-sm text-gray-700 mb-4">
          The skin analysis feature requires access to your camera and may
          collect, process, or analyze a scan of your face. This may include
          facial geometry and other biometric data for the purpose of assessing
          your skin condition.
        </p>

        <label className="flex items-center justify-center gap-2 text-sm mb-4">
          <input
            type="checkbox"
            checked={agreed}
            onChange={() => setAgreed(!agreed)}
            className="accent-pink-600"
          />
          I agree to the use of my facial data for skin analysis.
        </label>

        <button
          onClick={() => agreed && onAgree()}
          disabled={!agreed}
          className={`w-full py-2 text-white rounded ${
            agreed
              ? "bg-black hover:bg-gray-800"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          SUBMIT
        </button>
      </div>
    </div>
  );
}
