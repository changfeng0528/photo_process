"use client";

import { useState } from "react";

export default function GeneratePage() {
  const [prompt, setPrompt] = useState<string>("");
  const [generatedImage, setGeneratedImage] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [responseData, setResponseData] = useState<any>(null);

  const examplePrompts = [
    {
      text: "星际穿越，黑洞，黑洞里冲出一辆快支离破碎的复古列车，抢视觉冲击力，电影大片，末日既视感，动感，对比色，oc 渲染，光线追踪，动态模糊，景深，超现实主义，深蓝，画面通过细腻的丰富的色彩层次塑造主体与场景，质感真实，暗黑风背景的光影效果营造出氛围，整体兼具艺术幻想感，夸张的广角透视效果，耀光，反射，极致的光影，强引力，吞噬",
      description: "星际穿越风格的复古列车场景"
    },
    {
      text: "一位美丽的女孩站在樱花树下，粉色花瓣飘落，柔和的阳光透过树叶洒下，日式动漫风格，高清画质，细腻的光影效果",
      description: "樱花下的动漫少女"
    },
    {
      text: "未来科技城市，霓虹灯闪烁，飞行汽车穿梭，高楼大厦林立，赛博朋克风格，紫色和蓝色色调，雨夜场景",
      description: "赛博朋克未来城市"
    },
    {
      text: "中国古风山水画，远山如黛，云雾缭绕，古代楼阁若隐若现，水墨画风格，意境深远",
      description: "中国古风山水画"
    }
  ];

  const generateImage = async () => {
    if (!prompt.trim()) {
      setError("请填写提示词");
      return;
    }

    setIsGenerating(true);
    setError("");
    setGeneratedImage("");
    setResponseData(null);

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      setResponseData(data);

      if (data.data && data.data.length > 0) {
        setGeneratedImage(data.data[0].url);
      } else {
        throw new Error("未收到有效的图像URL");
      }
    } catch (err: any) {
      setError(err.message || "生成图像失败");
    } finally {
      setIsGenerating(false);
    }
  };

  const fillPrompt = (text: string) => {
    setPrompt(text);
  };

  const downloadImage = async () => {
    if (!generatedImage) return;

    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `ai-generated-${Date.now()}.jpg`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError("下载图像失败");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              AI图像生成
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              文字描述生成精美图片，基于火山引擎AI技术
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            {/* 示例提示词 */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                🎨 示例提示词
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {examplePrompts.map((example, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    onClick={() => fillPrompt(example.text)}
                  >
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                      {example.description}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                      {example.text.substring(0, 100)}...
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* API密钥状态显示 */}
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-green-600 dark:text-green-400 text-sm">
                🔑 API密钥已配置 - 无需手动输入
              </p>
            </div>

            {/* 提示词输入 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                ✍️ 图像描述提示词
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={6}
                placeholder="请详细描述您想要生成的图像，越详细越好...&#10;&#10;例如：一只可爱的橙色小猫坐在彩虹上，背景是星空，卡通风格，高清画质"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-vertical"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                提示：详细的描述有助于生成更精确的图像
              </p>
            </div>

            {/* 生成按钮 */}
            <button
              onClick={generateImage}
              disabled={isGenerating || !prompt.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-6 rounded-lg transition-colors mb-6"
            >
              {isGenerating ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  正在生成图像...
                </div>
              ) : (
                "🎨 生成图像"
              )}
            </button>

            {/* 错误信息 */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-600 dark:text-red-400">❌ {error}</p>
              </div>
            )}

            {/* 生成结果 */}
            {generatedImage && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    ✨ 生成结果
                  </h3>
                  <div className="border rounded-lg overflow-hidden">
                    <img
                      src={generatedImage}
                      alt="Generated"
                      className="w-full max-h-96 object-contain bg-gray-50 dark:bg-gray-700"
                    />
                  </div>
                  <div className="flex gap-4 mt-4">
                    <button
                      onClick={downloadImage}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                      📥 下载图像
                    </button>
                    <button
                      onClick={() => window.open(generatedImage, "_blank")}
                      className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                      🔗 新窗口查看
                    </button>
                  </div>
                </div>

                {/* API响应数据 */}
                {responseData && (
                  <div>
                    <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">
                      📄 API响应详情
                    </h4>
                    <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-sm overflow-x-auto">
                      {JSON.stringify(responseData, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 返回首页 */}
          <div className="text-center mt-8">
            <button
              onClick={() => window.location.href = "/"}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              ← 返回首页
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}