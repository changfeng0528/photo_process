"use client";

export default function Home() {
  const features = [
    {
      title: "图片压缩",
      description: "智能压缩图片，减小文件大小，保持画质",
      icon: "🗜️",
      href: "/compress"
    },
    {
      title: "抠图去背景",
      description: "AI智能抠图，一键去除背景",
      icon: "✂️",
      href: "/remove-bg"
    },
    {
      title: "图片识别",
      description: "AI识别图片内容，提取文字信息",
      icon: "🔍",
      href: "/recognize"
    },
    {
      title: "AI生图",
      description: "文字描述生成精美图片",
      icon: "🎨",
      href: "/generate"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            图片处理工具箱
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            专业的在线图片处理平台，提供压缩、抠图、识别、生成等多种功能
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group"
              onClick={() => window.location.href = feature.href}
            >
              <div className="text-6xl mb-6 text-center group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 text-center">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <p className="text-gray-500 dark:text-gray-400">
            选择上方功能开始处理您的图片
          </p>
        </div>
      </div>
    </div>
  );
}
