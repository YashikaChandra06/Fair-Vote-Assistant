document.addEventListener('DOMContentLoaded', () => {
    // 0. Set User Name from Login
    const urlParams = new URLSearchParams(window.location.search);
    const fullNameParam = urlParams.get('fullname');
    
    if (fullNameParam) {
        const userNameDisplay = document.getElementById('userNameDisplay');
        const userAvatar = document.getElementById('userAvatar');
        
        const name = fullNameParam.trim().toUpperCase();
        userNameDisplay.textContent = name;
        
        // Extract Initials
        const nameParts = name.split(' ');
        let initials = nameParts[0] ? nameParts[0].charAt(0) : '';
        if (nameParts.length > 1) {
            initials += nameParts[nameParts.length - 1].charAt(0);
        }
        userAvatar.textContent = initials.substring(0, 2);
    }

    // 1. Clock Widget
    function updateClock() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-IN', { hour12: false }) + ' IST';
        document.getElementById('currentTime').textContent = timeString;
    }
    setInterval(updateClock, 1000);
    updateClock();

    // 2. Theme Toggle Logic
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const htmlElement = document.documentElement;
    
    // Check local storage for theme preference
    const savedTheme = localStorage.getItem('fairvote-theme');
    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
    }

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('fairvote-theme', newTheme);
        
        // Re-render charts to match theme colors if needed
        if(window.turnoutChartInstance) updateChartColors(window.turnoutChartInstance, newTheme);
        if(window.seatShareChartInstance) updateChartColors(window.seatShareChartInstance, newTheme);
        
        // Refresh Map Tiles (mocking it by invalidate size or swapping layers if we had multiple)
        if(window.mapInstance) window.mapInstance.invalidateSize();
    });

    // 3. Sidebar Navigation
    const navBtns = document.querySelectorAll('.nav-btn[data-target]');
    const panels = document.querySelectorAll('.panel');
    const pageTitle = document.getElementById('pageTitle');

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update Active State
            navBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Switch Panels
            const targetId = btn.getAttribute('data-target');
            panels.forEach(p => {
                p.classList.remove('active');
                p.classList.add('hidden');
            });
            const targetPanel = document.getElementById(targetId);
            targetPanel.classList.remove('hidden');
            targetPanel.classList.add('active');
            
            // Re-trigger animation
            targetPanel.classList.remove('fade-in');
            void targetPanel.offsetWidth; // trigger reflow
            targetPanel.classList.add('fade-in');

            // Update Title
            pageTitle.textContent = btn.textContent.trim();

            // Special handling for map tab resizing
            if (targetId === 'panel-booth' && window.mapInstance) {
                setTimeout(() => window.mapInstance.invalidateSize(), 100);
            }
        });
    });

    // Helper for Chart colors
    function getThemeColors(theme) {
        return theme === 'dark' ? {
            text: '#94a3b8',
            grid: 'rgba(51, 65, 85, 0.5)'
        } : {
            text: '#475569',
            grid: 'rgba(226, 232, 240, 0.8)'
        };
    }

    function updateChartColors(chart, theme) {
        const colors = getThemeColors(theme);
        chart.options.scales.x.ticks.color = colors.text;
        chart.options.scales.y.ticks.color = colors.text;
        chart.options.scales.x.grid.color = colors.grid;
        chart.options.scales.y.grid.color = colors.grid;
        chart.update();
    }

    // 4. Initialize Charts (Chart.js)
    function initCharts() {
        const theme = htmlElement.getAttribute('data-theme') || 'dark';
        const colors = getThemeColors(theme);

        // Turnout Line Chart
        const ctxTurnout = document.getElementById('turnoutChart').getContext('2d');
        window.turnoutChartInstance = new Chart(ctxTurnout, {
            type: 'line',
            data: {
                labels: ['07:00', '09:00', '11:00', '13:00', '15:00', '17:00', '18:00'],
                datasets: [{
                    label: 'Turnout %',
                    data: [8, 22, 38, 51, 64, 68, 68.2],
                    borderColor: '#6366f1',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { ticks: { color: colors.text }, grid: { color: colors.grid } },
                    y: { ticks: { color: colors.text }, grid: { color: colors.grid }, min: 0, max: 100 }
                }
            }
        });

        // Seat Share Donut Chart
        const ctxSeat = document.getElementById('seatShareChart').getContext('2d');
        window.seatShareChartInstance = new Chart(ctxSeat, {
            type: 'doughnut',
            data: {
                labels: ['Vanguard', 'Alliance', 'Independents'],
                datasets: [{
                    data: [290, 210, 43],
                    backgroundColor: ['#6366f1', '#14b8a6', '#f59e0b'],
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: { position: 'bottom', labels: { color: colors.text } }
                }
            }
        });
    }

    // 5. Initialize Map (Leaflet.js)
    function initMap() {
        // Center on New Delhi
        window.mapInstance = L.map('map').setView([28.6139, 77.2090], 12);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(window.mapInstance);

        // Add some markers
        L.marker([28.6239, 77.2190]).addTo(window.mapInstance)
            .bindPopup('<b>Kendriya Vidyalaya</b><br>Wait: 15m');
        L.marker([28.6039, 77.1990]).addTo(window.mapInstance)
            .bindPopup('<b>Govt Girls College</b><br>Wait: 45m');
    }

    // 6. AI Assistant Chatbot Logic
    function initChat() {
        const chatMessages = document.getElementById('chatMessages');
        const chatInput = document.getElementById('chatInput');
        const chatSendBtn = document.getElementById('chatSendBtn');
        const chatOptions = document.getElementById('chatOptions');

        const faqs = [
            "What documents do I need?", "Where is my booth?", "How to use EVM?"
        ];

        faqs.forEach(faq => {
            const btn = document.createElement('button');
            btn.className = 'chat-btn';
            btn.textContent = faq;
            btn.addEventListener('click', () => {
                addUserMessage(faq);
                setTimeout(() => addBotMessage("I am the FairVote AI. You asked: " + faq + ". Retrieving official directives..."), 600);
            });
            chatOptions.appendChild(btn);
        });

        chatSendBtn.addEventListener('click', handleChatSubmit);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleChatSubmit();
        });

        async function handleChatSubmit() {
            const text = chatInput.value.trim();
            if (!text) return;
            
            addUserMessage(text);
            chatInput.value = '';

            const typingMsg = addBotMessage("Processing query parameters...");

            setTimeout(() => {
                typingMsg.querySelector('.msg-content').textContent = `Query processed: "${text}". Please refer to the official Election Commission guidelines for detailed information.`;
            }, 1000);
        }

        function addUserMessage(text) {
            const msg = document.createElement('div');
            msg.className = 'message user-message';
            msg.innerHTML = `
                <div class="msg-avatar"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg></div>
                <div class="msg-content">${text}</div>
            `;
            chatMessages.appendChild(msg);
            scrollToBottom();
        }

        function addBotMessage(text) {
            const msg = document.createElement('div');
            msg.className = 'message bot-message';
            msg.innerHTML = `
                <div class="msg-avatar"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg></div>
                <div class="msg-content">${text}</div>
            `;
            chatMessages.appendChild(msg);
            scrollToBottom();
            return msg;
        }

        function scrollToBottom() {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }

    // 7. Populate New Features
    function populateCandidateExplorer() {
        const grid = document.getElementById('candidateGrid');
        const candidates = [
            { name: "Arvind Mehta", party: "Vanguard Party", edu: "Ph.D Economics", assets: "₹2.5 Cr", crime: 0 },
            { name: "Sunita Rao", party: "Alliance Bloc", edu: "M.A. Pol Sci", assets: "₹1.2 Cr", crime: 1 },
            { name: "Ravi Kumar", party: "Independent", edu: "B.Tech", assets: "₹50 L", crime: 0 }
        ];

        candidates.forEach(c => {
            const card = document.createElement('div');
            card.className = 'candidate-card';
            card.innerHTML = `
                <div class="candidate-header">
                    <div>
                        <div class="c-name">${c.name}</div>
                        <div class="c-party">${c.party}</div>
                    </div>
                </div>
                <div class="c-stats">
                    <div class="c-stat-box">Education<strong>${c.edu}</strong></div>
                    <div class="c-stat-box">Assets<strong>${c.assets}</strong></div>
                </div>
                <div class="c-record ${c.crime === 0 ? 'clean' : 'flagged'}">
                    ${c.crime === 0 ? '✓ No Criminal Cases' : '⚠️ ' + c.crime + ' Pending Case(s)'}
                </div>
            `;
            grid.appendChild(card);
        });
    }

    function populateIntelFeed() {
        const feed = document.getElementById('alertsFeed');
        const alerts = [
            { title: "Security Deployment Increased", type: "critical", time: "10 mins ago", desc: "Additional CAPF companies deployed in Sector 9 following minor clashes." },
            { title: "Queue Update", type: "warning", time: "25 mins ago", desc: "Wait times exceeding 45 minutes at Booths 12-15 in Gole Market area." },
            { title: "Weather Advisory", type: "warning", time: "1 hr ago", desc: "Light showers expected in the afternoon. Temporary shelters erected at all polling stations." }
        ];

        alerts.forEach(a => {
            const el = document.createElement('div');
            el.className = `alert-item ${a.type}`;
            el.innerHTML = `
                <div class="alert-header">
                    <span class="alert-title">${a.title}</span>
                    <span>${a.time}</span>
                </div>
                <div class="alert-desc">${a.desc}</div>
            `;
            feed.appendChild(el);
        });
    }

    function populateLeaderboard() {
        const tbody = document.getElementById('leaderboardBody');
        const displayName = fullNameParam ? fullNameParam.trim() : "Guest User";
        const leaders = [
            { rank: 1, name: "Priya Sharma", badges: 12, score: 2450 },
            { rank: 2, name: displayName + " (You)", badges: 10, score: 2100 },
            { rank: 3, name: "Rahul Verma", badges: 9, score: 1850 },
            { rank: 4, name: "Vikram Singh", badges: 7, score: 1500 }
        ];

        leaders.forEach(l => {
            const tr = document.createElement('tr');
            if(l.rank === 2) tr.style.background = 'rgba(99,102,241,0.1)';
            tr.innerHTML = `
                <td>#${l.rank}</td>
                <td><strong>${l.name}</strong></td>
                <td>${l.badges}</td>
                <td>${l.score} pts</td>
            `;
            tbody.appendChild(tr);
        });
    }

    // Initialize components
    setTimeout(() => {
        initCharts();
        initMap();
        initChat();
        populateCandidateExplorer();
        populateIntelFeed();
        populateLeaderboard();
    }, 100);
});
