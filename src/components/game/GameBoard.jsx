// src/components/game/GameBoard.jsx
import GameCell from './GameCell';

export default function GameBoard({ board, winLine, onCellClick, disabled }) {
  return (
    <div className="grid grid-cols-3 gap-2.5 w-full max-w-[300px] mx-auto">
      {board.map((value, idx) => (
        <GameCell
          key={idx}
          index={idx}
          value={value}
          isWinning={winLine.includes(idx)}
          onClick={() => !disabled && onCellClick(idx)}
        />
      ))}
    </div>
  );
}
