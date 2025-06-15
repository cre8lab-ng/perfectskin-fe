import Footer from "@/components/footer";
import Header from "@/components/header";
import WebPageTitle from "@/components/webpagetitle";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <WebPageTitle title="Perfect Skin By BeautyHub" />
      <Header />
      <div
        className="relative bg-cover bg-center bg-no-repeat min-h-[70vh] flex items-center justify-center px-6"
        style={{ backgroundImage: "url('/images/perfectskin.jpg')" }}
      >
        {/* Softer white overlay with slight blur */}
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px]"></div>

        {/* Content Card */}
        <div className="relative z-10 max-w-2xl w-full bg-white/80 rounded-3xl shadow-lg p-6 md:p-8 text-center space-y-5">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#f847b4] leading-tight">
            Perfect Skin by Beauty Hub
          </h1>

          <h2 className="text-base md:text-lg font-medium text-gray-800">
            Fast, AI-Powered Skin Analysis
          </h2>

          <p className="text-gray-700 text-sm md:text-base">
            Upload or snap a photo to discover your skin condition and get a
            personalized skincare routine—powered by AI trained on 50,000+ skin
            images.
          </p>

          {/* QR Code */}
          <div className="flex flex-col items-center mt-2">
            <div className="bg-white rounded-full p-2 shadow-sm">
              <Image
                src="/images/qr-perfectskin-pink-transparent.png"
                alt="QR Code"
                width={80}
                height={80}
                className="rounded-md"
                style={{ backgroundColor: "transparent" }}
              />
            </div>
            <p className="mt-2 text-xs text-[#f847b4] font-semibold">
              Scan to start your analysis
            </p>
          </div>
        </div>
      </div>

      {/* Steps */}
      <section className="bg-white py-12 px-4 md:px-12 text-center">
        <h2 className="text-2xl md:text-4xl font-bold mb-10">
          YOUR PERSONAL SKIN ANALYSIS IN THREE EASY STEPS
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Step 1 */}
          <div className="flex flex-col items-center">
            <div className="relative w-64 h-96">
              <Image
                src="/images/step-1.png"
                alt="Step 1 - Upload Selfie"
                layout="fill"
                objectFit="contain"
              />
            </div>
            <p className="mt-6 text-lg font-semibold">
              UPLOAD OR TAKE A SELFIE
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Snap or upload a clear photo—no filters needed. Our AI reads
              natural skin features from front and side views.
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="relative w-64 h-96">
              <Image
                src="/images/step-2.png"
                alt="Step 2 - Skin Analysis"
                layout="fill"
                objectFit="contain"
              />
            </div>
            <p className="mt-6 text-lg font-semibold">COMPLETE YOUR ANALYSIS</p>
            <p className="text-sm text-gray-600 mt-2">
              In seconds, the AI scans your face for up to 15 skin concerns,
              including texture, pores, acne, and dark spots.
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center">
            <div className="relative w-64 h-96">
              <Image
                src="/images/step-3.png"
                alt="Step 3 - Discover Routine"
                layout="fill"
                objectFit="contain"
              />
            </div>
            <p className="mt-6 text-lg font-semibold">DISCOVER YOUR ROUTINE</p>
            <p className="text-sm text-gray-600 mt-2">
              Receive a personalized skincare routine tailored to your skin’s
              unique needs, backed by advanced AI insights.
            </p>
          </div>
        </div>
      </section>

      <div className="w-full bg-[#fff0f6] text-black py-16">
        <div className="max-w-screen-xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between px-6 md:px-12 gap-12">
          {/* Left Section */}
          <div className="w-full md:w-1/2 text-center md:text-left space-y-6">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
              Discover Your
              <br />
              <span className="text-[#f847b4]">Tailored Routine</span>
              <br />& Skincare Tips
            </h1>
            <p className="text-lg md:text-xl text-gray-700 max-w-md mx-auto md:mx-0">
              Scan to begin your personalized skin analysis powered by AI.
            </p>
          </div>

          {/* Right Section */}
          <div className="w-full md:w-1/2 relative flex flex-col items-center">
            {/* Phone Image */}
            <div className="relative">
              <Image
                src="/images/girls.png"
                alt="Phone Over Face"
                width={320}
                height={320}
                className="rounded-2xl shadow-xl"
              />

              {/* QR Code - Floating top-right on image */}
              <div className="absolute -top-4 -right-4 bg-white p-2 rounded-xl shadow-md">
                <Image
                  src="/images/qr-perfectskin-pink-transparent.png"
                  alt="QR Code"
                  width={80}
                  height={80}
                  className="rounded-md"
                  style={{ backgroundColor: "transparent" }}
                />
              </div>
            </div>

            {/* QR Instruction Below */}
            <p className="mt-6 text-center text-sm text-[#f847b4] font-medium">
              Scan the QR code on a mobile device <br />
              to start your skin analysis
            </p>
          </div>
        </div>
      </div>

      {/* Behind the tech */}
      <section className="bg-white text-gray-800 py-12 px-6 md:px-12">
        <div className="max-w-5xl mx-auto space-y-12">
          {/* Title */}
          <div className="text-center space-y-2">
            <h2 className="text-3xl md:text-4xl font-bold text-[#f847b4]">
              Behind the Tech
            </h2>
            <p className="text-base md:text-lg text-gray-600">
              Advanced AI. Proven Accuracy. Personalized for You.
            </p>
          </div>

          {/* Highlights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm md:text-base text-gray-700">
            <div className="p-4 bg-[#fef6fb] rounded-xl shadow-sm">
              <h3 className="font-semibold text-[#f847b4] mb-1">
                HD Skin Analysis
              </h3>
              <p>2× sharper AI for ultra-precise detection and diagnostics.</p>
            </div>

            <div className="p-4 bg-[#fef6fb] rounded-xl shadow-sm">
              <h3 className="font-semibold text-[#f847b4] mb-1">
                Targeted Zones
              </h3>
              <p>Focuses on T-zone, U-zone & more for personalized care.</p>
            </div>

            <div className="p-4 bg-[#fef6fb] rounded-xl shadow-sm">
              <h3 className="font-semibold text-[#f847b4] mb-1">AI Insights</h3>
              <p>50K+ skin images power 95%+ diagnostic accuracy.</p>
            </div>

            <div className="p-4 bg-[#fef6fb] rounded-xl shadow-sm">
              <h3 className="font-semibold text-[#f847b4] mb-1">
                Real-Time Results
              </h3>
              <p>Instant analysis, clinically validated by dermatologists.</p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
