module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { image, targetLang = 'zh' } = req.body;

    if (!image) return res.status(400).json({ error: 'Image is required' });

    const apiKey = 'sk-682a1ff0796449d08926320b885e664a';
        const apiUrl = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';
        
        const langMap = { zh: '简体中文', vi: '越南语' };
        const targetName = langMap[targetLang] || '简体中文';
        
        const prompt = targetLang === 'zh'
            ? `请识别图片中的越南语文字并翻译成中文。只输出中文翻译结果，不要显示原文，不要加任何说明。`
            : `请识别图片中的中文文字并翻译成越南语。只输出越南语翻译结果，不要显示原文，不要加任何说明。`;
        
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'qwen-vl-max',
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
                })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                return res.status(200).json({ error: 'ocr_failed', message: data.error?.message || '识别失败' });
            }
            
            const result = data.choices?.[0]?.message?.content?.trim() || '';
            return res.status(200).json({ result });
            
        } catch (error) {
            console.error('OCR error:', error);
            return res.status(500).json({ error: 'ocr_failed', message: error.message });
        }
};
