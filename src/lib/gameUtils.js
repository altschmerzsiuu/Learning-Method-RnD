// src/lib/gameUtils.js

/**
 * Check for a winner on a 3x3 Tic-Tac-Toe board.
 * @param {Array<string>} board - 9-element array ('X', 'O', or '')
 * @returns {string|null} - 'X', 'O', 'draw', or null if game is ongoing
 */
export function checkWinner(board) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6],             // diagonals
  ];

  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a]; // 'X' or 'O'
    }
  }

  if (board.every(cell => cell !== '')) return 'draw';
  return null;
}

/**
 * Get the winning line indices (for highlighting).
 */
export function getWinningLine(board) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];
  for (const line of lines) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return line;
    }
  }
  return [];
}

/**
 * Get all empty cell indices.
 */
export function getAvailableCells(board) {
  return board.map((v, i) => (v === '' ? i : null)).filter(v => v !== null);
}

/**
 * Get a random empty cell index.
 */
export function getRandomCell(board) {
  const available = getAvailableCells(board);
  if (available.length === 0) return null;
  return available[Math.floor(Math.random() * available.length)];
}

/**
 * Calculate XP reward based on game result.
 */
export function calculateDuelXP(result) {
  if (result === 'menang') return 100;
  if (result === 'seri')   return 40;
  return 10; // kalah — always reward something
}
