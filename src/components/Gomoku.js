import React, { useState } from 'react';
import styled from 'styled-components';

// Square 组件 - 表示单个棋子
function Square({ value, onSquareClick }) {
  return (
    <StyledSquare onClick={onSquareClick}>
      {value && <Piece isBlack={value === 'black'} />}
    </StyledSquare>
  );
}

// Board 组件 - 表示棋盘
function Board({ squares, onPlay, isThinking, isPlayerBlack }) {
  function handleClick(row, col) {
    if (squares[row][col] || calculateWinner(squares) || isThinking) {
      return;
    }
    onPlay(row, col);
  }

  const winner = calculateWinner(squares);
  const status = winner 
    ? `获胜者: ${winner === 'black' ? '黑棋' : '白棋'}`
    : isThinking
    ? '电脑思考中...'
    : `轮到${isPlayerBlack ? '黑棋' : '白棋'}`;

  return (
    <div>
      <StatusDiv>{status}</StatusDiv>
      <BoardDiv>
        {squares.map((row, i) => (
          row.map((square, j) => (
            <Square
              key={`${i}-${j}`}
              value={square}
              onSquareClick={() => handleClick(i, j)}
            />
          ))
        ))}
      </BoardDiv>
    </div>
  );
}

// Game 组件 - 控制游戏逻辑
export default function Game() {
  const [gameStarted, setGameStarted] = useState(false);
  const [isPlayerBlack, setIsPlayerBlack] = useState(null);
  const [history, setHistory] = useState([Array(15).fill().map(() => Array(15).fill(null))]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isThinking, setIsThinking] = useState(false);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  // AI移动逻辑
  function evaluatePosition(squares, row, col, player) {
    const directions = [
      [1, 0],   // 水平
      [0, 1],   // 垂直
      [1, 1],   // 右下对角
      [1, -1]   // 左下对角
    ];
    
    let score = 0;
    
    directions.forEach(([dx, dy]) => {
      let count = 1;
      let blocked = 0;
      let space = 0;
      
      // 正向检查
      for (let i = 1; i <= 4; i++) {
        const newRow = row + (dx * i);
        const newCol = col + (dy * i);
        
        if (newRow < 0 || newRow >= 15 || newCol < 0 || newCol >= 15) {
          blocked++;
          break;
        }
        
        if (squares[newRow][newCol] === player) {
          count++;
        } else if (squares[newRow][newCol] === null) {
          space++;
          break;
        } else {
          blocked++;
          break;
        }
      }
      
      // 反向检查
      for (let i = 1; i <= 4; i++) {
        const newRow = row - (dx * i);
        const newCol = col - (dy * i);
        
        if (newRow < 0 || newRow >= 15 || newCol < 0 || newCol >= 15) {
          blocked++;
          break;
        }
        
        if (squares[newRow][newCol] === player) {
          count++;
        } else if (squares[newRow][newCol] === null) {
          space++;
          break;
        } else {
          blocked++;
          break;
        }
      }
      
      // 评分系统
      if (count >= 5) score += 100000;      // 连五
      else if (count === 4) {
        if (blocked === 0) score += 10000;   // 活四
        else if (blocked === 1) score += 1000; // 冲四
      }
      else if (count === 3) {
        if (blocked === 0) score += 1000;    // 活三
        else if (blocked === 1) score += 100; // 眠三
      }
      else if (count === 2) {
        if (blocked === 0) score += 100;     // 活二
        else if (blocked === 1) score += 10;  // 眠二
      }
      
      if (space > 0) score += space * 10;    // 空位价值
    });
    
    return score;
  }

  // 改进AI移动逻辑
  function getAIMove(squares) {
    let bestScore = -Infinity;
    let bestMove = null;
    
    // 检查是否有立即获胜���机会
    for (let i = 0; i < 15; i++) {
      for (let j = 0; j < 15; j++) {
        if (!squares[i][j]) {
          const testSquares = squares.map(row => [...row]);
          testSquares[i][j] = isPlayerBlack ? 'white' : 'black';
          if (calculateWinner(testSquares)) {
            return [i, j];  // 发现必胜位置
          }
        }
      }
    }
    
    // 检查是否需要阻止玩家获胜
    for (let i = 0; i < 15; i++) {
      for (let j = 0; j < 15; j++) {
        if (!squares[i][j]) {
          const testSquares = squares.map(row => [...row]);
          testSquares[i][j] = isPlayerBlack ? 'black' : 'white';
          if (calculateWinner(testSquares)) {
            return [i, j];  // 阻止玩家获胜
          }
        }
      }
    }
    
    // 评估所有可能的位置
    for (let i = 0; i < 15; i++) {
      for (let j = 0; j < 15; j++) {
        if (!squares[i][j]) {
          const aiScore = evaluatePosition(squares, i, j, isPlayerBlack ? 'white' : 'black') * 1.1; // AI进攻权重略高
          const playerScore = evaluatePosition(squares, i, j, isPlayerBlack ? 'black' : 'white');
          const score = Math.max(aiScore, playerScore);
          
          if (score > bestScore) {
            bestScore = score;
            bestMove = [i, j];
          }
        }
      }
    }
    
    return bestMove;
  }

  // 修改handlePlay函数，添加游戏结束处理
  function handlePlay(row, col) {
    const nextSquares = currentSquares.map(row => [...row]);
    nextSquares[row][col] = isPlayerBlack ? 'black' : 'white';
    
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);

    const winner = calculateWinner(nextSquares);
    if (winner) {
      const isPlayerWin = (isPlayerBlack && winner === 'black') || (!isPlayerBlack && winner === 'white');
      setTimeout(() => {
        alert(isPlayerWin ? '恭喜你获胜！要再来一局吗？' : 'AI获胜了！要再来一局吗？');
        if (window.confirm('是否重新开始？')) {
          setGameStarted(false);
        }
      }, 100);
      return;
    }

    if (!winner && !nextSquares.some(row => row.includes(null))) {
      setTimeout(() => {
        alert('平局！要再来一局吗？');
        if (window.confirm('是否重新开始？')) {
          setGameStarted(false);
        }
      }, 100);
      return;
    }

    if (!winner) {
      setIsThinking(true);
      setTimeout(() => {
        const [aiRow, aiCol] = getAIMove(nextSquares);
        const aiSquares = nextSquares.map(row => [...row]);
        aiSquares[aiRow][aiCol] = isPlayerBlack ? 'white' : 'black';
        setHistory([...nextHistory, aiSquares]);
        setCurrentMove(nextHistory.length);
        setIsThinking(false);

        if (calculateWinner(aiSquares)) {
          setTimeout(() => {
            alert('AI获胜了！要再来一局吗？');
            if (window.confirm('是否重新开始？')) {
              setGameStarted(false);
            }
          }, 100);
        }
      }, 500);
    }
  }

  function startGame(playerIsBlack) {
    setIsPlayerBlack(playerIsBlack);
    setGameStarted(true);
    setHistory([Array(15).fill().map(() => Array(15).fill(null))]);
    setCurrentMove(0);
    
    // 如果玩家选择白棋（后手），AI先手
    if (!playerIsBlack) {
      setIsThinking(true);
      setTimeout(() => {
        const [aiRow, aiCol] = getAIMove(Array(15).fill().map(() => Array(15).fill(null)));
        const nextSquares = Array(15).fill().map(() => Array(15).fill(null));
        nextSquares[aiRow][aiCol] = 'black';
        setHistory([Array(15).fill().map(() => Array(15).fill(null)), nextSquares]);
        setCurrentMove(1);
        setIsThinking(false);
      }, 500);
    }
  }

  // 添加悔棋功能
  function handleUndo() {
    if (currentMove < 2 || isThinking) return; // 至少要有一个完整的回合（玩家+AI）才能悔棋
    setHistory(history.slice(0, currentMove - 1));
    setCurrentMove(currentMove - 2); // 回退两步（玩家和AI的落子）
  }

  // 如果游戏还没开始，显示选择界面
  if (!gameStarted) {
    return (
      <GameContainer>
        <h1>五子棋</h1>
        <GameContent>
          <div>
            <h2>请选择：</h2>
            <Button onClick={() => startGame(true)}>黑先手</Button>
            <Button onClick={() => startGame(false)}>执白后手</Button>
          </div>
        </GameContent>
      </GameContainer>
    );
  }

  return (
    <GameContainer>
      <h1>五子棋</h1>
      <GameContent>
        <Board 
          squares={currentSquares} 
          onPlay={handlePlay}
          isThinking={isThinking}
          isPlayerBlack={isPlayerBlack}
        />
        <GameInfo>
          <div>游戏信息</div>
          <div>
            {isPlayerBlack ? '你执黑棋' : '你执白棋'}
          </div>
          <Button 
            onClick={handleUndo}
            disabled={currentMove < 2 || isThinking}
            style={{ opacity: (currentMove < 2 || isThinking) ? 0.5 : 1 }}
          >
            悔棋
          </Button>
          <Button onClick={() => setGameStarted(false)}>
            重新开始
          </Button>
        </GameInfo>
      </GameContent>
    </GameContainer>
  );
}

// 判断获胜者
function calculateWinner(squares) {
  const size = squares.length;
  
  // 检查所有可能的五子连线
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const current = squares[row][col];
      if (!current) continue;

      // 检查水平方向
      if (col <= size - 5) {
        if (squares[row][col + 1] === current &&
            squares[row][col + 2] === current &&
            squares[row][col + 3] === current &&
            squares[row][col + 4] === current) {
          return current;
        }
      }

      // 检查垂直方向
      if (row <= size - 5) {
        if (squares[row + 1][col] === current &&
            squares[row + 2][col] === current &&
            squares[row + 3][col] === current &&
            squares[row + 4][col] === current) {
          return current;
        }
      }

      // 检查右下对角线
      if (row <= size - 5 && col <= size - 5) {
        if (squares[row + 1][col + 1] === current &&
            squares[row + 2][col + 2] === current &&
            squares[row + 3][col + 3] === current &&
            squares[row + 4][col + 4] === current) {
          return current;
        }
      }

      // 检查左下对角线
      if (row <= size - 5 && col >= 4) {
        if (squares[row + 1][col - 1] === current &&
            squares[row + 2][col - 2] === current &&
            squares[row + 3][col - 3] === current &&
            squares[row + 4][col - 4] === current) {
          return current;
        }
      }
    }
  }
  return null;
}

// 样式组件
const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: linear-gradient(135deg, #f5d6a7 0%, #e6b980 100%);
  min-height: 100vh;
`;

const GameContent = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 20px;
`;

const GameInfo = styled.div`
  padding: 20px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  min-width: 200px;

  ol {
    padding-left: 30px;
  }

  button {
    margin: 5px 0;
    padding: 5px 10px;
    background: #4a90e2;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background: #357abd;
    }
  }
`;

const BoardDiv = styled.div`
  display: grid;
  grid-template-columns: repeat(15, 40px);
  grid-template-rows: repeat(15, 40px);
  background: #dcb35c;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
`;

const StyledSquare = styled.div`
  width: 40px;
  height: 40px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const Piece = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: ${props => props.isBlack ? '#000' : '#fff'};
  box-shadow: ${props => 
    props.isBlack 
      ? 'inset 0 0 8px rgba(255, 255, 255, 0.3)' 
      : 'inset 0 0 8px rgba(0, 0, 0, 0.3)'};
`;

const StatusDiv = styled.div`
  margin-bottom: 10px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 4px;
  text-align: center;
  font-weight: bold;
`;

const Button = styled.button`
  margin: 10px;
  padding: 10px 20px;
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  font-size: 16px;

  &:hover {
    background: ${props => props.disabled ? '#4a90e2' : '#357abd'};
  }
`; 