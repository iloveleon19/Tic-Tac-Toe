// https://codepen.io/gaearon/pen/gWWZgR?editors=0010
// 1.在歷史動作列表中，用（欄，列）的格式來顯示每個動作的位置。
// 2.在動作列表中，將目前被選取的項目加粗。
// 3.改寫 Board，使用兩個 loop 建立方格而不是寫死它。
// 4.加上一個切換按鈕讓你可以根據每個動作由小到大、由大到小來排序。
// 5.當勝負揭曉時，把連成一條線的那三個方格凸顯出來。
// 6.當沒有勝負時，顯示遊戲結果為平手。

function Square(props) {
  
  console.log(props.color)
    return (
      <button className="square" onClick={props.onClick} style={{backgroundColor:props.color}}>
        {props.value}
       </button>
    );
  }
  
  function calculateWinner(squares){
    const lines = [
      [0,1,2],
      [3,4,5],
      [6,7,8],
      [0,3,6],
      [1,4,7],
      [2,5,8],
      [0,4,8],
      [2,4,6],
    ];
    for(let i=0; i<lines.length;i++){
      const [a,b,c] = lines[i];
      if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
        return lines[i];
      }
    }
    return null;
  }
  
  class Board extends React.Component { 
    renderSquare(i) {
      const color = this.props.winnerLine && this.props.winnerLine.indexOf(i) !== -1 ? 'yellow' : '';
      return (
        <Square key={i} color={color} value={this.props.squares[i]} onClick={() => this.props.onClick(i)}/>
      );
    }

    render() {
        let result = [];
        for(let i=0;i<3;i++){
            let rs=[];
            for(let j=0;j<3;j++){
                rs.push(this.renderSquare(i*3+j))
            }
            result.push(<div className="board-row" key={i}>{rs}</div>)
        }

      return (
        <div>
            {result}
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        history:[{
          squares: Array(9).fill(null),
        }],
        stepHistory:[{
            step:null
        }],
        stepNumber: 0,
        xIsNext: true,
        sort:'DESC',
      };
    }
    
    handleClick(i){
      const history = this.state.history.slice(0, this.state.stepNumber+1);
      const stepHistory = this.state.stepHistory.slice(0,this.state.stepNumber+1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      if(calculateWinner(squares) || squares[i]){
        return;
      }
      
      squares[i] = this.state.xIsNext ? 'X' : 'O';
      this.setState({
        history: history.concat([{
          squares: squares,
        }]),
        stepHistory:stepHistory.concat([{
          step:i
        }]),
        stepNumber:history.length,
        xIsNext: !this.state.xIsNext,
      });
    }

    handleSort(){
        const sort = this.state.sort=='DESC'? 'ASC' : 'DESC';
        this.setState({sort:sort})
    }
    
    jumpTo(step){
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0,
      });
    }
    
    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winnerLine = calculateWinner(current.squares);
      const winner = winnerLine ? current.squares[winnerLine[0]] :null
      const stepNumber = this.state.stepNumber;
      const stepHistory = this.state.stepHistory;

      const stepList = {
          '0':'0,0',
          '1':'0,1',
          '2':'0,2',
          '3':'1,0',
          '4':'1,1',
          '5':'1,2',
          '6':'2,0',
          '7':'2,1',
          '8':'2,2',
      }

      const moves = history.map((step, move)=>{
        const desc = move ? 
        'Go to move #' + move + '(' +stepList[stepHistory[move].step]+ ')':
        'Go to game start';

        if(stepNumber==move){
          return (
            <li key={move}>
              <button onClick={()=>this.jumpTo(move)}><b>{desc}</b></button>
            </li>
          );
        }
        return (
          <li key={move}>
            <button onClick={()=>this.jumpTo(move)}>{desc}</button>
          </li>
        );
      })

      const desc_moves = history.map((step,move) => {
        const m = history.length-move-1;
        const desc = m  ? 
        'Go to move #' + m + '(' +stepList[stepHistory[m].step]+ ')':
        'Go to game start';

        if(stepNumber==m){
          return (
            <li key={m}>
              <button onClick={()=>this.jumpTo(m)}><b>{desc}</b></button>
            </li>
          );
        }
        return (
          <li key={m}>
            <button onClick={()=>this.jumpTo(m)}>{desc}</button>
          </li>
        );
      })

      const show_moves = this.state.sort=='DESC' ? moves : desc_moves

      let status;
      if(winner) {
        status = 'Winner: ' + winner;
      } else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }

      if(!winner && current.squares.indexOf(null)===-1){
        status = 'draw';
      }

      return (
        <div className="game">
          <div className="game-board">
            <Board
              squares={current.squares}
              winnerLine={winnerLine}
              onClick={(i)=>this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{show_moves}</ol>
            <button onClick={()=>this.handleSort()}>sort {this.state.sort}</button>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
