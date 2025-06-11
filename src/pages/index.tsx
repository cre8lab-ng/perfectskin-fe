import { useEffect, useState } from "react";
import useAccessToken from "@/stores/useAccessToken";
import { uploadImage } from "@/services/skinanalysis";
import {
  analyzeSkinFeatures,
  checkSkinAnalysisStatus,
} from "@/services/skinanalysis";
import { getAllTags } from "@/services/woocommerce";
import env from "@/config/env";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function Home() {
  const accessToken = useAccessToken((s) => s.accessToken);
  const [preview, setPreview] = useState(null);
  const [uploadResponse, setUploadResponse] = useState(null);
  const [analysisResponse, setAnalysisResponse] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState(null);
  const [finalResults, setFinalResults] = useState(null);
  const [tags, setTags] = useState([]);
  const { perfectSkinConsumerKey, perfectSkinConsumerSecret } = env;

  // Improved polling function with better error handling and status checking
  // @ts-expect-error: prop not in type but needed for dynamic rendering
  const pollAnalysisStatus = async (taskId, accessToken) => {
    let attempts = 0;
    const maxAttempts = 30;
    const pollInterval = 2000;

    return new Promise((resolve, reject) => {
      const poll = async () => {
        try {
          const status = await checkSkinAnalysisStatus(taskId, accessToken);
          setAnalysisStatus(status);

          // Check for completion based on API documentation
          if (status.result && status.result.status === "success") {
            // Analysis completed successfully
            setAnalyzing(false);
            setFinalResults(status.result.results);
            resolve(status);
            return;
          } else if (status.result && status.result.status === "error") {
            // Analysis failed
            setAnalyzing(false);
            reject(
              new Error(
                `Analysis failed: ${
                  status.result.error_message || "Unknown error"
                }`
              )
            );
            return;
          } else if (status.result && status.result.status === "running") {
            // Still processing, continue polling
            attempts++;
            if (attempts < maxAttempts) {
              setTimeout(poll, pollInterval);
            } else {
              setAnalyzing(false);
              reject(
                new Error("Analysis timeout - maximum polling attempts reached")
              );
            }
          } else {
            // Unexpected status format
            attempts++;
            if (attempts < maxAttempts) {
              setTimeout(poll, pollInterval);
            } else {
              setAnalyzing(false);
              reject(new Error("Analysis timeout - unexpected status format"));
            }
          }
        } catch (error) {
          console.error("Polling error:", error);
          attempts++;
          if (attempts < maxAttempts) {
            // Retry on error
            setTimeout(poll, pollInterval);
          } else {
            setAnalyzing(false);
            reject(error);
          }
        }
      };

      poll();
    });
  };

  
  const handleCapture = async (e: unknown) => {
          // @ts-expect-error: prop not in type but needed for dynamic rendering
    const file = e.target.files[0];
    if (!file) return;

    // Show preview
    const previewUrl = URL.createObjectURL(file);
    // @ts-expect-error: prop not in type but needed for dynamic rendering
    setPreview(previewUrl);

    if (!accessToken) {
      alert("Access token not available yet.");
      return;
    }

    setUploading(true);
    try {
      // Upload the image
      const uploadResult = await uploadImage(file, accessToken);
      setUploadResponse(uploadResult);
    } catch (err) {
      console.error("Upload failed", err);
      // @ts-expect-error: prop not in type but needed for dynamic rendering
      alert(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleRunAnalysis = async () => {
    // @ts-expect-error: prop not in type but needed for dynamic rendering
    if (!uploadResponse || !uploadResponse.file_id) {
      alert("No uploaded image found. Please upload an image first.");
      return;
    }

    if (!accessToken) {
      alert("Access token not available.");
      return;
    }

    setAnalyzing(true);
    setAnalysisStatus(null);
    setFinalResults(null);

    try {
      // Start skin analysis with the file ID from upload response
      const analysisResult = await analyzeSkinFeatures(
        // @ts-expect-error: prop not in type but needed for dynamic rendering
        uploadResponse.file_id,
        accessToken,
        ["hd_wrinkle", "hd_pore", "hd_texture", "hd_acne"]
      );
      // @ts-expect-error: prop not in type but needed for dynamic rendering
      setAnalysisResponse(analysisResult);

      // Extract task_id from the response
      let taskId;
      if (analysisResult.result && analysisResult.result.task_id) {
        taskId = analysisResult.result.task_id;
        // @ts-expect-error: prop not in type but needed for dynamic rendering
      } else if (analysisResult.task_id) {
        // @ts-expect-error: prop not in type but needed for dynamic rendering
        taskId = analysisResult.task_id;
      } else {
        throw new Error("No task_id found in analysis response");
      }

      // Poll for analysis completion
      await pollAnalysisStatus(taskId, accessToken);
    } catch (err) {
      console.error("Analysis failed", err);
      // @ts-expect-error: prop not in type but needed for dynamic rendering
      alert(`Analysis failed: ${err.message}`);
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
    <>
      <Header />
      <main
        style={{
          padding: "1rem",
          backgroundImage: "url('/images/skinperfect.svg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          minHeight: "100vh",
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            padding: "2rem",
            maxWidth: "600px",
            margin: "2rem auto",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          <p>
            <strong>Take a picture and upload it for skin analysis</strong>
          </p>

          <input
            type="file"
            accept="image/*"
            capture="environment"
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

          {analyzing && (
            <div>
              <p>Analyzing skin... This may take a few moments.</p>

              {/* {analysisStatus && analysisStatus.result && (
                <p>Status: {analysisStatus.result.status}</p>
              )} */}
            </div>
          )}

          {uploadResponse && (
            <div style={{ marginTop: "1rem" }}>
              <p>
                <strong>Upload Response:</strong>
              </p>
              <pre
                style={{
                  fontSize: "12px",
                  background: "#f5f5f5",
                  padding: "10px",
                }}
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
                style={{
                  fontSize: "12px",
                  background: "#f0f8ff",
                  padding: "10px",
                }}
              >
                {JSON.stringify(analysisResponse, null, 2)}
              </pre>
            </div>
          )}

          {analysisStatus && (
            <div style={{ marginTop: "1rem" }}>
              <p>
                <strong>Current Analysis Status:</strong>
              </p>
              <pre
                style={{
                  fontSize: "12px",
                  background: "#f0fff0",
                  padding: "10px",
                }}
              >
                {JSON.stringify(analysisStatus, null, 2)}
              </pre>
            </div>
          )}

          {finalResults && (
            <div style={{ marginTop: "1rem" }}>
              <p>
                <strong>Final Analysis Results:</strong>
              </p>
              <pre
                style={{
                  fontSize: "12px",
                  background: "#fff0f0",
                  padding: "10px",
                }}
              >
                {JSON.stringify(finalResults, null, 2)}
              </pre>
            </div>
          )}

          {tags?.length > 0 && (
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
              {/* <ul
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
              </ul> */}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
