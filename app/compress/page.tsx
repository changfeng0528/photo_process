"use client";

import { useState, useRef } from "react";

export default function CompressPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string>("");
  const [compressedPreview, setCompressedPreview] = useState<string>("");
  const [quality, setQuality] = useState<number>(80);
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      setOriginalSize(file.size);

      const reader = new FileReader();
      reader.onload = (e) => {
        setOriginalPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      setCompressedPreview("");
      setCompressedSize(0);
    }
  };

  const compressImage = async () => {
    if (!selectedFile || !canvasRef.current) return;

    setIsCompressing(true);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      ctx?.drawImage(img, 0, 0);

      const compressedDataUrl = canvas.toDataURL("image/jpeg", quality / 100);
      setCompressedPreview(compressedDataUrl);

      const base64Length = compressedDataUrl.length - "data:image/jpeg;base64,".length;
      const sizeInBytes = (base64Length * 3) / 4;
      setCompressedSize(Math.round(sizeInBytes));

      setIsCompressing(false);
    };

    img.src = originalPreview;
  };

  const downloadCompressed = () => {
    if (!compressedPreview) return;

    const link = document.createElement("a");
    link.download = `compressed_${selectedFile?.name || "image.jpg"}`;
    link.href = compressedPreview;
    link.click();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const compressionRatio = originalSize > 0 && compressedSize > 0
    ? Math.round(((originalSize - compressedSize) / originalSize) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              图片压缩
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              智能压缩图片，减小文件大小，保持画质
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            {!selectedFile ? (
              <div className="text-center">
                <div
                  className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12 hover:border-blue-500 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="text-6xl mb-4">📁</div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    选择图片文件
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    点击此处或拖拽图片文件到这里
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    支持 JPG、PNG、WebP 格式
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {selectedFile.name}
                  </h3>
                  <button
                    onClick={() => {
                      setSelectedFile(null);
                      setOriginalPreview("");
                      setCompressedPreview("");
                      setOriginalSize(0);
                      setCompressedSize(0);
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    重新选择
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      原始图片
                    </h4>
                    <div className="border rounded-lg overflow-hidden">
                      <img
                        src={originalPreview}
                        alt="Original"
                        className="w-full h-64 object-contain bg-gray-50 dark:bg-gray-700"
                      />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      大小: {formatFileSize(originalSize)}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      压缩后图片
                    </h4>
                    <div className="border rounded-lg overflow-hidden">
                      {compressedPreview ? (
                        <img
                          src={compressedPreview}
                          alt="Compressed"
                          className="w-full h-64 object-contain bg-gray-50 dark:bg-gray-700"
                        />
                      ) : (
                        <div className="w-full h-64 bg-gray-50 dark:bg-gray-700 flex items-center justify-center">
                          <p className="text-gray-500 dark:text-gray-400">
                            压缩后的图片将显示在这里
                          </p>
                        </div>
                      )}
                    </div>
                    {compressedSize > 0 && (
                      <div className="mt-2 space-y-1">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          大小: {formatFileSize(compressedSize)}
                        </p>
                        <p className="text-sm text-green-600 dark:text-green-400">
                          压缩率: {compressionRatio}%
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                      压缩质量: {quality}%
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={quality}
                      onChange={(e) => setQuality(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                    />
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span>高压缩</span>
                      <span>低压缩</span>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={compressImage}
                      disabled={isCompressing}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                    >
                      {isCompressing ? "压缩中..." : "开始压缩"}
                    </button>

                    {compressedPreview && (
                      <button
                        onClick={downloadCompressed}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                      >
                        下载压缩图片
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}