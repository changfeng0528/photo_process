import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { image, format } = await request.json();

    if (!image || !format) {
      return NextResponse.json(
        { error: '缺少图片数据或格式信息' },
        { status: 400 }
      );
    }

    // 检查环境变量
    const apiKey = process.env.ARK_API_KEY;
    if (!apiKey) {
      console.error('缺少 ARK_API_KEY 环境变量');
      return NextResponse.json(
        { error: '服务器配置错误：缺少 API Key' },
        { status: 500 }
      );
    }

    const prompt = "你是一个多模态图像理解专家，请对用户上传的图片进行深度分析：核心要求:先确认图片类型（照片、截图、图表、文档等）分层描述：从整体到局部，从主要到次要识别关键信息并优先呈现对模糊或不确定的内容进行标注。分析框架：1. 概要总结：用一句话概括图片核心内容2. 主体识别：主要对象/人物/场景及其关系3. 视觉元素：色彩、构图、风格、质量4. 文字信息：准确提取所有可见文字5. 功能用途：推断图片的可能用途或场景6. 特殊发现：异常、亮点或重要细节输出格式：使用清晰的段落和项目符号;重要信息优先展示;对识别置信度进行标注（如确定/可能/不确定）";

    const requestBody = {
      model: "ep-20251101232142-4rt58",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/${format};base64,${image}`
              }
            }
          ]
        }
      ]
    };

    console.log('发送请求到火山引擎 API...');

    const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('火山引擎 API 响应状态:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('火山引擎 API 错误:', response.status, errorText);
      return NextResponse.json(
        { error: `API 调用失败: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('火山引擎 API 响应数据:', JSON.stringify(data, null, 2));

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('API 返回格式错误:', data);
      return NextResponse.json(
        { error: 'API 返回格式错误' },
        { status: 500 }
      );
    }

    const result = data.choices[0].message.content;
    console.log('识别结果:', result);

    return NextResponse.json({ result });

  } catch (error) {
    console.error('图片识别错误:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}