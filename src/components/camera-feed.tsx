import { useEffect, useRef, useState } from "react";

export default function CameraPrompt({
  onCapture,
}: {
  onCapture: (imageData: string) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setReady(true);
      } catch (err) {
        alert("Unable to access camera.");
        console.error(err);
      }
    };

    startCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach((track) => track.stop());
      }
    };
  }, []);

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");
    if (context) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL("image/jpeg");
      onCapture(imageData);
    }
  };

  return (
    <div className="relative w-full h-[80vh] overflow-hidden flex justify-center items-center bg-black">
      {/* Video Feed */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover absolute"
      />

      {/* Circle Overlay */}
      <div className="w-64 h-64 border-4 border-white rounded-full absolute z-10 flex items-center justify-center">
        <p className="text-center text-white font-bold text-sm px-4">
          KEEP YOUR FACE INSIDE THE CIRCLE
        </p>
      </div>

      {/* Manual Capture Button */}
      {ready && (
        <button
          onClick={handleCapture}
          className="absolute bottom-6 bg-pink-600 text-white px-4 py-2 rounded z-20"
        >
          Capture
        </button>
      )}

      {/* Guidance Tags */}
      <div className="absolute bottom-16 w-full flex justify-center gap-4 z-20">
        <span className="bg-yellow-400 text-black px-3 py-1 rounded text-sm">
          LIGHTING
        </span>
        <span className="bg-green-500 text-white px-3 py-1 rounded text-sm">
          LOOK STRAIGHT
        </span>
        <span className="bg-red-500 text-white px-3 py-1 rounded text-sm">
          FACE POSITION
        </span>
      </div>

      {/* Hidden canvas for capture */}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}
