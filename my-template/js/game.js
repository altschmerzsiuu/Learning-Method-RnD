// ===== GAME STATE =====
let gameState = {
    board: ['', '', '', '', '', '', '', '', ''],
    currentPlayer: 'X',
    gameActive: true,
    themes: ['Definisi', 'Struktur', 'Tujuan', 'Sinonim', 'Antonim', 'General', 'General', 'Sinonim', 'Definisi', 'General', 'Antonim'],
    cellThemes: [],
    skillCells: [],
    playerSkills: { X: { count: 0, turnsLeft: 0 }, O: { count: 0, turnsLeft: 0 } },
    pendingSkillValidation: { X: false, O: false },
    currentCell: null,
    scores: { X: 0, O: 0 },
    waitingForSkillTarget: false,
    turnCount: { X: 0, O: 0 }
};

// ===== SOUND EFFECTS =====
const sounds = {
    click: new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'),
    skill: new Audio('https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3'),
    zonk: new Audio('https://assets.mixkit.co/active_storage/sfx/2573/2573-preview.mp3'),
    win: new Audio('https://github.com/altschmerzsiuu/tic-tac-toe/raw/refs/heads/main/assets/%20mejikuhibiniu.mp3'),
    timer: new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'),
    win2: new Audio('https://github.com/altschmerzsiuu/tic-tac-toe/raw/refs/heads/main/assets/bintanglima.mp3'),
    win3: new Audio('https://github.com/altschmerzsiuu/tic-tac-toe/raw/refs/heads/main/assets/kasihababa.mp3')
};
const countdownSound = new Audio('https://raw.githubusercontent.com/altschmerzsiuu/tic-tac-toe/main/cd.mp3');

document.addEventListener('click', () => {
    try {
        countdownSound.play().then(() => {
            countdownSound.pause();
            countdownSound.currentTime = 0;
        }).catch(() => { });
    } catch (e) { }
}, { once: true });

sounds.win.loop = true;
Object.values(sounds).forEach(sound => sound.volume = 1.0);

// ===== DOM ELEMENTS =====
const cells = document.querySelectorAll('.cell');
const teamXDisplay = document.getElementById('teamX');
const teamODisplay = document.getElementById('teamO');
const skillXDisplay = document.getElementById('skillX');
const skillODisplay = document.getElementById('skillO');
const restartBtn = document.getElementById('restartBtn');
const prompterText = document.getElementById('prompterText');
const prompterIcon = document.querySelector('.prompter-icon');
const currentTurnDisplay = document.getElementById('currentTurn');
const skillActionButtons = document.getElementById('skillActionButtons');
const useSkillNowBtn = document.getElementById('useSkillNowBtn');
const useSkillLaterBtn = document.getElementById('useSkillLaterBtn');

const blindboxModal = document.getElementById("blindboxModal");
const themeModal = document.getElementById('themeModal');
const gameOverModal = document.getElementById('gameOverModal');

const scoreXDisplay = document.getElementById('scoreX');
const scoreODisplay = document.getElementById('scoreO');
const resetScoreBtn = document.getElementById('resetScoreBtn');

// ===== INITIALIZATION =====
function init() {
    stopWinMusic();
    gameState.board = ['', '', '', '', '', '', '', '', ''];
    gameState.currentPlayer = 'X';
    gameState.gameActive = true;
    gameState.playerSkills = { X: { count: 0, turnsLeft: 0 }, O: { count: 0, turnsLeft: 0 } };
    gameState.pendingSkillValidation = { X: false, O: false };
    gameState.waitingForSkillTarget = false;
    gameState.turnCount = { X: 0, O: 0 };

    gameState.cellThemes = shuffleArray([...gameState.themes, ...gameState.themes.slice(0, 4)]);
    gameState.skillCells = getRandomSkillCells();

    cells.forEach((cell) => {
        cell.classList.remove('filled', 'blocked', 'winning', 'x', 'o', 'selecting');
        cell.removeEventListener('click', handleCellClick);
        cell.addEventListener('click', handleCellClick);
    });

    renderCells();
    updateDisplay();
    updateScoreDisplay();
    updatePrompter('🎯', 'Tim X memulai permainan! Klik kolom untuk bermain...');
    hideAllModals();
    if(skillActionButtons) skillActionButtons.style.display = 'none';
    if(restartBtn) restartBtn.style.display = 'none';
}

function updateScoreDisplay() {
    if(scoreXDisplay) scoreXDisplay.textContent = gameState.scores.X;
    if(scoreODisplay) scoreODisplay.textContent = gameState.scores.O;
}

function playRandomWinSong() {
    const winSongs = [sounds.win, sounds.win2, sounds.win3];
    const randomSong = winSongs[Math.floor(Math.random() * winSongs.length)];
    winSongs.forEach(song => {
        song.pause();
        song.currentTime = 0;
    });
    try {
        randomSong.currentTime = 0;
        randomSong.play().catch(() => { });
    } catch (e) { }
}

function renderCells() {
    cells.forEach((cell, index) => {
        const mark = gameState.board[index];
        cell.classList.remove('filled', 'x', 'o', 'winning');
        if (mark === '') {
            cell.innerHTML = `<span class="cell-number">${index + 1}</span>`;
        } else {
            cell.textContent = mark;
            cell.classList.add('filled', mark.toLowerCase());
        }
    });
}

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function getRandomSkillCells() {
    const indices = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const shuffled = shuffleArray(indices);
    return shuffled.slice(0, 2);
}

function updateDisplay() {
    if(teamXDisplay) teamXDisplay.classList.toggle('active', gameState.currentPlayer === 'X');
    if(teamODisplay) teamODisplay.classList.toggle('active', gameState.currentPlayer === 'O');
    if(currentTurnDisplay) currentTurnDisplay.textContent = `Giliran: Tim ${gameState.currentPlayer}`;

    updateSkillDisplay('X');
    updateSkillDisplay('O');

    const currentSkill = gameState.playerSkills[gameState.currentPlayer];
    if (skillActionButtons) {
        if (currentSkill.count > 0 && currentSkill.turnsLeft > 0 && !gameState.waitingForSkillTarget) {
            skillActionButtons.style.display = 'flex';
        } else {
            skillActionButtons.style.display = 'none';
        }
    }
}

function updateSkillDisplay(player) {
    const skillDisplay = player === 'X' ? skillXDisplay : skillODisplay;
    if(!skillDisplay) return;
    const skill = gameState.playerSkills[player];

    if (skill.count > 0 && skill.turnsLeft > 0) {
        skillDisplay.className = 'skill-display has-skill';
        skillDisplay.innerHTML = `
            <div class="skill-icon-display">🗑️</div>
            <div class="skill-name-display">Hapus Tanda</div>
            <div class="skill-count-display">x${skill.count}</div>
            <div class="skill-turns-left">${skill.turnsLeft} giliran tersisa</div>
        `;
    } else {
        skillDisplay.className = 'skill-display';
        skillDisplay.innerHTML = '<div class="no-skill">Belum ada skill</div>';
    }
}

function updatePrompter(icon, message) {
    if(prompterIcon) prompterIcon.textContent = icon;
    if(prompterText) prompterText.textContent = message;
}

function handleCellClick(e) {
    if (!gameState.gameActive || gameState.waitingForSkillTarget) return;
    const index = parseInt(e.currentTarget.dataset.index, 10);
    if (gameState.board[index] !== '' || e.currentTarget.classList.contains('blocked')) return;

    gameState.currentCell = index;
    playSound('click');

    if (gameState.skillCells.includes(index)) {
        updatePrompter('🎁', `Tim ${gameState.currentPlayer} menemukan kotak misteri! Pilih dengan hati-hati...`);
        showBlindboxModal();
    } else {
        showThemeModal(index);
    }
}

function showBlindboxModal() {
    const boxes = document.querySelectorAll('.blindbox');
    boxes.forEach(box => {
        box.classList.remove('flipped', 'zonk', 'skill');
        box.style.pointerEvents = 'auto';
    });

    const results = shuffleArray(['skill', 'zonk', 'zonk']);
    boxes.forEach((box, i) => {
        box.dataset.result = results[i];
        const back = box.querySelector('.box-back');
        if (results[i] === 'skill') {
            back.innerHTML = `
                <div class="skill-icon">🗑️</div>
                <div class="skill-name">Hapus Tanda!</div>
                <div class="skill-desc">Hapus 1 tanda lawan</div>
            `;
        } else {
            back.innerHTML = `
                <div class="skill-icon">💥</div>
                <div class="skill-name">ZONK!</div>
                <div class="skill-desc">Sorry, Yee!</div>
            `;
        }
        box.onclick = () => {
            const result = box.dataset.result;
            if (result === 'skill') {
                const p = gameState.currentPlayer;
                gameState.playerSkills[p].count++;
                gameState.playerSkills[p].turnsLeft += 2;
                gameState.pendingSkillValidation[p] = true;
                updatePrompter('🎯', `Tim ${p} mendapat skill Hapus Tanda! 🗑️ (Jika jawaban selanjutnya salah, skill dibatalkan)`);
                playSound('skill');
                box.classList.add('skill');
            } else {
                updatePrompter('💥', `Tim ${gameState.currentPlayer} mendapat ZONK! 😵`);
                playSound('zonk');
                box.classList.add('zonk');
            }
            box.classList.add('flipped');
            boxes.forEach(b => (b.style.pointerEvents = 'none'));
            setTimeout(() => {
                hideModal(blindboxModal);
                showThemeModal(gameState.currentCell);
            }, 1400);
        };
    });
    showModal(blindboxModal);
}

function showThemeModal(index) {
    const theme = gameState.cellThemes[index];
    document.getElementById('themeDisplay').textContent = theme;
    showModal(themeModal);
}

const correctBtn = document.getElementById('correctBtn');
const wrongBtn = document.getElementById('wrongBtn');
if(correctBtn) correctBtn.onclick = () => { handleAnswer(true); };
if(wrongBtn) wrongBtn.onclick = () => { handleAnswer(false); };

function handleAnswer(isCorrect) {
    hideModal(themeModal);
    const player = gameState.currentPlayer;

    if (isCorrect) {
        gameState.board[gameState.currentCell] = player;
        const cell = cells[gameState.currentCell];
        cell.textContent = player;
        cell.classList.add('filled', player.toLowerCase());
        renderCells();
        updatePrompter('✅', `Tim ${player} menjawab benar! Kolom berhasil diisi!`);

        if (gameState.pendingSkillValidation[player]) {
            gameState.pendingSkillValidation[player] = false;
        }

        if (checkWin()) {
            gameState.scores[player]++;
            updateScoreDisplay();
            handleGameEnd(`🎉 TIM ${player} MENANG! 🎉`);
            return;
        }

        if (gameState.board.every(cell => cell !== '')) {
            handleGameEnd('🤝 SERI! Kedua tim bermain dengan hebat! 🤝');
            return;
        }
    } else {
        updatePrompter('❌', `Tim ${player} salah menjawab. Giliran berikutnya!`);
        const cellIndex = gameState.skillCells.indexOf(gameState.currentCell);
        if (cellIndex !== -1) {
            gameState.skillCells.splice(cellIndex, 1);
        }
        if (gameState.pendingSkillValidation[player]) {
            gameState.playerSkills[player].count = 0;
            gameState.playerSkills[player].turnsLeft = 0;
            gameState.pendingSkillValidation[player] = false;
            updatePrompter('⚠️', `Skill Tim ${player} dibatalkan karena jawaban salah.`);
            playSound('zonk');
            updateDisplay();
        }
    }
    decreaseSkillTurns();
    switchPlayer();
}

if(useSkillNowBtn) useSkillNowBtn.onclick = () => { activateEraseSkill(); };
if(useSkillLaterBtn) {
    useSkillLaterBtn.onclick = () => {
        skillActionButtons.style.display = 'none';
        updatePrompter('⏳', `Tim ${gameState.currentPlayer} menyimpan skill untuk nanti. Bijak!`);
    };
}

function activateEraseSkill() {
    gameState.waitingForSkillTarget = true;
    if(skillActionButtons) skillActionButtons.style.display = 'none';
    updatePrompter('🎯', `Tim ${gameState.currentPlayer}: Klik tanda lawan yang ingin dihapus!`);
    const opponent = gameState.currentPlayer === 'X' ? 'O' : 'X';

    cells.forEach((cell, index) => {
        if (gameState.board[index] === opponent) {
            cell.classList.add('selecting');
            const eraseClick = () => {
                gameState.board[index] = '';
                cell.textContent = '';
                cell.classList.remove('filled', 'x', 'o');
                cells.forEach(c => {
                    c.classList.remove('selecting');
                    c.removeEventListener('click', eraseClick);
                    c.addEventListener('click', handleCellClick);
                });
                const p = gameState.currentPlayer;
                gameState.playerSkills[p].count--;
                if (gameState.playerSkills[p].count <= 0) {
                    gameState.playerSkills[p].count = 0;
                    gameState.playerSkills[p].turnsLeft = 0;
                }
                gameState.waitingForSkillTarget = false;
                updateDisplay();
                renderCells();
                updatePrompter('🗑️', `Tim ${p} menghapus tanda lawan! Strategi cerdas!`);
                playSound('skill');
            };
            cell.removeEventListener('click', handleCellClick);
            cell.addEventListener('click', eraseClick);
        }
    });
}

function decreaseSkillTurns() {
    const player = gameState.currentPlayer;
    if (gameState.playerSkills[player].turnsLeft > 0) {
        gameState.playerSkills[player].turnsLeft--;
        if (gameState.playerSkills[player].turnsLeft === 0) {
            gameState.playerSkills[player].count = 0;
            updatePrompter('⏰', `Skill Tim ${player} expired!`);
            updateDisplay();
        }
    }
}

function switchPlayer() {
    gameState.currentPlayer = gameState.currentPlayer === 'X' ? 'O' : 'X';
    gameState.turnCount[gameState.currentPlayer]++;
    updateDisplay();
    updatePrompter('🔄', `Giliran Tim ${gameState.currentPlayer}! Waktunya menunjukkan kemampuan!`);
}

function checkWin() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (gameState.board[a] && gameState.board[a] === gameState.board[b] && gameState.board[a] === gameState.board[c]) {
            cells[a].classList.add('winning');
            cells[b].classList.add('winning');
            cells[c].classList.add('winning');
            return true;
        }
    }
    return false;
}

function handleGameEnd(message) {
    gameState.gameActive = false;
    runClosingGimmick(message);
}

let stageTimeouts = [];
function getRandomWinVideo() {
    const winVideos = [
        'https://github.com/altschmerzsiuu/tic-tac-toe/raw/refs/heads/main/assets/v1.mp4',
        'https://github.com/altschmerzsiuu/tic-tac-toe/raw/refs/heads/main/assets/v2.mp4',
        'https://github.com/altschmerzsiuu/tic-tac-toe/raw/refs/heads/main/assets/v3.mp4'
    ];
    return winVideos[Math.floor(Math.random() * winVideos.length)];
}

function runClosingGimmick(originalMessage) {
    const winnerTextEl = document.getElementById('winnerText');
    if(!winnerTextEl) return;
    const isDraw = originalMessage.includes('SERI');
    showModal(gameOverModal);
    stopWinMusic();
    winnerTextEl.innerHTML = "";
    if(restartBtn) restartBtn.style.display = "none";

    if (isDraw) {
        winnerTextEl.innerHTML = `
            <div style="font-size: 2rem; margin-bottom: 10px;">🤝 SERI!</div>
            <div style="font-size: 1.3rem; line-height: 1.5;">Better play one more round!</div>
        `;
        if(restartBtn) restartBtn.style.display = "block";
        return;
    }

    const player = originalMessage.includes('TIM X') ? 'X' : 'O';
    const stages = [
        () => { winnerTextEl.innerHTML = `<div style="font-size: 2.2rem; margin-bottom: 8px;">🎉 SELAMAT! 🎉</div><div style="font-size: 2rem; font-weight: bold;">TIM ${player} MENANG!</div>`; },
        () => { winnerTextEl.innerHTML = `<div style="font-size: 2rem; margin-bottom: 8px;">🔥 MARI KITA RAYAKAN 🔥</div><div style="font-size: 1.5rem;">Kemenangan ini bukan kaleng-kaleng!</div>`; },
        () => {
            winnerTextEl.innerHTML = `<div style="font-size: 1.5rem; margin-bottom: 15px;">🎊 Waktunya bersenang-senang 🎊</div><div style="font-size: 0.7rem;">Klik tombol di bawah buat ronde berikutnya!</div>`;
            if(restartBtn) restartBtn.style.display = "block";
            launchConfettiLoop();
            playRandomWinSong();
        },
        () => {
            const randomVideo = getRandomWinVideo();
            winnerTextEl.innerHTML = `
                <div style="font-size: 3rem; margin-bottom: 20px; font-weight: bold;">STANDUP EVERIBADII!!</div>
                <video autoplay loop muted playsinline style="width: 100%; max-width: 400px; border-radius: 20px; object-fit: cover; margin-bottom: 20px;">
                    <source src="${randomVideo}" type="video/mp4">
                    Video tidak bisa dimuat.
                </video>
                <div style="font-size: 0.9rem; color: #666; margin-bottom: 15px;">Klik tombol di bawah buat ronde berikutnya!</div>
            `;
            if(restartBtn) restartBtn.style.display = "block";
        }
    ];

    stageTimeouts.forEach(id => clearTimeout(id));
    stageTimeouts = [];
    let delay = 0;
    stages.forEach((stageFn, idx) => {
        let id = setTimeout(stageFn, delay);
        stageTimeouts.push(id);
        delay += idx === 2 ? 4000 : 2500;
    });
}

let confettiLoopId = null;
let confettiActive = false;
function launchConfettiLoop() {
    confettiActive = true;
    let canvas = document.getElementById('confetti-canvas');
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'confetti-canvas';
        canvas.style.position = 'absolute';
        canvas.style.top = 0;
        canvas.style.left = 0;
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = 9999;
        document.body.appendChild(canvas);
    }
    const myConfetti = confetti.create(canvas, { resize: true, useWorker: true });
    const frame = () => {
        if (!confettiActive) {
            cancelAnimationFrame(confettiLoopId);
            confettiLoopId = null;
            canvas.remove();
            return;
        }
        myConfetti({ particleCount: 4 + Math.floor(Math.random() * 4), angle: 60 + Math.random() * 60, spread: 70, origin: { x: Math.random(), y: 0 } });
        confettiLoopId = requestAnimationFrame(frame);
    };
    frame();
}

if(restartBtn) {
    restartBtn.onclick = () => {
        if (confettiLoopId) cancelAnimationFrame(confettiLoopId);
        const canvas = document.getElementById('confetti-canvas');
        if (canvas) canvas.remove();
        restartGame();
    };
}

function showModal(modal) { if(modal) modal.classList.add('show'); }
function hideModal(modal) { if(modal) modal.classList.remove('show'); }
function hideAllModals() { [blindboxModal, themeModal, gameOverModal].forEach(modal => hideModal(modal)); }

function playSound(soundName) {
    if (!sounds[soundName]) return;
    try {
        const sound = sounds[soundName].cloneNode();
        sound.volume = sounds[soundName].volume;
        sound.play().catch(() => { });
    } catch (e) { }
}

function restartGame() {
    stageTimeouts.forEach(id => clearTimeout(id));
    stageTimeouts = [];
    stopWinMusic();
    hideModal(gameOverModal);
    init();
}

const playAgainBtn = document.getElementById('playAgainBtn');
if(playAgainBtn) playAgainBtn.onclick = restartGame;

let winMusicPlaying = false;
function stopWinMusic() {
    confettiActive = false;
    winMusicPlaying = false;
    const winSongs = [sounds.win, sounds.win2, sounds.win3];
    winSongs.forEach(song => {
        try { song.pause(); song.currentTime = 0; } catch (e) { }
    });
}

if(resetScoreBtn) {
    resetScoreBtn.onclick = () => {
        gameState.scores = { X: 0, O: 0 };
        updateScoreDisplay();
        updatePrompter('🔄', 'Skor direset!');
    };
}

init();

const fullscreenBtn = document.getElementById('fullscreenBtn');
if(fullscreenBtn) {
    fullscreenBtn.onclick = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => { });
        } else {
            document.exitFullscreen();
        }
    };
}

document.addEventListener('fullscreenchange', () => {
    if(!fullscreenBtn) return;
    if (document.fullscreenElement) {
        fullscreenBtn.classList.add('active');
    } else {
        fullscreenBtn.classList.remove('active');
    }
});
