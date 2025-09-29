let fields = Array(9).fill(null);
    let currentPlayer = 'circle';
    let gameOver = false;

    const WIN_LINES = [
      [0,1,2],[3,4,5],[6,7,8], 
      [0,3,6],[1,4,7],[2,5,8], 
      [0,4,8],[2,4,6]         
    ];

    window.onload = init;
    function init(){
      document.getElementById('reset').addEventListener('click', resetGame);
      render();
      updateStatus();
    }

    function toSymbol(v){
      if(v==='circle') return generateCircleSVG();
      if(v==='cross')  return generateCrossSVG();
      return '';
    }

    function render(){
      let html = '<table class="board">';
      for(let r=0;r<3;r++){
        html += '<tr>';
        for(let c=0;c<3;c++){
          const i = r*3+c;
          const cell = toSymbol(fields[i]);
          html += `<td data-index="${i}" onclick="handleClick(${i})">${cell}</td>`;
        }
        html += '</tr>';
      }
      html += '</table>';
      const container = document.getElementById('container');
      container.innerHTML = html;
    }

    function handleClick(i){
      if(gameOver) return;
      if(fields[i] !== null) return;

      fields[i] = currentPlayer;
      const winnerInfo = checkWinner();

      if(winnerInfo){
        gameOver = true;
        highlightWin(winnerInfo.line);
        updateStatus(winnerInfo.player);
        return;
      }

      if(isDraw()){
        gameOver = true;
        updateStatus(null, /*draw*/true);
        return;
      }

      currentPlayer = currentPlayer === 'circle' ? 'cross' : 'circle';
      render(); // neu zeichnen, damit Animationen pro Zug sichtbar bleiben
      updateStatus();
    }

    function checkWinner(){
      for(const line of WIN_LINES){
        const [a,b,c] = line;
        if(fields[a] && fields[a]===fields[b] && fields[a]===fields[c]){
          return { player: fields[a], line };
        }
      }
      return null;
    }

    function isDraw(){
      return fields.every(v => v !== null);
    }

    function updateStatus(winner=null, draw=false){
      const status = document.getElementById('status');
      if(winner){
        status.textContent = (winner==='circle' ? 'Kreis (O)' : 'Kreuz (X)') + ' gewinnt!';
        return;
      }
      if(draw){
        status.textContent = 'Unentschieden!';
        return;
      }
      status.textContent = 'Am Zug: ' + (currentPlayer==='circle' ? 'Kreis (O)' : 'Kreuz (X)');
    }

    function highlightWin(line){

      render();
      const cells = document.querySelectorAll('.board td');
      line.forEach(idx => cells[idx].classList.add('win'));
    }

    function resetGame(){
      fields = Array(9).fill(null);
      currentPlayer = 'circle';
      gameOver = false;
      render();
      updateStatus();
    }

    function generateCircleSVG(){
      const color = '#00B0EF';
      const size = 70;
      return `<svg width="${size}" height="${size}" viewBox="0 0 70 70">
        <circle cx="35" cy="35" r="30" stroke="${color}" stroke-width="5" fill="none">
          <animate attributeName="stroke-dasharray" from="0 188.5" to="188.5 0" dur="0.2s" fill="freeze" />
        </circle>
      </svg>`;
    }

    function generateCrossSVG(){
  const color = '#FFC000';
  const size = 70;
  return `
    <svg width="${size}" height="${size}" viewBox="0 0 70 70">
      <line x1="0" y1="0" x2="0" y2="0" stroke="${color}" stroke-width="5">
        <animate attributeName="x2" values="0;70" dur="200ms" fill="freeze"/>
        <animate attributeName="y2" values="0;70" dur="200ms" fill="freeze"/>
      </line>
      <line x1="70" y1="0" x2="70" y2="0" stroke="${color}" stroke-width="5">
        <animate attributeName="x2" values="70;0" dur="200ms" fill="freeze"/>
        <animate attributeName="y2" values="0;70" dur="200ms" fill="freeze"/>
      </line>
    </svg>
  `;
}
