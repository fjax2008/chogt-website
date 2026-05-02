module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { image, targetLang = 'zh' } = req.body;

    if (!image) return res.status(400).json({ error: '图片不能为空', result: '' });

    // 检查图片大小（base64 大约比原图大 33%，限制约 5MB 原图）
    if (image.length > 7 * 1024 * 1024) {
        return res.status(400).json({ error: '图片太大，请压缩后重试（建议小于5MB）', result: '' });
    }

    const apiKey = process.env.QWEN_API_KEY;

    if (!apiKey) {
        console.error('[OCR] 未配置 QWEN_API_KEY 环境变量');
        return res.status(500).json({ error: '服务未配置API密钥，请联系管理员', result: '' });
    }

    const apiUrl = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';

    const langMap = { zh: '简体中文', vi: '越南语' };
    const targetName = langMap[targetLang] || '简体中文';

    const prompt = targetLang === 'zh'
        ? `请识别图片中的越南语文字并翻译成中文。只输出中文翻译结果，不要显示原文，不要加任何说明。`
        : `请识别图片中的中文文字并翻译成越南语。只输出越南语翻译结果，不要显示原文，不要加任何说明。`;

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 25000);

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'qwen-vl-plus',
                messages: [
                    {
                        role: 'user',
                        content: [
                            { type: 'image_url', image_url: { url: image } },
                            { type: 'text', text: prompt }
                        ]
                    }
                ],
                temperature: 0.3,
                max_tokens: 2000
            }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        const data = await response.json();

        if (!response.ok) {
            const errMsg = data.error?.message || data.error?.code || 'API调用失败';
            console.error('[OCR] Qwen API error:', response.status, errMsg);
            return res.status(200).json({ error: `识别失败: ${errMsg}`, result: '' });
        }

        const result = data.choices?.[0]?.message?.content?.trim() || '';

        if (!result) {
            return res.status(200).json({ error: '图片中未识别到文字', result: '' });
        }

        return res.status(200).json({ result, error: null });

    } catch (error) {
        console.error('[OCR] error:', error);
        if (error.name === 'AbortError') {
            return res.status(200).json({ error: '识别超时，请尝试压缩图片后重试', result: '' });
        }
        return res.status(200).json({ error: `识别失败: ${error.message}`, result: '' });
    }
};
