"use client";

import { useState, useRef } from "react";

export default function RemoveBgPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string>("");
  const [processedPreview, setProcessedPreview] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      setError("");

      const reader = new FileReader();
      reader.onload = (e) => {
        setOriginalPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      setProcessedPreview("");
    }
  };

  const removeBackground = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append('image_file', selectedFile);
      formData.append('size', 'auto');

      const response = await fetch('https://api.remove.bg/v1.0/removebg', {
        method: 'POST',
        headers: {
          'X-Api-Key': 'Tu2dsnJYVk8xBrNAybWQgFvV',
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errors?.[0]?.title || '处理失败，请重试');
      }

      const blob = await response.blob();
      const processedImageUrl = URL.createObjectURL(blob);
      setProcessedPreview(processedImageUrl);

    } catch (err) {
      console.error('Remove background error:', err);
      setError(err instanceof Error ? err.message : '处理失败，请检查网络连接后重试');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadProcessed = () => {
    if (!processedPreview) return;

    const link = document.createElement("a");
    link.download = `no-bg-${selectedFile?.name || "image.png"}`;
    link.href = processedPreview;
    link.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith("image/")) {
      const file = files[0];
      setSelectedFile(file);
      setError("");

      const reader = new FileReader();
      reader.onload = (e) => {
        setOriginalPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      setProcessedPreview("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              抠图去背景
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              AI智能抠图，一键去除背景，支持人物、物品等多种场景
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            {!selectedFile ? (
              <div className="text-center">
                <div
                  className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12 hover:border-purple-500 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <div className="text-6xl mb-4">✂️</div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    选择图片文件
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    点击此处或拖拽图片文件到这里
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    支持 JPG、PNG、WebP 格式，最大 12MB
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
                      setProcessedPreview("");
                      setError("");
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    重新选择
                  </button>
                </div>

                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <div className="flex">
                      <div className="text-red-400 mr-3">⚠️</div>
                      <div>
                        <h4 className="text-red-800 dark:text-red-400 font-medium">处理失败</h4>
                        <p className="text-red-700 dark:text-red-300 text-sm mt-1">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      原始图片
                    </h4>
                    <div className="border rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-700">
                      <img
                        src={originalPreview}
                        alt="Original"
                        className="w-full h-80 object-contain"
                      />
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      去背景后
                    </h4>
                    <div className="border rounded-lg overflow-hidden bg-transparent relative">
                      {processedPreview ? (
                        <div className="relative">
                          <div
                            className="absolute inset-0 opacity-20"
                            style={{
                              backgroundImage: `url("data:image/svg+xml,%3csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='10' height='10' fill='%23f0f0f0'/%3e%3crect x='10' y='10' width='10' height='10' fill='%23f0f0f0'/%3e%3c/svg%3e")`,
                              backgroundSize: '20px 20px'
                            }}
                          />
                          <img
                            src={processedPreview}
                            alt="Processed"
                            className="w-full h-80 object-contain relative z-10"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-80 bg-gray-50 dark:bg-gray-700 flex items-center justify-center">
                          <p className="text-gray-500 dark:text-gray-400">
                            {isProcessing ? "正在处理中..." : "去背景后的图片将显示在这里"}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={removeBackground}
                    disabled={isProcessing}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        处理中...
                      </>
                    ) : (
                      <>
                        ✂️ 开始去背景
                      </>
                    )}
                  </button>

                  {processedPreview && (
                    <button
                      onClick={downloadProcessed}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      📥 下载图片
                    </button>
                  )}
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex">
                    <div className="text-blue-400 mr-3">💡</div>
                    <div>
                      <h4 className="text-blue-800 dark:text-blue-400 font-medium">使用提示</h4>
                      <ul className="text-blue-700 dark:text-blue-300 text-sm mt-1 space-y-1">
                        <li>• 人物照片效果最佳，建议主体清晰、背景简单</li>
                        <li>• 支持物品、动物等多种场景的背景移除</li>
                        <li>• 处理时间约 3-10 秒，请耐心等待</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}