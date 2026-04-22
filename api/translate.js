module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    let { text, source, target, tone } = req.body;
    
    if (!text) {
        return res.status(400).json({ error: 'Text is required' });
    }
    
    // 过滤所有 [xxx] 格式的表情标签，避免干扰翻译
    const emojiTags = [];
    const cleanText = text.replace(/\[.+?\]/g, (match) => {
        emojiTags.push(match);
        return '';
    }).trim();
    
    const apiKey = process.env.DEEPSEEK_API_KEY;
    
    const langMap = {
        'zh': '简体中文',
        'vi': '越南语'
    };
    
    // 根据语气模式构建不同的 prompt
    let toneInstruction = '';
    if (tone === 'casual') {
        toneInstruction = `
重要：请使用**口语化**的表达方式翻译！
- 不要用书面语、敬语或正式表达
- 使用日常生活中最自然的说话方式
- 可以用口语缩写、语气词（如越南语用 "nha", "nhé", "à" 等）
- 像朋友之间聊天一样自然
- 如果是中文翻译，用大白话，不要太文绉绉`;
    } else {
        toneInstruction = `
翻译要求：
- 翻译准确、自然、流畅
- 保持原文的语气和风格
- 使用当地人真正在用的表达方式，不要生硬直译`;
    }

    // 针对越南语翻译的专项优化
    let vietnameseTips = '';
    if (target === 'vi') {
        vietnameseTips = `
【越南语地道翻译专项要求】
- 使用越南语母语者常用的自然表达，避免中式越南语
- 正确使用人称代词（anh/em/chị/ông/bà/mình/cậu）根据语境选择合适的称呼
- 适当使用越南语常用语气词：nhé, nha, nè, à, đấy, đó, chứ, nữa
- 使用越南语习惯用语和俚语，让表达更接地气
- 数量词和量词要符合越南语习惯（如 "một cái"、"một con"、"một ly"）
- 时间表达要地道（如 "hôm nay"、"ngày mai"、"tuần trước"）
- 不要逐字翻译，要理解意思后用越南语重新表达
- 保持越南语自然的语序（主-谓-宾），不要受中文语序影响`;
    } else if (target === 'zh') {
        vietnameseTips = `
【中文地道翻译专项要求】
- 将越南语翻译成中国人真正会说的自然中文
- 正确理解和翻译越南语的人称代词（anh=哥/你, em=妹妹/你, chị=姐姐/你）
- 语气词要转换为中文对应表达（nhé→吧/哦, nha→哈/哦, à→啊）
- 不要生硬直译，要理解越南语语境后用中文重新表达`;
    }
    
    const prompt = `你是一个资深中越翻译专家，长期生活在越南，精通中越两国语言和文化。请将以下${langMap[source] || source}文本翻译成${langMap[target] || target}。
${toneInstruction}
${vietnameseTips}
- 只输出翻译结果，不要添加任何解释或说明

原文：
${cleanText}`;

    try {
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [
                    {
                        role: 'system',
                        content: '你是一个资深中越翻译专家，长期生活在越南，精通中越两国语言文化。你了解越南语的地道表达、习惯用语、人称代词用法和语气词规则，翻译出来的越南语就像母语者说的一样自然。'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.3,
                max_tokens: 2000
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('DeepSeek API error:', errorData);
            return res.status(500).json({ error: 'Translation failed', details: errorData });
        }
        
        const data = await response.json();
        let translation = data.choices?.[0]?.message?.content?.trim() || '';
        
        // 如果原文有表情标签，追加到翻译结果末尾
        if (emojiTags.length > 0) {
            translation = translation + ' ' + emojiTags.join('');
        }
        
        return res.status(200).json({ translation });
        
    } catch (error) {
        console.error('Translation error:', error);
        return res.status(500).json({ error: 'Translation failed', message: error.message });
    }
};
