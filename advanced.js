// ===== THEME =====
document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem('theme');
    const btn = document.getElementById('themeBtn');
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        if (btn) btn.innerText = '☀️ Light Mode';
    }
});

function toggleTheme() {
    const body = document.body;
    const btn = document.getElementById('themeBtn');
    if (body.hasAttribute('data-theme')) {
        body.removeAttribute('data-theme');
        btn.innerText = '🌙 Dark Mode';
        localStorage.setItem('theme', 'light');
    } else {
        body.setAttribute('data-theme', 'dark');
        btn.innerText = '☀️ Light Mode';
        localStorage.setItem('theme', 'dark');
    }
}

// ===== SEARCH =====
function doSearch() {
    const query = document.getElementById("searchInput").value.trim().toLowerCase();
    const resultsDiv = document.getElementById("searchResults");
    
    if (!query) {
        resultsDiv.style.display = "none";
        return;
    }

    let results = [];

    const note = localStorage.getItem('note') || "";
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    const historyList = JSON.parse(localStorage.getItem('calcHistory')) || [];

    // 1. Cari di Catatan
    if (note.toLowerCase().includes(query)) {
        results.push(`📝 <b>Catatan:</b>\n${highlightText(note, query)}`);
    }

    // 2. Cari di To-Do
    todos.forEach((t, i) => {
        if (t.text.toLowerCase().includes(query)) {
            results.push(`✅ <b>To-Do ${i+1}:</b> ${highlightText(t.text, query)} ${t.done ? '[Selesai]' : ''}`);
        }
    });

    if (results.length === 0) {
        resultsDiv.innerHTML = `Gak ketemu hasil untuk "<b>${query}</b>"`;
    } else {
        resultsDiv.innerHTML = `<b>Ditemukan ${results.length} hasil:</b>\n\n` + results.join("\n\n");
    }
    
    resultsDiv.style.display = "block";
}

function highlightText(text, query) {
    const regex = new RegExp(`(${query})`, "gi");
    return text.replace(regex, "<mark>$1</mark>");
}

// ===== IMAGE GENERATOR =====
async function generateImage() {
  const prompt = document.getElementById("imagePrompt").value.trim();
  const resultDiv = document.getElementById("imageResult");
  
  if (!prompt) {
    alert("Masukin prompt dulu!");
    return;
  }
  
  resultDiv.innerHTML = `
    <p>Pilih mau buka mana:</p>
    <button onclick="openPixAI('${prompt.replace(/'/g, "\\'")}')" style="margin:5px;padding:8px 12px;">Buka PixAI</button>
    <button onclick="openCraiyon('${prompt.replace(/'/g, "\\'")}')" style="margin:5px;padding:8px 12px;">Buka Craiyon</button>
  `;
}

async function openPixAI(prompt) {
  try {
    await navigator.clipboard.writeText(prompt);
    const tab = window.open('https://pixai.art/', '_blank');
    
    setTimeout(() => {
      if (!tab || tab.closed || typeof tab.closed == 'undefined') {
        openCraiyon(prompt);
      }
    }, 800);
    
    alert("Prompt udah ke-copy! Tinggal paste di PixAI");
  } catch (err) {
    openCraiyon(prompt);
  }
}

function openCraiyon(prompt) {
  const url = `https://www.craiyon.com/?prompt=${encodeURIComponent(prompt)}`;
  window.open(url, '_blank');
}

// ===== TIC TAC TOE =====
let tttBoard = ["", "", "", "", "", "", "", "", "", ""];
let tttCurrentPlayer = "X";
let tttGameActive = true;

function handleTTTClick(e) {
    const cell = e.target.closest(".ttt-cell");
    if (!cell) return;

    const index = parseInt(cell.dataset.index);
    if (isNaN(index) || tttBoard[index]!== "" ||!tttGameActive) return;

    tttBoard[index] = tttCurrentPlayer;
    cell.textContent = tttCurrentPlayer;
    cell.disabled = true;

    if (checkTTTWin()) {
        document.getElementById("ttt-status").textContent = `Menang: ${tttCurrentPlayer}! 🎉`;
        tttGameActive = false;
        return;
    }

    if (tttBoard.every(cell => cell!== "")) {
        document.getElementById("ttt-status").textContent = "Seri!";
        tttGameActive = false;
        return;
    }

    tttCurrentPlayer = tttCurrentPlayer === "X"? "O" : "X";
    document.getElementById("ttt-status").textContent = `Giliran: ${tttCurrentPlayer}`;
}

function checkTTTWin() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    return winPatterns.some(pattern => {
        return pattern.every(index => tttBoard[index] === tttCurrentPlayer && tttBoard[index]!== "");
    });
}

function resetTTT() {
    tttBoard = ["", "", "", "", "", "", "", "", "", ""];
    tttCurrentPlayer = "X";
    tttGameActive = true;
    const statusEl = document.getElementById("ttt-status");
    if (statusEl) statusEl.textContent = `Giliran: ${tttCurrentPlayer}`;

    document.querySelectorAll(".ttt-cell").forEach(cell => {
        cell.textContent = "";
        cell.disabled = false;
    });
}

// Pasang listener pas DOM ready
document.addEventListener("DOMContentLoaded", () => {
    const boardEl = document.getElementById("ttt-board");
    if (boardEl) {
        boardEl.addEventListener("click", handleTTTClick);
    }
});
// ===== TAB SWITCHER =====
function switchTab(tab) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-nav.tab-btn').forEach(el => el.classList.remove('active'));
    document.getElementById('tab-' + tab).classList.add('active');
    event.target.classList.add('active');
}

function switchHadistTab(tab) {
    currentHadistTab = tab;
    document.querySelectorAll('.hadist-tab-btn').forEach(el => el.classList.remove('active'));
    event.target.classList.add('active');
    renderHadist(hadistData[tab]);
}

// ===== HADIST & DALIL DATA =====
let currentHadistTab = 'hadist';

const hadistData = {
    hadist: [
        {arab: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ", terjemah: "Sesungguhnya amal itu tergantung niatnya.", sumber: "HR. Bukhari & Muslim"},
        {arab: "الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ", terjemah: "Seorang muslim adalah orang yang kaum muslimin selamat dari lisan dan tangannya.", sumber: "HR. Bukhari & Muslim"},
        {arab: "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ", terjemah: "Barangsiapa beriman kepada Allah dan hari akhir, hendaklah ia berkata baik atau diam.", sumber: "HR. Bukhari & Muslim"},
        {arab: "لاَ يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ", terjemah: "Tidak beriman salah seorang di antara kalian sampai ia mencintai saudaranya sebagaimana ia mencintai dirinya sendiri.", sumber: "HR. Bukhari & Muslim"},
        {arab: "اتَّقِ اللَّهَ حَيْثُمَا كُنْتَ", terjemah: "Bertakwalah kepada Allah di mana saja kamu berada.", sumber: "HR. Tirmidzi"}
        // Tambahin sampe 100 di sini
    ],
    dalil: [
        {arab: "يٰٓاَيُّهَا الَّذِيْنَ اٰمَنُوْا قُوْٓا اَنْفُسَكُمْ وَاَهْلِيْكُمْ نَارًا وَّقُوْدُهَا النَّاسُ وَالْحِجَارَةُ عَلَيْهَا مَلٰۤىِٕكَةٌ غِلَاظٌ شِدَادٌ لَّا يَعْصُوْنَ اللّٰهَ مَآ اَمَرَهُمْ وَيَفْعَلُوْنَ مَا يُؤْمَرُوْنَ", 
         terjemah: "Wahai orang-orang yang beriman, jagalah dirimu dan keluargamu dari api neraka yang bahan bakarnya adalah manusia dan batu. Penjaganya adalah malaikat-malaikat yang kasar dan keras. Mereka tidak durhaka kepada Allah terhadap apa yang Dia perintahkan kepadanya dan selalu mengerjakan apa yang diperintahkan", 
         sumber: "QS. At-Tahrim: 6"},
         
        {arab: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ", terjemah: "Sesungguhnya Allah bersama orang-orang yang sabar.", sumber: "QS. Al-Baqarah: 153"},
        {arab: "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا", terjemah: "Barangsiapa bertakwa kepada Allah, niscaya Dia akan mengadakan baginya jalan keluar.", sumber: "QS. At-Talaq: 2"},
        {arab: "وَقُل رَّبِّ زِدْنِي عِلْمًا", terjemah: "Dan katakanlah: Ya Tuhanku, tambahkanlah kepadaku ilmu.", sumber: "QS. Thaha: 114"},
        {arab: "إِنَّ مَعَ الْعُسْرِ يُسْرًا", terjemah: "Sesungguhnya sesudah kesulitan itu ada kemudahan.", sumber: "QS. Al-Insyirah: 6"},
        {arab: "وَتَعَاوَنُوا عَلَى الْبِرِّ وَالتَّقْوَى", terjemah: "Dan tolong-menolonglah kamu dalam kebajikan dan takwa.", sumber: "QS. Al-Maidah: 2"}
        // Tambahin sampe 100 di sini
    ]
};

function renderHadist(data) {
    const listEl = document.getElementById('hadistList');
    listEl.innerHTML = '';
    data.forEach(item => {
        listEl.innerHTML += `
            <div class="hadist-item">
                <div class="hadist-arab">${item.arab}</div>
                <div class="hadist-terjemah">${item.terjemah}</div>
                <div class="hadist-sumber">${item.sumber}</div>
            </div>
        `;
    });
}

function filterHadist() {
    const keyword = document.getElementById('hadistSearch').value.toLowerCase();
    const data = hadistData[currentHadistTab];
    const filtered = data.filter(h =>
        h.terjemah.toLowerCase().includes(keyword) ||
        h.arab.includes(keyword) ||
        h.sumber.toLowerCase().includes(keyword)
    );
    renderHadist(filtered);
}

// Load default
document.addEventListener("DOMContentLoaded", () => {
    renderHadist(hadistData.hadist);
});