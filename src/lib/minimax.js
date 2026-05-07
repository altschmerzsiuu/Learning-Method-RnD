// src/lib/minimax.js
import { checkWinner, getAvailableCells } from './gameUtils';

/**
 * Minimax algorithm for optimal AI move.
 * AI is always 'O', player is always 'X'.
 * @param {Array} board
 * @param {boolean} isMaximizing - true when it's AI's turn
 * @param {number} depth - current depth (used for preferring faster wins)
 * @returns {number} score
 */
function minimax(board, isMaximizing, depth = 0) {
  const winner = checkWinner(board);
  if (winner === 'O') return 10 - depth;
  if (winner === 'X') return depth - 10;
  if (winner === 'draw') return 0;

  const available = getAvailableCells(board);

  if (isMaximizing) {
    let best = -Infinity;
    for (const idx of available) {
      board[idx] = 'O';
      best = Math.max(best, minimax(board, false, depth + 1));
      board[idx] = '';
    }
    return best;
  } else {
    let best = Infinity;
    for (const idx of available) {
      board[idx] = 'X';
      best = Math.min(best, minimax(board, true, depth + 1));
      board[idx] = '';
    }
    return best;
  }
}

/**
 * Get the best move index for AI using Minimax.
 * @param {Array} board - current board state
 * @returns {number|null} - best cell index for AI to play
 */
export function getBestMove(board) {
  const available = getAvailableCells(board);
  if (available.length === 0) return null;

  let bestScore = -Infinity;
  let bestMove  = available[0];

  for (const idx of available) {
    board[idx] = 'O';
    const score = minimax(board, false);
    board[idx] = '';
    if (score > bestScore) {
      bestScore = score;
      bestMove  = idx;
    }
  }

  return bestMove;
}
