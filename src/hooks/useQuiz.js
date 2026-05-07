// src/hooks/useQuiz.js
import { useState, useCallback } from 'react';
import quizData from '../data/quiz.json';

function shuffleArray(array) {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

export function useQuiz(topikId) {
  const topikQuiz = quizData.find(q => q.topik_id === topikId);
  
  // Initialize state with shuffled questions and shuffled options
  const [sessionSoal, setSessionSoal] = useState(() => {
    const originalSoal = topikQuiz?.soal ?? [];
    // Shuffle question order
    const shuffledQuestions = shuffleArray(originalSoal);
    
    // For each question, shuffle its options
    return shuffledQuestions.map(q => {
      // Strip letters "A. ", "B. ", etc if they exist to shuffle purely the content
      const cleanPilihan = q.pilihan.map(p => p.replace(/^[A-D]\.\s+/, ''));
      const shuffledOptions = shuffleArray(cleanPilihan);
      
      // Find the text of the correct answer from original letter
      const originalCorrectLetter = q.jawaban_benar; // e.g. "B"
      const correctText = q.pilihan.find(p => p.startsWith(originalCorrectLetter + '.'))?.replace(/^[A-D]\.\s+/, '');

      return {
        ...q,
        shuffledOptions,
        correctText
      };
    });
  });

  const [currentIdx, setCurrentIdx]   = useState(0);
  const [selectedLetter, setSelected] = useState(null); // 'A', 'B', etc
  const [isAnswered, setIsAnswered]   = useState(false);
  const [score, setScore]             = useState(0);
  const [results, setResults]         = useState([]); // [{soalId, isCorrect}]
  const [direction, setDirection]     = useState(1);  // for slide animation

  const currentSoal = sessionSoal[currentIdx] ?? null;
  const isLast      = currentIdx === sessionSoal.length - 1;
  const total       = sessionSoal.length;

  const selectAnswer = useCallback((letter, text) => {
    if (isAnswered) return;
    setSelected(letter);
    setIsAnswered(true);

    const isCorrect = text === currentSoal?.correctText;
    if (isCorrect) setScore(s => s + 1);
    setResults(r => [...r, { soalId: currentSoal?.id, isCorrect }]);
  }, [isAnswered, currentSoal]);

  const nextSoal = useCallback(() => {
    if (!isLast) {
      setDirection(1);
      setCurrentIdx(i => i + 1);
      setSelected(null);
      setIsAnswered(false);
    }
  }, [isLast]);

  const getScorePercent = useCallback(() => {
    if (total === 0) return 0;
    return Math.round((score / total) * 100);
  }, [score, total]);

  return {
    soalList: sessionSoal,
    currentSoal,
    currentIdx,
    total,
    isLast,
    direction,
    selectedAnswer: selectedLetter,
    isAnswered,
    score,
    results,
    selectAnswer,
    nextSoal,
    getScorePercent,
  };
}
