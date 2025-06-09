import { useState } from "react";
import useAccessToken from "@/stores/useAccessToken";
import { uploadImage } from "@/services/skinanalysis"; // adjust if needed

export default function Home() {
  const accessToken = useAccessToken((s) => s.accessToken);
  const [preview, setPreview] = useState(null);
  const [response, setResponse] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleCapture = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show preview
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    if (!accessToken) {
      alert("Access token not available yet.");
      return;
    }

    setUploading(true);
    try {
      const result = await uploadImage(file, accessToken);
      console.log("Upload result:", result);
      setResponse(result);
    } catch (err) {
      console.error("Upload failed", err);
      alert("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <p><strong>Take a picture and upload it</strong></p>

      <input
        type="file"
        accept="image/*"
        capture="environment" // Use "user" for front camera
        onChange={handleCapture}
        style={{ margin: "1em 0" }}
      />

      {preview && (
        <div>
          <p><strong>Preview:</strong></p>
          <img
            src={preview}
            alt="Preview"
            style={{ maxWidth: "100%", height: "auto", borderRadius: 8 }}
          />
        </div>
      )}

      {uploading && <p>Uploading image...</p>}

      {response && (
        <div style={{ marginTop: "1rem" }}>
          <p><strong>Server Response:</strong></p>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
