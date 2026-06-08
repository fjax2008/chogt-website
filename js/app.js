        // ========== i18n ==========
        const i18n = {
            zh: {
                pageTitle: '鹏哥翻译 - 中越互译',
                logo: '鹏哥翻译',
                subtitle: '中文 ⇄ 越南语 · 智能互译',
                modeTranslate: '翻译',
                modeCamera: '拍照',
                modeChat: '对话',
                modeChatroom: '聊天室',
                inputLabel: '输入',
                outputLabel: '翻译结果',
                inputPlaceholder: '粘贴文本，自动检测语言并翻译…',
                outputPlaceholder: '翻译结果将显示在这里…',
                translating: '正在翻译…',
                btnTranslate: '🌐 翻译',
                btnCopy: '📋 复制',
                btnClear: '🗑️ 清空',
                cameraTip: '点击下方按钮选择图片或拍照',
                ocrTitle: '翻译结果',
                yourChat: '你的对话',
                chatDirectionZh: '中文 → 越南语',
                chatDirectionVi: '越南语 → 中文',
                zhChatTip: '👆 在这里输入中文',
                viChatTip: '👆 越南朋友的回复',
                btnSend: '发送',
                viChat: '越南朋友',
                lobbyCreate: '🎯 创建新房间',
                lobbyJoin: '🔑 加入房间',
                lobbyCreateBtn: '🚀 创建房间',
                lobbyJoinBtn: '🚪 加入房间',
                lobbyOr: '或者加入已有房间',
                lobbyNickname: '你的昵称（留空自动生成）',
                lobbyRoomId: '输入房间号',
                footer: '微信号：D399HV · <a href="#">鹏哥提供</a> © <span id="footerYear"></span>',
                toastCopied: '已复制到剪贴板！',
                toastEmpty: '没有可复制的内容',
                toastCleared: '已清空',
                toastError: '翻译失败，请稍后重试',
                toastInputError: '请输入要翻译的文本',
                toastSentVi: '已发送给越南朋友 ✓',
                toastReceivedVi: '收到越南朋友消息 ✓',
                chatRoomIdCopied: '已复制房间号',
                chatUserJoined: '加入了房间',
                chatUserLeft: '离开了房间',
                chatLangSwitched: '已切换为中文',
                newsTitle: '📰 热点资讯',
                newsWeibo: '🇨🇳 微博热搜',
                newsVietnam: '🇻🇳 Tin Việt Nam',
                newsLoading: '正在加载热搜…',
                newsError: '暂无热搜数据',
                newsRefresh: '🔄 刷新',
                newsHotTag: '热',
                newsBoomTag: '爆',
                newsViewSource: '查看原文',
                modeNews: '热榜',
            },
            vi: {
                pageTitle: 'Dịch Thiên Thiên - Trung Việt',
                logo: 'Dịch Thiên Thiên',
                subtitle: 'Trung ⇄ Việt · Dịch thông minh',
                modeTranslate: 'Dịch',
                modeCamera: 'Ảnh',
                modeChat: 'Trò chuyện',
                modeChatroom: 'Phòng chat',
                inputLabel: 'Nhập',
                outputLabel: 'Kết quả',
                inputPlaceholder: 'Dán văn bản, tự động phát hiện ngôn ngữ…',
                outputPlaceholder: 'Kết quả dịch sẽ hiển thị ở đây…',
                translating: 'Đang dịch…',
                btnTranslate: '🌐 Dịch',
                btnCopy: '📋 Sao chép',
                btnClear: '🗑️ Xóa',
                cameraTip: 'Nhấn nút bên dưới để chọn ảnh hoặc chụp',
                ocrTitle: 'Kết quả dịch',
                yourChat: 'Hội thoại của bạn',
                chatDirectionZh: 'Trung → Việt',
                chatDirectionVi: 'Việt → Trung',
                zhChatTip: '👆 Nhập tiếng Trung ở đây',
                viChatTip: '👆 Trả lời từ bạn Việt Nam',
                btnSend: 'Gửi',
                viChat: 'Bạn Việt Nam',
                lobbyCreate: '🎯 Tạo phòng mới',
                lobbyJoin: '🔑 Tham gia phòng',
                lobbyCreateBtn: '🚀 Tạo phòng',
                lobbyJoinBtn: '🚪 Tham gia',
                lobbyOr: 'hoặc tham gia phòng có sẵn',
                lobbyNickname: 'Biệt danh (để trống tự tạo)',
                lobbyRoomId: 'Nhập mã phòng',
                footer: 'WeChat: D399HV · <a href="#">Thiết kế Phong</a> © <span id="footerYear"></span>',
                toastCopied: 'Đã sao chép!',
                toastEmpty: 'Không có nội dung',
                toastCleared: 'Đã xóa',
                toastError: 'Dịch thất bại, thử lại',
                toastInputError: 'Vui lòng nhập văn bản',
                toastSentVi: 'Đã gửi ✓',
                toastReceivedVi: 'Đã nhận ✓',
                chatRoomIdCopied: 'Đã sao chép mã phòng',
                chatUserJoined: 'đã tham gia',
                chatUserLeft: 'đã rời phòng',
                chatLangSwitched: 'Đã chuyển sang Tiếng Việt',
                newsTitle: '📰 Tin Hot',
                newsWeibo: '🇨🇳 Weibo Hot',
                newsVietnam: '🇻🇳 Tin Việt Nam',
                newsLoading: 'Đang tải tin hot…',
                newsError: 'Không có dữ liệu',
                newsRefresh: '🔄 Làm mới',
                newsHotTag: 'Hot',
                newsBoomTag: 'Bùng',
                newsViewSource: 'Xem nguồn',
                modeNews: 'Tin Hot',
            }
        };

        let currentLang = 'zh';
        try { currentLang = localStorage.getItem('chogt-lang') || 'zh'; } catch(_) {}

        function switchLang(lang) {
            currentLang = lang;
            try { localStorage.setItem('chogt-lang', lang); } catch(_) {}

            document.querySelectorAll('.lang-pill').forEach(btn => {
                btn.classList.toggle('active',
                    (lang === 'zh' && btn.textContent.includes('中')) ||
                    (lang === 'vi' && btn.textContent.includes('Việt'))
                );
            });

            updatePageText();
            updatePlaceholders();
            updateDate();
            updateFooterYear();
            showToast(lang === 'zh' ? '已切换为中文' : 'Đã chuyển sang Tiếng Việt');
        }

        function updateFooterYear() {
            const fy = document.getElementById('footerYear');
            if (fy) fy.textContent = new Date().getFullYear();
        }

        function updatePageText() {
            const t = i18n[currentLang];
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                if (t[key]) {
                    if (el.tagName === 'TITLE') document.title = t[key];
                    else el.innerHTML = t[key];
                }
            });
        }

        function updatePlaceholders() {
            const t = i18n[currentLang];
            document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
                const key = el.getAttribute('data-i18n-placeholder');
                if (t[key]) el.placeholder = t[key];
            });
        }

        function updateDate() {
            const now = new Date();
            const el = document.getElementById('dateDisplay');
            if (!el) return;
            if (currentLang === 'zh') {
                const days = ['周日','周一','周二','周三','周四','周五','周六'];
                const months = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
                el.textContent = `${days[now.getDay()]} ${months[now.getMonth()]}${now.getDate()}日`;
            } else {
                const days = ['CN','T2','T3','T4','T5','T6','T7'];
                const months = ['Th1','Th2','Th3','Th4','Th5','Th6','Th7','Th8','Th9','Th10','Th11','Th12'];
                el.textContent = `${days[now.getDay()]} ${now.getDate()} ${months[now.getMonth()]}`;
            }
        }

        // ========== INIT ==========
        document.addEventListener('DOMContentLoaded', () => {
            updatePageText();
            updatePlaceholders();
            updateDate();
            updateFooterYear();
            initApp();
            initSwipeGesture();

            // chat input auto-resize + enter send
            const ci = document.getElementById('chatInput');
            ci.addEventListener('input', () => { ci.style.height = '36px'; ci.style.height = Math.min(ci.scrollHeight, 80) + 'px'; });
            ci.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); crSend(); } });

            // URL param auto-join
            const p = new URLSearchParams(location.search).get('room');
            if (p && p.length === 2) document.getElementById('joinRoomId').value = p;

            // Dynamic footer year
            const fy = document.getElementById('footerYear');
            if (fy) fy.textContent = new Date().getFullYear();
        });

        // ========== MODE SWITCH ==========
        function setMode(mode) {
            currentModeIndex = MODES.indexOf(mode);
            document.querySelectorAll('.mode-tab').forEach(b => b.classList.toggle('active', b.dataset.mode === mode));
            document.getElementById('translateMode').style.display = mode === 'translate' ? 'block' : 'none';
            document.getElementById('cameraMode').style.display = mode === 'camera' ? 'flex' : 'none';
            document.getElementById('conversationMode').style.display = mode === 'conversation' ? 'flex' : 'none';
            document.getElementById('chatroomMode').style.display = mode === 'chatroom' ? 'flex' : 'none';
            document.getElementById('newsMode').style.display = mode === 'news' ? 'flex' : 'none';
            if (mode === 'news' && !newsLoaded) { fetchNews(); }
        }

        // ========== SWIPE GESTURE FOR MODE SWITCH ==========
        const MODES = ['translate', 'camera', 'conversation', 'chatroom', 'news'];
        let currentModeIndex = 0;
        let touchStartX = 0;
        let touchStartY = 0;

        function initSwipeGesture() {
            const app = document.querySelector('.app');
            if (!app) return;

            app.addEventListener('touchstart', (e) => {
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
            }, { passive: true });

            app.addEventListener('touchend', (e) => {
                const touchEndX = e.changedTouches[0].clientX;
                const touchEndY = e.changedTouches[0].clientY;
                const deltaX = touchEndX - touchStartX;
                const deltaY = touchEndY - touchStartY;

                // 水平滑动大于垂直滑动，且滑动距离 > 50px
                if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                    if (deltaX < 0 && currentModeIndex < MODES.length - 1) {
                        // 左滑 -> 下一个模式
                        currentModeIndex++;
                        setMode(MODES[currentModeIndex]);
                        showToast(i18n[currentLang]['mode' + MODES[currentModeIndex].charAt(0).toUpperCase() + MODES[currentModeIndex].slice(1)] || MODES[currentModeIndex]);
                    } else if (deltaX > 0 && currentModeIndex > 0) {
                        // 右滑 -> 上一个模式
                        currentModeIndex--;
                        setMode(MODES[currentModeIndex]);
                        showToast(i18n[currentLang]['mode' + MODES[currentModeIndex].charAt(0).toUpperCase() + MODES[currentModeIndex].slice(1)] || MODES[currentModeIndex]);
                    }
                }
            }, { passive: true });
        }

        // ========== TRANSLATE ==========
        let inputEl, outputEl, loadingEl;
        let debounceTimer = null, lastText = '';

        function initApp() {
            inputEl = document.getElementById('input');
            outputEl = document.getElementById('output');
            loadingEl = document.getElementById('loading');

            inputEl.addEventListener('input', () => {
                clearTimeout(debounceTimer);
                const text = inputEl.value.trim();
                if (!text) { outputEl.value = ''; lastText = ''; return; }
                if (text === lastText) return;
                lastText = text;
                debounceTimer = setTimeout(() => translateText(), 800);
            });

            inputEl.addEventListener('paste', () => {
                setTimeout(() => {
                    const text = inputEl.value.trim();
                    if (text && text !== lastText) { lastText = text; translateText(); }
                }, 100);
            });
        }

        // ========== 翻译 API (通过后端代理) ==========
        async function callTranslate(text, source, target) {
            const r = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, source, target })
            });
            if (!r.ok) throw new Error('API error');
            const d = await r.json();
            return d.translation;
        }

        async function callOCR(imageBase64, targetLang) {
            const r = await fetch('/api/ocr', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: imageBase64, targetLang })
            });
            if (!r.ok) throw new Error('服务器错误，请稍后重试');
            const d = await r.json();
            if (d.error) throw new Error(d.error);
            return d.result;
        }

        function detectLanguage(text) {
            if (/[\u4e00-\u9fff]/.test(text)) return 'zh';
            if (/[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(text)) return 'vi';
            return 'zh';
        }

        async function translateText() {
            const text = inputEl.value.trim();
            if (!text) { showToast(i18n[currentLang].toastInputError); return; }

            const src = detectLanguage(text);
            const tgt = src === 'zh' ? 'vi' : 'zh';
            loadingEl.classList.add('show');

            try {
                const result = await callTranslate(text, src, tgt);
                outputEl.value = result;
                copyToClipboard(result);
                showToast('翻译完成，已自动复制！');
            } catch (e) {
                showToast(i18n[currentLang].toastError);
            } finally {
                loadingEl.classList.remove('show');
            }
        }

        function copyResult() {
            const t = outputEl.value.trim();
            if (!t) { showToast(i18n[currentLang].toastEmpty); return; }
            copyToClipboard(t);
            showToast(i18n[currentLang].toastCopied);
        }

        function copyToClipboard(t) {
            navigator.clipboard.writeText(t).catch(() => {});
        }

        function clearAll() {
            inputEl.value = ''; outputEl.value = ''; lastText = '';
            showToast(i18n[currentLang].toastCleared);
        }

        // ========== CAMERA ==========
        let currentImageData = null;

        function selectImage() { document.getElementById('imageInput').click(); }
        function takePhoto() { document.getElementById('cameraInput').click(); }

        // 图片压缩：缩小 + 降低质量，减少上传时间和 API 处理时间
        function compressImage(fileOrUrl) {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => {
                    const MAX = 1024;
                    let w = img.width, h = img.height;
                    if (w > MAX || h > MAX) {
                        if (w > h) { h = Math.round(h * MAX / w); w = MAX; }
                        else       { w = Math.round(w * MAX / h); h = MAX; }
                    }
                    const c = document.createElement('canvas');
                    c.width = w; c.height = h;
                    c.getContext('2d').drawImage(img, 0, 0, w, h);
                    resolve(c.toDataURL('image/jpeg', 0.75));
                };
                img.src = typeof fileOrUrl === 'string' ? fileOrUrl : URL.createObjectURL(fileOrUrl);
            });
        }

        function handleImageSelect(e) {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = async (ev) => {
                currentImageData = await compressImage(file);
                document.getElementById('cameraPreview').innerHTML = `<img src="${currentImageData}" alt="preview">`;
                performOCR();
            };
            reader.readAsDataURL(file);
        }

        async function performOCR() {
            if (!currentImageData) return;
            const resultBox = document.getElementById('ocrResultBox');
            const resultEl = document.getElementById('ocrResult');
            const preview = document.getElementById('cameraPreview');
            preview.innerHTML = '<div class="ocr-loading"><div class="spinner"></div>AI 识别翻译中…</div>';
            try {
                const ocrText = await callOCR(currentImageData, currentLang === 'zh' ? 'zh' : 'vi');
                preview.innerHTML = `<img src="${currentImageData}" alt="preview">`;
                resultBox.classList.add('show');
                resultEl.textContent = ocrText || '未识别到文字';
                showToast('识别完成！');
            } catch (err) {
                preview.innerHTML = `<div class="ocr-loading" style="color:var(--error)">😢 ${esc(err.message) || '识别失败，请重试'}</div>`;
            }
        }

        function copyOcrResult() {
            navigator.clipboard.writeText(document.getElementById('ocrResult').textContent).then(() => showToast(i18n[currentLang].toastCopied));
        }

        function resetCamera() {
            currentImageData = null;
            document.getElementById('cameraPreview').innerHTML = '<div class="camera-placeholder"><span class="cam-icon">📷</span><p>' + i18n[currentLang].cameraTip + '</p></div>';
            document.getElementById('ocrResultBox').classList.remove('show');
            document.getElementById('imageInput').value = '';
            document.getElementById('cameraInput').value = '';
        }

        // ========== CONVERSATION ==========
        async function sendZhMessage() {
            const input = document.getElementById('zhInput');
            const text = input.value.trim();
            if (!text) return;
            addConvoMsg('zh', text, true);
            input.value = '';
            try {
                const t = await callTranslate(text, 'zh', 'vi');
                addConvoTranslated('vi', t);
            } catch { showToast(i18n[currentLang].toastError); }
        }

        async function sendViMessage() {
            const input = document.getElementById('viInput');
            const text = input.value.trim();
            if (!text) return;
            addConvoMsg('vi', text, true);
            input.value = '';
            try {
                const t = await callTranslate(text, 'vi', 'zh');
                addConvoTranslated('zh', t);
            } catch { showToast(i18n[currentLang].toastError); }
        }

        function addConvoMsg(type, text, self) {
            const box = document.getElementById(type === 'zh' ? 'zhMessages' : 'viMessages');
            const empty = box.querySelector('.convo-empty');
            if (empty) empty.remove();

            const time = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
            const div = document.createElement('div');
            div.className = `convo-msg ${self ? 'self' : 'other'}`;
            div.innerHTML = `<div class="convo-msg-bubble">${esc(text)}</div><div class="convo-msg-time">${time}</div>`;
            box.appendChild(div);
            box.scrollTop = box.scrollHeight;
        }

        function addConvoTranslated(type, text) {
            addConvoMsg(type, '📤 ' + text, true);
            showToast(i18n[type === 'vi' ? 'currentLang' : 'currentLang'].toastSentVi || '已发送 ✓');
            showToast(type === 'vi' ? i18n[currentLang].toastSentVi : i18n[currentLang].toastReceivedVi);
        }

        function esc(t) { const d = document.createElement('div'); d.textContent = t; return d.innerHTML; }

        // ========== CHATROOM ==========
        let crWs = null, crUserId = null, crUsername = '', crLang = 'zh', crRoomId = '';

        function crConnect(onOpen) {
            const WS_HOST = window.CHAT_WS_HOST || 'wss://chogt-chatroom.onrender.com';
            crWs = new WebSocket(WS_HOST);
            crWs.onopen = () => { crSetConn('ok'); onOpen(); };
            crWs.onmessage = e => crHandle(JSON.parse(e.data));
            crWs.onclose = () => {
                crSetConn('err');
                if (document.getElementById('chatPanel').style.display !== 'none') {
                    setTimeout(() => {
                        showToast('正在重新连接…');
                        crConnect(() => crWs.send(JSON.stringify({ type: 'join-room', roomId: crRoomId, username: crUsername, lang: crLang })));
                    }, 3000);
                }
            };
            crWs.onerror = () => crSetConn('err');
        }

        function crHandle(msg) {
            switch (msg.type) {
                case 'room-created':
                    crRoomId = msg.roomId; crUserId = msg.userId; crUsername = msg.username;
                    crEnter(msg.users);
                    crSys(`房间已创建：${crRoomId}，分享给朋友一起聊天吧！`);
                    break;
                case 'room-joined':
                    crRoomId = msg.roomId; crUserId = msg.userId; crUsername = msg.username;
                    crEnter(msg.users);
                    crSys(`已加入房间 ${crRoomId}`);
                    break;
                case 'user-joined': crUsers(msg.users); crSys(`${msg.username} ${i18n[currentLang].chatUserJoined}`); break;
                case 'user-left': crUsers(msg.users); crSys(`${msg.username} ${i18n[currentLang].chatUserLeft}`); break;
                case 'message': crMsg(msg); break;
                case 'error': showToast(msg.message); break;
            }
        }

        function crCreateRoom() {
            const name = document.getElementById('createName').value.trim();
            crLang = document.getElementById('createLang').value;
            crConnect(() => crWs.send(JSON.stringify({ type: 'create-room', username: name, lang: crLang })));
        }

        function crJoinRoom() {
            const id = document.getElementById('joinRoomId').value.trim();
            if (!id || id.length !== 6) { showToast('请输入6位房间号'); return; }
            const name = document.getElementById('joinName').value.trim();
            crLang = document.getElementById('joinLang').value;
            crRoomId = id;
            crConnect(() => crWs.send(JSON.stringify({ type: 'join-room', roomId: id, username: name, lang: crLang })));
        }

        function crEnter(users) {
            document.getElementById('chatLobby').style.display = 'none';
            const panel = document.getElementById('chatPanel');
            panel.style.display = 'flex';
            panel.style.flexDirection = 'column';
            panel.style.flex = '1';
            document.getElementById('chatRoomId').textContent = crRoomId;
            crUsers(users);
            crUpdateTag();
            // 监听软键盘弹出/收起，自动滚动到最新消息
            if (window.visualViewport) {
                window.visualViewport.removeEventListener('resize', crOnViewportResize);
                window.visualViewport.addEventListener('resize', crOnViewportResize);
            }
            document.getElementById('chatInput').focus();
        }

        function crOnViewportResize() {
            const box = document.getElementById('chatMessages');
            if (box) {
                requestAnimationFrame(() => { box.scrollTop = box.scrollHeight; });
            }
        }

        function crUsers(users) {
            document.getElementById('chatUsers').innerHTML = users.map(u => {
                const me = u.id === crUserId;
                const flag = u.lang === 'vi' ? '🇻🇳' : '🇨🇳';
                return `<span class="user-pill ${me ? 'me' : 'other'}">${flag} ${esc(u.username)}${me ? ' (我)' : ''}</span>`;
            }).join('');
        }

        function crMsg(msg) {
            const box = document.getElementById('chatMessages');
            const self = msg.userId === crUserId;
            const div = document.createElement('div');
            div.className = `cr-msg ${self ? 'self' : 'other'}`;
            const time = new Date(msg.time).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
            const flag = msg.sourceLang === 'vi' ? '🇻🇳' : '🇨🇳';
            let body;
            if (self) {
                body = `<div class="cr-bubble">${esc(msg.original)}</div>`;
            } else {
                const diff = msg.translated !== msg.original;
                body = `<div class="cr-bubble">${esc(msg.translated)}${diff ? `<div class="cr-translated">📎 ${flag} ${esc(msg.original)}</div>` : ''}</div>`;
            }
            div.innerHTML = `${self ? '' : `<div class="cr-sender">${flag} ${esc(msg.username)}</div>`}${body}<div class="cr-time">${time}</div>`;
            box.appendChild(div);
            requestAnimationFrame(() => {
                box.scrollTop = box.scrollHeight;
            });
        }

        function crSys(text) {
            const d = document.createElement('div');
            d.className = 'cr-sys';
            document.getElementById('chatMessages').appendChild(d);
            d.textContent = text;
            requestAnimationFrame(() => {
                const m = document.getElementById('chatMessages');
                m.scrollTop = m.scrollHeight;
            });
        }

        function crSend() {
            const inp = document.getElementById('chatInput');
            const text = inp.value.trim();
            if (!text || !crWs || crWs.readyState !== 1) return;
            crWs.send(JSON.stringify({ type: 'message', text }));
            inp.value = '';
            inp.style.height = '36px';
            // 先滚动到底部，再恢复焦点
            const box = document.getElementById('chatMessages');
            requestAnimationFrame(() => {
                box.scrollTop = box.scrollHeight;
            });
            inp.focus();
        }

        function crLeave() {
            if (crWs) crWs.close();
            document.getElementById('chatPanel').style.display = 'none';
            document.getElementById('chatLobby').style.display = 'block';
            document.getElementById('chatMessages').innerHTML = '';
            crRoomId = ''; crUserId = null;
            if (window.visualViewport) {
                window.visualViewport.removeEventListener('resize', crOnViewportResize);
            }
        }

        function crCopyRoom() {
            navigator.clipboard.writeText(crRoomId).then(() => showToast(`${i18n[currentLang].chatRoomIdCopied}: ${crRoomId}`));
        }

        function crCycleLang() {
            crLang = crLang === 'zh' ? 'vi' : 'zh';
            crUpdateTag();
            if (crWs && crWs.readyState === 1) crWs.send(JSON.stringify({ type: 'update-lang', lang: crLang }));
            showToast(i18n[currentLang].chatLangSwitched);
        }

        function crUpdateTag() {
            document.getElementById('chatLangTag').textContent = crLang === 'zh' ? '中' : 'Vi';
        }

        function crSetConn(s) {
            const el = document.getElementById('chatConn');
            el.className = `conn-indicator ${s}`;
        }

        // ========== NEWS ==========
        let newsData = { weibo: [], vietnam: [] };
        let newsLoaded = false;
        let currentNewsTab = 'weibo';

        async function fetchNews() {
            const loading = document.getElementById('newsLoading');
            const list = document.getElementById('newsList');
            const error = document.getElementById('newsError');

            loading.style.display = 'flex';
            list.style.display = 'none';
            error.style.display = 'none';

            try {
                const resp = await fetch('/api/news');
                if (!resp.ok) throw new Error('API error');
                newsData = await resp.json();
                newsLoaded = true;

                document.getElementById('newsUpdated').textContent =
                    '更新于 ' + new Date(newsData.updated).toLocaleTimeString('zh-CN', { hour:'2-digit', minute:'2-digit' });

                renderNews();
            } catch(e) {
                console.error('News fetch failed:', e);
                loading.style.display = 'none';
                error.style.display = 'flex';
            }
        }

        function switchNewsTab(tab) {
            currentNewsTab = tab;
            document.querySelectorAll('.news-subtab').forEach(b => {
                const span = b.querySelector('span');
                const isWeibo = span && span.getAttribute('data-i18n') === 'newsWeibo';
                const isVietnam = span && span.getAttribute('data-i18n') === 'newsVietnam';
                b.classList.toggle('active',
                    (tab === 'weibo' && isWeibo) || (tab === 'vietnam' && isVietnam)
                );
            });
            renderNews();
        }

        function renderNews() {
            const list = document.getElementById('newsList');
            const loading = document.getElementById('newsLoading');
            const error = document.getElementById('newsError');

            loading.style.display = 'none';

            const items = currentNewsTab === 'weibo' ? newsData.weibo : newsData.vietnam;

            if (!items || items.length === 0) {
                list.style.display = 'none';
                error.style.display = 'flex';
                return;
            }

            error.style.display = 'none';
            list.style.display = 'flex';
            list.innerHTML = items.map(item => renderNewsItem(item)).join('');

            // 入场动画
            list.querySelectorAll('.news-item').forEach((el, i) => {
                el.style.opacity = '0';
                el.style.transform = 'translateX(-10px)';
                setTimeout(() => {
                    el.style.transition = 'all 0.3s ease';
                    el.style.opacity = '1';
                    el.style.transform = 'translateX(0)';
                }, i * 50);
            });
        }

        function renderNewsItem(item) {
            const rankClass = item.rank === 1 ? 'top1' : item.rank === 2 ? 'top2' : item.rank === 3 ? 'top3' : 'normal';
            const rankIcon = currentNewsTab === 'weibo' && item.rank <= 3
                ? (item.rank === 1 ? '🥇' : item.rank === 2 ? '🥈' : '🥉')
                : item.rank;
            const tagClass = item.tag === '爆' ? 'boom' : 'hot';
            const tag = item.tag || '';

            const hotScoreHtml = item.hotScoreDisplay
                ? `<span class="news-hot">🔥 ${item.hotScoreDisplay}</span>`
                : (item.pubDate ? `<span class="news-hot">${item.pubDate}</span>` : '');

            const tagHtml = tag ? `<span class="news-tag ${tagClass}">${tag}</span>` : '';

            return `
                <a class="news-item" href="${item.url}" target="_blank" rel="noopener">
                    <span class="news-rank ${rankClass}">${rankIcon}</span>
                    <span class="news-info">
                        <span class="news-title">${esc(item.title)}</span>
                        <span class="news-meta">${tagHtml}${hotScoreHtml}</span>
                    </span>
                    <span class="news-arrow">›</span>
                </a>
            `;
        }

        function refreshNews() {
            newsLoaded = false;
            fetchNews();
        }

        // ========== TOAST ==========
        function showToast(msg) {
            const t = document.getElementById('toast');
            t.textContent = msg;
            t.classList.add('show');
            clearTimeout(t._timer);
            t._timer = setTimeout(() => t.classList.remove('show'), 2200);
        }

