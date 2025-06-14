import { useEffect, useState, ChangeEvent } from "react";
import useAccessToken from "@/stores/useAccessToken";
import { uploadImage, analyzeSkinFeatures } from "@/services/skinanalysis";
import { getProductsByTagName, createWooCompletedOrder } from "@/services/woocommerce";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ProductRecommender from "@/components/product-recommender";
import LoginModal from "@/components/modal/login";
import { loadPaystackScript, triggerPaystackPopup } from "@/util/paystack";

interface Product {
  id: number;
  name: string;
  price_html: string;
  brand: string;
  image: string;
  link: string;
}

interface AnalysisResult {
  wrinkle?: string;
  pore?: string;
  texture?: string;
  acne?: string;
}

interface AnalysisStatus {
  result: {
    status: "success" | "error" | "running";
    results?: AnalysisResult;
    error_message?: string;
  };
}

export interface UploadResponse {
  file_id: string;
  url?: string;
}

export default function Home() {
  const accessToken = useAccessToken((s) => s.accessToken);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadResponse, setUploadResponse] = useState<UploadResponse | null>(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState<AnalysisStatus | null>(null);
  const [finalResults, setFinalResults] = useState<AnalysisResult | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [pendingResults, setPendingResults] = useState<AnalysisResult | null>(null);
  const [pendingProducts, setPendingProducts] = useState<Product[]>([]);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [customerEmail, setCustomerEmail] = useState("");

  console.log(preview,products,customerEmail)

  useEffect(() => {
    loadPaystackScript();
  }, []);

  const pollAnalysisStatus = async (taskId: string, accessToken: string): Promise<AnalysisStatus> => {
    console.log(taskId,accessToken)

    const fakeSuccessResult: AnalysisStatus = {
      result: {
        status: "success",
        results: {
          wrinkle: "low",
          pore: "medium",
          texture: "high",
          acne: "moderate",
        },
      },
    };

    setAnalyzing(false);
    setAnalysisStatus(fakeSuccessResult);
    setPendingResults(fakeSuccessResult.result.results || null);

    const fakeProducts: Product[] = [
      {
        id: 1,
        name: "Acne Cleanser",
        price_html: "₦6,000",
        brand: "Beauty Hub",
        image: "/images/product1.jpg",
        link: "#",
      },
      {
        id: 2,
        name: "Wrinkle Repair Serum",
        price_html: "₦9,500",
        brand: "GlowPro",
        image: "/images/product2.jpg",
        link: "#",
      },
    ];

    setPendingProducts(fakeProducts);
    setIsLoginModalOpen(true);

    return Promise.resolve(fakeSuccessResult);
  };

  const handleLoginSuccess = async (email: string, hasAccess: boolean) => {
    setCustomerEmail(email);
    setIsLoginModalOpen(false);

    if (hasAccess) {
      setIsAuthorized(true);
      setFinalResults(pendingResults);
      setProducts(pendingProducts);
    } else {
      triggerPaystackPopup({
        email,
        amount: 500000,
        onSuccess: async () => {
          try {
            await createWooCompletedOrder(email);
            setIsAuthorized(true);
            setFinalResults(pendingResults);
            setProducts(pendingProducts);
          } catch (err) {
            console.log(err);
            alert("Payment succeeded but order creation failed.");
          }
        },
        onClose: () => alert("Payment cancelled."),
      });
    }
  };

  const handleCapture = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    if (!accessToken) {
      alert("Access token not available yet.");
      return;
    }

    setUploading(true);
    uploadImage(file, accessToken)
      .then(setUploadResponse)
      .catch((err) => {
        console.error("Upload failed", err);
        alert(`Upload failed: ${(err as Error).message}`);
      })
      .finally(() => setUploading(false));
  };

  const handleRunAnalysis = async () => {
    if (!uploadResponse?.file_id || !accessToken) {
      alert("Upload an image first and ensure you're logged in.");
      return;
    }

    setAnalyzing(true);
    setAnalysisStatus(null);
    setFinalResults(null);

    try {
      const analysisResult = await analyzeSkinFeatures(
        uploadResponse.file_id,
        accessToken,
        ["wrinkle", "pore", "texture", "acne"]
      );

      const taskId = analysisResult.result.task_id;
      if (!taskId) throw new Error("No task_id found in analysis response");

      await pollAnalysisStatus(taskId, accessToken);

      setPendingResults(analysisStatus?.result?.results || null);
    } catch (err) {
      console.error("Analysis failed", err);
      alert(`Analysis failed: ${(err as Error).message}`);
    } finally {
      setAnalyzing(false);
    }
  };

  useEffect(() => {
    async function fetchTestProducts() {
      try {
        const productResults = await getProductsByTagName(
          "acne"
        );
        console.log(productResults);
      } catch (err) {
        console.error("Error fetching test products:", err);
      }
    }

    fetchTestProducts();
  }, []);

  return (
    <>
      <Header />
      <main
        style={{
          padding: "1rem",
          backgroundImage: "url('/images/perfectskin.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          minHeight: "50vh",
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
          <p><strong>Take a picture and upload it for skin analysis</strong></p>

          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleCapture}
            style={{ margin: "1em 0" }}
            disabled={uploading}
          />

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
              {analysisStatus?.result && <p>Status: {analysisStatus.result.status}</p>}
            </div>
          )}

          {finalResults && isAuthorized && (
            <div>
              <h3>Analysis Results</h3>
              <pre>{JSON.stringify(finalResults, null, 2)}</pre>
            </div>
          )}

          <ProductRecommender />

          {isLoginModalOpen && (
            <LoginModal
              onClose={() => setIsLoginModalOpen(false)}
              onLoginSuccess={handleLoginSuccess}
            />
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
