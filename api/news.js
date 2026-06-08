module.exports = async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    
    if (req.method === "OPTIONS") return res.status(200).end();
    if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

    try {
        // 并行获取微博热搜 + 越南新闻
        const [weiboData, vnData] = await Promise.allSettled([
            fetchWeiboHot(),
            fetchVnNews()
        ]);

        const result = {
            updated: new Date().toISOString(),
            weibo: weiboData.status === "fulfilled" ? weiboData.value : [],
            vietnam: vnData.status === "fulfilled" ? vnData.value : []
        };

        // 如果两端都失败，返回错误
        if (result.weibo.length === 0 && result.vietnam.length === 0) {
            return res.status(502).json({ error: "无法获取新闻数据，请稍后重试", ...result });
        }

        // 缓存 5 分钟
        res.setHeader("Cache-Control", "public, max-age=300, s-maxage=300");
        return res.status(200).json(result);

    } catch (error) {
        console.error("News API error:", error);
        return res.status(500).json({ error: "服务器错误" });
    }
};

// ========== 微博热搜 ==========
async function fetchWeiboHot() {
    const response = await fetch("https://weibo.com/ajax/side/hotSearch", {
        headers: {
            "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
            "Accept": "application/json, text/plain, */*",
            "Accept-Language": "zh-CN,zh;q=0.9",
            "Referer": "https://weibo.com/"
        }
    });

    if (!response.ok) throw new Error("Weibo API failed: " + response.status);

    const json = await response.json();
    if (!json.ok || !json.data) throw new Error("Weibo API returned invalid data");

    const items = [];
    const realtime = json.data.realtime || [];

    for (const item of realtime.slice(0, 20)) {
        const word = (item.word || "").replace(/#/g, "");
        const hotScore = item.num || 0;
        const rank = item.realpos || (items.length + 1);

        items.push({
            rank,
            title: word,
            hotScore,
            hotScoreDisplay: formatHotScore(hotScore),
            url: item.word_scheme ? `https://s.weibo.com/weibo?q=%23${encodeURIComponent(word)}%23` : "#",
            tag: item.icon_desc || "",
            category: item.category || ""
        });
    }

    // 只保留前 15 条（去掉一些广告/低质量）
    return items.slice(0, 15);
}

// ========== 越南新闻 (VnExpress RSS) ==========
async function fetchVnNews() {
    const response = await fetch("https://vnexpress.net/rss/tin-moi-nhat.rss", {
        headers: {
            "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1)"
        }
    });

    if (!response.ok) return [];

    const xml = await response.text();
    const items = [];
    
    // 简单解析 RSS XML（避免引入额外依赖）
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;
    let count = 0;

    while ((match = itemRegex.exec(xml)) !== null && count < 10) {
        const itemXml = match[1];
        // Support both CDATA and plain text title
        let titleMatch = itemXml.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/);
        if (!titleMatch) titleMatch = itemXml.match(/<title>(.*?)<\/title>/);
        const linkMatch = itemXml.match(/<link>(.*?)<\/link>/);
        // Support both CDATA and plain text description
        let descMatch = itemXml.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/);
        if (!descMatch) descMatch = itemXml.match(/<description>(.*?)<\/description>/);
        const pubDateMatch = itemXml.match(/<pubDate>(.*?)<\/pubDate>/);

        if (titleMatch && linkMatch) {
            items.push({
                rank: count + 1,
                title: titleMatch[1],
                url: linkMatch[1],
                description: (descMatch ? descMatch[1] : "").replace(/<[^>]*>/g, "").slice(0, 100),
                pubDate: pubDateMatch ? pubDateMatch[1] : "",
                hotScore: 0,
                hotScoreDisplay: "",
                tag: "",
                category: "Tin tức"
            });
            count++;
        }
    }

    return items;
}

// ========== 热度格式化 ==========
function formatHotScore(num) {
    if (!num || num === 0) return "";
    if (num >= 10000 * 10000) return (num / (10000 * 10000)).toFixed(1) + "亿";
    if (num >= 10000) return (num / 10000).toFixed(0) + "万";
    return num.toString();
}
