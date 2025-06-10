import { useEffect, useState } from "react";
import useAccessToken from "@/stores/useAccessToken";
import { uploadImage } from "@/services/skinanalysis";
import {
  analyzeSkinFeatures,
  checkSkinAnalysisStatus,
} from "@/services/skinanalysis"; 
import { getAllTags } from "@/services/woocommerce";
import env from "@/config/env";

export default function Home() {
  const accessToken = useAccessToken((s) => s.accessToken);
  const [preview, setPreview] = useState(null);
  const [uploadResponse, setUploadResponse] = useState(null);
  const [analysisResponse, setAnalysisResponse] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState(null);
  const [tags, setTags] = useState([]);
  const { perfectSkinConsumerKey, perfectSkinConsumerSecret } = env;


  // Function to poll analysis status
  const pollAnalysisStatus = async (taskId, accessToken) => {
    let attempts = 0;
    const maxAttempts = 30; // Maximum polling attempts
    const pollInterval = 2000; // Poll every 2 seconds

    const poll = async () => {
      try {
        const status = await checkSkinAnalysisStatus(taskId, accessToken);
        setAnalysisStatus(status);

        // Check if analysis is complete (adjust condition based on actual API response)
        if (status.status === "completed" || status.result) {
          setAnalyzing(false);
          return status;
        }

        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, pollInterval);
        } else {
          setAnalyzing(false);
          throw new Error(
            "Analysis timeout - maximum polling attempts reached"
          );
        }
      } catch (error) {
        setAnalyzing(false);
        throw error;
      }
    };

    poll();
  };

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
      // Upload the image
      const uploadResult = await uploadImage(file, accessToken);
      console.log(uploadResult, "uploaded");
      setUploadResponse(uploadResult);
    } catch (err) {
      console.error("Upload failed", err);
      alert(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleRunAnalysis = async () => {
    if (!uploadResponse || !uploadResponse.file_id) {
      alert("No uploaded image found. Please upload an image first.");
      return;
    }

    if (!accessToken) {
      alert("Access token not available.");
      return;
    }

    setAnalyzing(true);
    try {
      // Start skin analysis with the file ID from upload response
      const analysisResult = await analyzeSkinFeatures(
        uploadResponse.file_id, // Use the file ID from upload response
        accessToken,
        ["hd_wrinkle", "hd_pore", "hd_texture", "hd_acne"] // Choose your desired features
      );

      setAnalysisResponse(analysisResult);

      // Poll for analysis completion
      if (analysisResult.result && analysisResult.result.task_id) {
        await pollAnalysisStatus(analysisResult.result.task_id, accessToken);
      }
    } catch (err) {
      console.error("Analysis failed", err);
      alert(`Analysis failed: ${err.message}`);
    } finally {
      setAnalyzing(false);
    }
  };

  useEffect(() => {
    async function fetchTags() {
      try {
        const data = await getAllTags(
          perfectSkinConsumerKey!,
          perfectSkinConsumerSecret!
        );
        setTags(data);
      } catch (err) {
        console.error("Failed to load product tags:", err);
      }
    }

    fetchTags();
  }, []);

  return (
    <div style={{ padding: "1rem" }}>
      <p>
        <strong>Take a picture and upload it for skin analysis</strong>
      </p>

      <input
        type="file"
        accept="image/*"
        capture="environment" // Use "user" for front camera
        onChange={handleCapture}
        style={{ margin: "1em 0" }}
        disabled={uploading}
      />

      {preview && (
        <div>
          <p>
            <strong>Preview:</strong>
          </p>
          <img
            src={preview}
            alt="Preview"
            style={{ maxWidth: "100%", height: "10rem", borderRadius: 8 }}
          />
        </div>
      )}

      {uploading && <p>Uploading image...</p>}

      {uploadResponse && (
        <div style={{ margin: "1rem 0" }}>
          <button
            onClick={handleRunAnalysis}
            disabled={analyzing}
            style={{
              padding: "10px 20px",
              backgroundColor: analyzing ? "#6c757d" : "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: analyzing ? "not-allowed" : "pointer",
              fontSize: "16px",
            }}
          >
            {analyzing ? "Analyzing..." : "Run Skin Analysis Now"}
          </button>
        </div>
      )}

      {analyzing && <p>Analyzing skin... This may take a few moments.</p>}

      {uploadResponse && (
        <div style={{ marginTop: "1rem" }}>
          <p>
            <strong>Upload Response:</strong>
          </p>
          <pre
            style={{ fontSize: "12px", background: "#f5f5f5", padding: "10px" }}
          >
            {JSON.stringify(uploadResponse, null, 2)}
          </pre>
        </div>
      )}

      {analysisResponse && (
        <div style={{ marginTop: "1rem" }}>
          <p>
            <strong>Analysis Started:</strong>
          </p>
          <pre
            style={{ fontSize: "12px", background: "#f0f8ff", padding: "10px" }}
          >
            {JSON.stringify(analysisResponse, null, 2)}
          </pre>
        </div>
      )}

      {analysisStatus && (
        <div style={{ marginTop: "1rem" }}>
          <p>
            <strong>Analysis Status:</strong>
          </p>
          <pre
            style={{ fontSize: "12px", background: "#f0fff0", padding: "10px" }}
          >
            {JSON.stringify(analysisStatus, null, 2)}
          </pre>
        </div>
      )}

      {tags.length > 0 && (
        <div
          style={{
            marginTop: "2rem",
            borderTop: "1px solid #ddd",
            paddingTop: "1rem",
          }}
        >
          <p>
            <strong>Available Product Tags:</strong>
          </p>
          <ul
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
              listStyle: "none",
              padding: 0,
            }}
          >
            {tags.map((tag) => (
              <li
                key={tag.id}
                style={{
                  background: "#e0f7fa",
                  padding: "6px 12px",
                  borderRadius: "5px",
                }}
              >
                {tag.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
