"use client";
import { useState } from "react";
import { detectFlood } from "./utils/api";
import { CloudRainWind } from "lucide-react";
import Image from "next/image";

// Add this type for our results
type AnalysisResults = {
  success: boolean;
  risk_level: string;
  affected_area: number;
  confidence_score: number;
  visualization: string;
  error?: string;
};

export default function Home() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [visualizationImage, setVisualizationImage] = useState<string | null>(
    null
  );

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsAnalyzing(true);
      setResults(null);
      setVisualizationImage(null);

      // Show selected image preview
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);

      // Send to API for analysis
      const response = await detectFlood(file);

      if (response.success) {
        setResults(response);
        // Set the visualization image directly from the base64 string
        setVisualizationImage(response.visualization);
      } else {
        throw new Error(response.error || "Analysis failed");
      }
    } catch (error) {
      console.error("Error analyzing image:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100 via-blue-50 to-white dark:from-gray-800 dark:via-gray-900 dark:to-black">
      <main className="container mx-auto px-6 py-12">
        {/* Updated Header Section with Lucide Icon */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-block animate-float">
            <div className="w-20 h-20 bg-gradient-to-tr from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
              <CloudRainWind
                className="w-12 h-12 text-white"
                strokeWidth={1.5}
              />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 dark:from-blue-400 dark:via-blue-500 dark:to-blue-600 text-transparent bg-clip-text animate-gradient">
            Flood Detection System
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            Advanced satellite imagery analysis powered by AI for precise flood
            risk assessment
          </p>
        </div>

        <div className="max-w-4xl mx-auto backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-2xl p-8 border border-white/20 dark:border-gray-700/30">
          {/* Improved Image Upload Section */}
          <div className="mb-10">
            <div className="border-2 border-dashed border-blue-200 dark:border-blue-800 rounded-2xl p-8 transition-all hover:border-blue-400 dark:hover:border-blue-600 bg-gradient-to-br from-blue-50/50 to-white/50 dark:from-blue-900/20 dark:to-gray-800/20">
              <input
                type="file"
                className="hidden"
                id="satellite-image"
                accept="image/*"
                onChange={handleFileUpload}
              />
              <label
                htmlFor="satellite-image"
                className="cursor-pointer flex flex-col items-center transition-all hover:scale-102 hover:shadow-lg rounded-xl p-4"
              >
                <div className="w-20 h-20 mb-4 bg-gradient-to-tr from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-full flex items-center justify-center shadow-lg transform hover:rotate-6 transition-transform">
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <span className="text-gray-700 dark:text-gray-200 text-lg font-medium mb-2">
                  Drop satellite image here
                </span>
                <span className="text-gray-500 dark:text-gray-400 text-sm bg-white/50 dark:bg-gray-800/50 px-4 py-2 rounded-full">
                  or click to browse files
                </span>
              </label>
            </div>
          </div>

          {/* Updated Results Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200 flex items-center gap-3">
                <div className="w-2 h-6 bg-blue-500 rounded-full animate-pulse"></div>
                Original Image
              </h2>
              <div className="aspect-square bg-white/80 dark:bg-gray-800/80 rounded-xl shadow-inner flex items-center justify-center border border-gray-200 dark:border-gray-700 overflow-hidden">
                {selectedImage ? (
                  <img
                    src={selectedImage}
                    alt="Original"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <span className="text-gray-400 dark:text-gray-500 flex items-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    No image uploaded
                  </span>
                )}
              </div>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200 flex items-center gap-3">
                <div className="w-2 h-6 bg-green-500 rounded-full animate-pulse"></div>
                Flood Detection
              </h2>
              <div className="aspect-square bg-white/80 dark:bg-gray-800/80 rounded-xl shadow-inner flex items-center justify-center border border-gray-200 dark:border-gray-700 overflow-hidden">
                {isAnalyzing ? (
                  <span className="text-gray-400 dark:text-gray-500 flex items-center gap-2">
                    <svg
                      className="w-5 h-5 animate-spin"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    Analyzing...
                  </span>
                ) : visualizationImage ? (
                  <img
                    src={visualizationImage}
                    alt="Flood Detection"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <span className="text-gray-400 dark:text-gray-500">
                    Awaiting analysis
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Updated Analysis Results Section */}
          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              Analysis Results
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/30 dark:to-blue-800/30 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-blue-200/50 dark:border-blue-700/30">
                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
                  Flood Risk Level
                </h3>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {results?.risk_level || "Waiting..."}
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/30 dark:to-green-800/30 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-green-200/50 dark:border-green-700/30">
                <h3 className="text-sm font-medium text-green-800 dark:text-green-300 mb-2">
                  Affected Area
                </h3>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {results ? `${results.affected_area}%` : "-- km²"}
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/30 dark:to-purple-800/30 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-purple-200/50 dark:border-purple-700/30">
                <h3 className="text-sm font-medium text-purple-800 dark:text-purple-300 mb-2">
                  Confidence Score
                </h3>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {results ? `${results.confidence_score}%` : "--%"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
