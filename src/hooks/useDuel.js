// src/hooks/useDuel.js
import { useState, useCallback, useRef } from 'react';
import quizData from '../data/quiz.json';
import { checkWinner, getWinningLine, getRandomCell } from '../lib/gameUtils';
import { getBestMove } from '../lib/minimax';

const EMPTY_BOARD = Array(9).fill('');

function shuffleArray(array) {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

function getQuestionsForDuel(difficulty) {
  const all = quizData.flatMap(t => t.soal);
  const filtered = difficulty === 'susah'
    ? all.filter(q => q.tingkat === 'sedang' || q.tingkat === 'susah')
    : all.filter(q => q.tingkat === 'mudah' || q.tingkat === 'sedang');

  // Shuffle questions and their options
  const shuffled = shuffleArray(filtered).map(q => {
    const cleanPilihan = q.pilihan.map(p => p.replace(/^[A-D]\.\s+/, ''));
    const shuffledOptions = shuffleArray(cleanPilihan);
    const correctText = q.pilihan.find(p => p.startsWith(q.jawaban_benar + '.'))?.replace(/^[A-D]\.\s+/, '');
    return { ...q, shuffledOptions, correctText };
  });

  return shuffled;
}

export function useDuel(difficulty = 'mudah') {
  const [board,         setBoard]         = useState([...EMPTY_BOARD]);
  const [currentPlayer, setCurrentPlayer] = useState('X'); // X = user, O = AI
  const [winner,        setWinner]        = useState(null);
  const [winLine,       setWinLine]       = useState([]);
  const [pendingCell,   setPendingCell]   = useState(null);
  const [showModal,     setShowModal]     = useState(false);
  const [isAiThinking,  setIsAiThinking]  = useState(false);

  const questionsRef = useRef(getQuestionsForDuel(difficulty));
  const usedQIdx     = useRef(0);

  const getCurrentQuestion = () => {
    const q = questionsRef.current[usedQIdx.current % questionsRef.current.length];
    usedQIdx.current++;
    return q;
  };

  const [currentQuestion, setCurrentQuestion] = useState(() => getCurrentQuestion());

  const handleCellClick = useCallback((idx) => {
    if (board[idx] !== '' || winner || currentPlayer !== 'X' || isAiThinking) return;
    setPendingCell(idx);
    setCurrentQuestion(getCurrentQuestion());
    setShowModal(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [board, winner, currentPlayer, isAiThinking]);

  const handleAnswer = useCallback((isCorrect) => {
    setShowModal(false);

    setBoard(prev => {
      const next = [...prev];
      if (isCorrect) {
        next[pendingCell] = 'X';
        const w = checkWinner(next);
        if (w) {
          setWinner(w);
          setWinLine(getWinningLine(next));
          return next;
        }
      }
      // AI's turn
      setCurrentPlayer('O');
      setIsAiThinking(true);

      setTimeout(() => {
        setBoard(b => {
          const copy = [...b];
          const aiMove = difficulty === 'susah'
            ? getBestMove([...copy])
            : getRandomCell(copy);

          if (aiMove !== null) {
            copy[aiMove] = 'O';
            const w2 = checkWinner(copy);
            if (w2) {
              setWinner(w2);
              setWinLine(getWinningLine(copy));
            }
          }
          setCurrentPlayer('X');
          setIsAiThinking(false);
          return copy;
        });
      }, 900);

      return next;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingCell, difficulty]);

  const resetGame = useCallback(() => {
    setBoard([...EMPTY_BOARD]);
    setCurrentPlayer('X');
    setWinner(null);
    setWinLine([]);
    setPendingCell(null);
    setShowModal(false);
    setIsAiThinking(false);
    questionsRef.current = getQuestionsForDuel(difficulty);
    usedQIdx.current = 0;
    setCurrentQuestion(questionsRef.current[0]);
  }, [difficulty]);

  const gameResult = winner === 'X' ? 'menang' : winner === 'O' ? 'kalah' : winner === 'draw' ? 'seri' : null;

  return {
    board,
    currentPlayer,
    winner,
    winLine,
    gameResult,
    showModal,
    currentQuestion,
    isAiThinking,
    handleCellClick,
    handleAnswer,
    setShowModal,
    resetGame,
  };
}
