import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "缺少必要参数：prompt" },
        { status: 400 }
      );
    }

    const apiKey = process.env.ARK_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "服务器未配置API密钥" },
        { status: 500 }
      );
    }

    const apiUrl = "https://ark.cn-beijing.volces.com/api/v3/images/generations";

    const requestData = {
      model: "ep-20251102005828-q6srq",
      prompt: prompt,
      sequential_image_generation: "disabled",
      response_format: "url",
      size: "2K",
      stream: false,
      watermark: true
    };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        {
          error: `火山引擎API错误: ${response.status} ${response.statusText}`,
          details: errorText
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error: any) {
    console.error("API路由错误:", error);
    return NextResponse.json(
      { error: "服务器内部错误", details: error.message },
      { status: 500 }
    );
  }
}