const http = require('http');
const fs = require('fs');
const path = require('path');
const https = require('https');
const { WebSocketServer } = require('ws');

const PORT = process.env.PORT || 3000;

// ========== DeepSeek API 配置 ==========
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || '';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';

// ========== 阿里云通义千问 API 配置 ==========
const QWEN_API_KEY = process.env.QWEN_API_KEY || '';
const QWEN_API_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';

// ========== 房间管理 ==========
const rooms = new Map(); // roomId -> { users: Map<wsId, user>, createdAt }

function generateRoomId() {
  let id;
  do {
    id = String(Math.floor(10 + Math.random() * 90));
  } while (rooms.has(id));
  return id;
}

const ADJECTIVES = ['快乐的','勇敢的','聪明的','可爱的','酷酷的','温柔的','活泼的','冷静的','优雅的','机智的','甜甜的','暖暖的','闪闪的','萌萌的','酷酷的'];
const NOUNS = ['小猫','小狗','小兔','小鹿','小熊','小狐','小鹿','小鸟','小鱼','小龙','小虎','小马','小蝶','小星','小月'];

function generateUsername() {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const num = Math.floor(100 + Math.random() * 900);
  return adj + noun + num;
}

// ========== 翻译 (DeepSeek API) ==========
function translateText(text, sourceLang, targetLang) {
  return new Promise((resolve, reject) => {
    // 如果没有 API Key，降级到原文返回
    if (!DEEPSEEK_API_KEY) {
      console.warn('[翻译] 未配置 DEEPSEEK_API_KEY，返回原文');
      return resolve(text);
    }

    const langNames = {
      'zh': '中文',
      'vi': '越南语',
      'en': '英语',
      'ja': '日语',
      'ko': '韩语',
      'fr': '法语',
      'de': '德语',
      'es': '西班牙语',
      'ru': '俄语'
    };

    const sourceName = langNames[sourceLang] || sourceLang;
    const targetName = langNames[targetLang] || targetLang;

    const requestBody = JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: `你是一个专业的翻译助手。请将用户提供的文本从${sourceName}翻译成${targetName}。只返回翻译结果，不要添加任何解释、注释或额外内容。保持原文的语气和风格。`
        },
        {
          role: 'user',
          content: text
        }
      ],
      temperature: 0.3,
      max_tokens: 2048
    });

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      timeout: 15000
    };

    const req = https.request(DEEPSEEK_API_URL, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.choices && json.choices[0] && json.choices[0].message) {
            const translatedText = json.choices[0].message.content.trim();
            resolve(translatedText);
          } else if (json.error) {
            console.error('[DeepSeek API 错误]', json.error);
            resolve(text); // 出错时返回原文
          } else {
            resolve(text);
          }
        } catch (e) {
          console.error('[翻译解析错误]', e.message);
          resolve(text);
        }
      });
    });

    req.on('error', (err) => {
      console.error('[翻译请求错误]', err.message);
      resolve(text);
    });

    req.on('timeout', () => {
      console.error('[翻译请求超时]');
      req.destroy();
      resolve(text);
    });

    req.write(requestBody);
    req.end();
  });
}

// 语言检测
function detectLanguage(text) {
  const viChars = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i;
  const zhChars = /[\u4e00-\u9fff]/;
  const jaChars = /[\u3040-\u309f\u30a0-\u30ff]/;
  const koChars = /[\uac00-\ud7af]/;
  
  if (zhChars.test(text)) return 'zh';
  if (viChars.test(text)) return 'vi';
  if (jaChars.test(text)) return 'ja';
  if (koChars.test(text)) return 'ko';
  return 'zh';
}

// ========== OCR (阿里云通义千问 VL) ==========
function ocrImage(imageBase64, targetLang = 'zh') {
  return new Promise((resolve, reject) => {
    if (!QWEN_API_KEY) {
      console.warn('[OCR] 未配置 QWEN_API_KEY');
      return resolve('');
    }

    const langMap = { zh: '简体中文', vi: '越南语' };
    const targetName = langMap[targetLang] || '简体中文';

    const prompt = targetLang === 'zh'
      ? '请识别图片中的越南语文字并翻译成中文。只输出中文翻译结果，不要显示原文，不要加任何说明。'
      : '请识别图片中的中文文字并翻译成越南语。只输出越南语翻译结果，不要显示原文，不要加任何说明。';

    const requestBody = JSON.stringify({
      model: 'qwen-vl-max',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'image_url', image_url: { url: imageBase64 } },
            { type: 'text', text: prompt }
          ]
        }
      ],
      temperature: 0.3,
      max_tokens: 2000
    });

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${QWEN_API_KEY}`
      },
      timeout: 30000
    };

    const req = https.request(QWEN_API_URL, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.choices && json.choices[0] && json.choices[0].message) {
            resolve(json.choices[0].message.content.trim());
          } else if (json.error) {
            console.error('[Qwen API 错误]', json.error);
            resolve('');
          } else {
            resolve('');
          }
        } catch (e) {
          console.error('[OCR解析错误]', e.message);
          resolve('');
        }
      });
    });

    req.on('error', (err) => {
      console.error('[OCR请求错误]', err.message);
      resolve('');
    });

    req.on('timeout', () => {
      console.error('[OCR请求超时]');
      req.destroy();
      resolve('');
    });

    req.write(requestBody);
    req.end();
  });
}

// ========== HTTP 服务器 ==========
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

const server = http.createServer((req, res) => {
  // OCR API
  if (req.method === 'POST' && req.url === '/api/ocr') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const { image, targetLang } = JSON.parse(body);
        if (!image) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'Missing image' }));
        }
        const result = await ocrImage(image, targetLang || 'zh');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ text: result }));
      } catch (e) {
        console.error('[OCR错误]', e.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'OCR failed' }));
      }
    });
    return;
  }

  // 翻译 API
  if (req.method === 'POST' && req.url === '/api/translate') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const { text, source, target } = JSON.parse(body);
        if (!text || !target) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'Missing text or target' }));
        }
        const src = source || detectLanguage(text);
        const result = await translateText(text, src, target);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ translation: result, source: src }));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Translation failed' }));
      }
    });
    return;
  }

  // 静态文件
  let filePath = req.url === '/' ? '/index.html' : req.url;
  filePath = path.join(__dirname, 'public', filePath);

  const ext = path.extname(filePath);
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not Found');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

// ========== WebSocket 服务器 ==========
const wss = new WebSocketServer({ server });
let clientCounter = 0;

wss.on('connection', (ws) => {
  const clientId = `c${++clientCounter}`;
  let currentRoom = null;
  let userInfo = null;

  ws.on('message', async (raw) => {
    let msg;
    try { msg = JSON.parse(raw); } catch { return; }

    switch (msg.type) {
      case 'create-room': {
        const roomId = generateRoomId();
        const username = msg.username || generateUsername();
        const lang = msg.lang || 'zh';
        rooms.set(roomId, {
          users: new Map(),
          createdAt: Date.now()
        });
        currentRoom = roomId;
        userInfo = { id: clientId, username, lang, ws };
        rooms.get(roomId).users.set(clientId, userInfo);

        ws.send(JSON.stringify({
          type: 'room-created',
          roomId,
          username,
          userId: clientId,
          users: getUserList(roomId)
        }));
        break;
      }

      case 'join-room': {
        const roomId = msg.roomId;
        if (!rooms.has(roomId)) {
          ws.send(JSON.stringify({ type: 'error', message: '房间不存在' }));
          return;
        }
        const username = msg.username || generateUsername();
        const lang = msg.lang || 'zh';
        currentRoom = roomId;
        userInfo = { id: clientId, username, lang, ws };
        rooms.get(roomId).users.set(clientId, userInfo);

        ws.send(JSON.stringify({
          type: 'room-joined',
          roomId,
          username,
          userId: clientId,
          users: getUserList(roomId)
        }));

        // 通知其他人
        broadcast(roomId, {
          type: 'user-joined',
          userId: clientId,
          username,
          users: getUserList(roomId)
        }, clientId);
        break;
      }

      case 'message': {
        if (!currentRoom || !userInfo) return;
        const text = msg.text?.trim();
        if (!text) return;

        const room = rooms.get(currentRoom);
        if (!room) return;

        const srcLang = detectLanguage(text);

        // 为每个不同语言的用户翻译
        const translations = {};
        const promises = [];

        for (const [, user] of room.users) {
          if (user.id === clientId) continue; // 发送者自己不需要翻译
          if (user.lang === srcLang) continue; // 同语言不需要翻译

          const key = `${srcLang}-${user.lang}`;
          if (!translations[key]) {
            promises.push(
              translateText(text, srcLang, user.lang).then(result => {
                translations[key] = result;
              })
            );
          }
        }

        await Promise.all(promises);

        // 发送给每个人（翻译成各自的语言）
        for (const [, user] of room.users) {
          const key = `${srcLang}-${user.lang}`;
          const translatedText = user.lang === srcLang ? text : (translations[key] || text);

          user.ws.send(JSON.stringify({
            type: 'message',
            userId: clientId,
            username: userInfo.username,
            original: text,
            translated: translatedText,
            sourceLang: srcLang,
            targetLang: user.lang,
            isSelf: user.id === clientId,
            time: Date.now()
          }));
        }
        break;
      }

      case 'update-lang': {
        if (!currentRoom || !userInfo) return;
        userInfo.lang = msg.lang || 'zh';
        ws.send(JSON.stringify({ type: 'lang-updated', lang: userInfo.lang }));
        break;
      }

      case 'leave-room': {
        leaveRoom();
        break;
      }
    }
  });

  ws.on('close', () => {
    leaveRoom();
  });

  function leaveRoom() {
    if (currentRoom && rooms.has(currentRoom)) {
      const room = rooms.get(currentRoom);
      room.users.delete(clientId);

      if (room.users.size === 0) {
        rooms.delete(currentRoom);
      } else {
        broadcast(currentRoom, {
          type: 'user-left',
          userId: clientId,
          username: userInfo?.username,
          users: getUserList(currentRoom)
        });
      }
    }
    currentRoom = null;
    userInfo = null;
  }
});

function getUserList(roomId) {
  const room = rooms.get(roomId);
  if (!room) return [];
  return Array.from(room.users.values()).map(u => ({
    id: u.id,
    username: u.username,
    lang: u.lang
  }));
}

function broadcast(roomId, msg, excludeId) {
  const room = rooms.get(roomId);
  if (!room) return;
  const data = JSON.stringify(msg);
  for (const [id, user] of room.users) {
    if (id !== excludeId && user.ws.readyState === 1) {
      user.ws.send(data);
    }
  }
}

// 定时清理空房间（每5分钟）
setInterval(() => {
  const now = Date.now();
  for (const [id, room] of rooms) {
    if (room.users.size === 0 || now - room.createdAt > 3600000) {
      rooms.delete(id);
    }
  }
}, 300000);

server.listen(PORT, () => {
  console.log(`\n🌐 翻译聊天室已启动: http://localhost:${PORT}`);
  console.log(`📡 WebSocket: ws://localhost:${PORT}`);
  if (!DEEPSEEK_API_KEY) {
    console.log(`⚠️  警告: 未设置 DEEPSEEK_API_KEY 环境变量，翻译功能将返回原文`);
    console.log(`   请设置: export DEEPSEEK_API_KEY=your_api_key_here`);
  } else {
    console.log(`✅ DeepSeek API 已配置`);
  }
  console.log('');
});
