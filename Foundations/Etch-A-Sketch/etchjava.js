const CONTAINER     = document.querySelector('.grid-container');
const CLR_BTN       = document.getElementById('clear-btn');
const RSZ_BTN       = document.getElementById('resize-btn');
const RNBW_BTN      = document.getElementById('rainbow-btn');
const SHADE_BTN     = document.getElementById('shading-btn');
const ERASE_BTN     = document.getElementById('eraser-btn');
const DEFAULT_BTN   = document.getElementById('default-btn');

const CLEAR_COLOR = '#fff8e2';

let currentMode   = 'default';
let mouseDown     = false;
let clearToRight  = true;

document.body.onmousedown = () => (mouseDown = true);
document.body.onmouseup   = () => (mouseDown = false);

function createGrid(size){
  CONTAINER.innerHTML = '';
  const cell = `calc(100% / ${size})`;

  for(let i=0;i<size*size;i++){
    const sq = document.createElement('div');
    sq.classList.add('grid');
    sq.style.flex   = `0 0 ${cell}`;
    sq.style.height = cell;
    sq.style.animationDelay = `${i*0.002}s`;

    sq.addEventListener('mouseenter',()=>{
      if(currentMode==='shading') return;
      const p = getPreviewColor(sq);
      sq.dataset.previewColor = p;
      sq.classList.add('preview');
      sq.style.backgroundColor = p;
    });

    sq.addEventListener('mouseleave',()=>{
      if(currentMode==='shading') return;
      sq.classList.remove('preview');
      sq.style.backgroundColor = sq.dataset.savedColor || CLEAR_COLOR;
    });

    sq.addEventListener('mousedown',()=>applyColor(sq));
    sq.addEventListener('mouseover',()=>{ if(mouseDown) applyColor(sq); });

    CONTAINER.appendChild(sq);
  }
}

function applyColor(sq){
  const c = getPreviewColor(sq);
  sq.dataset.savedColor   = c;
  sq.dataset.previewColor = c;
  sq.style.backgroundColor = c;
  sq.classList.add('clicked');
  setTimeout(()=>sq.classList.remove('clicked'),150);
}

function getPreviewColor(sq){
  if(currentMode==='default') return 'gray';
  if(currentMode==='rainbow') return sq.dataset.previewColor || (sq.dataset.previewColor = getRandomColor());
  if(currentMode==='eraser')  return CLEAR_COLOR;
  if(currentMode==='shading') return getDarkerColor(sq.dataset.savedColor || CLEAR_COLOR);
  return 'gray';
}

function getDarkerColor(col){
  const rgb = col.startsWith('rgb') ? col.match(/\d+/g).map(Number) : [255,255,255];
  for(let i=0;i<3;i++) rgb[i] = Math.max(0, Math.floor(rgb[i]*0.9));
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

function getRandomColor(){
  const r = Math.floor(Math.random()*256);
  const g = Math.floor(Math.random()*256);
  const b = Math.floor(Math.random()*256);
  return `rgb(${r}, ${g}, ${b})`;
}

function setActive(mode,btn){
  currentMode = mode;
  document.querySelectorAll('.ctrls button').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
}

CLR_BTN.addEventListener('click',()=>{
  CLR_BTN.classList.remove('animate-left','animate-right');
  void CLR_BTN.offsetWidth;
  CLR_BTN.classList.add(clearToRight ? 'animate-right' : 'animate-left');
  clearToRight = !clearToRight;
  document.querySelectorAll('.grid').forEach(sq=>{
    sq.style.backgroundColor = CLEAR_COLOR;
    delete sq.dataset.savedColor;
    delete sq.dataset.previewColor;
  });
});

RSZ_BTN.addEventListener('click',()=>{
  const n=parseInt(prompt('Enter new grid size (16–100):'));
  if(n>=16 && n<=100) createGrid(n);
});

RNBW_BTN  .addEventListener('click',()=>setActive('rainbow', RNBW_BTN));
SHADE_BTN .addEventListener('click',()=>setActive('shading', SHADE_BTN));
ERASE_BTN .addEventListener('click',()=>setActive('eraser',  ERASE_BTN));
DEFAULT_BTN.addEventListener('click',()=>setActive('default', DEFAULT_BTN));

document.addEventListener('DOMContentLoaded',()=>createGrid(16));
