// script.js
// Global state
let array = [];
let stopRequested = false;

const barContainer = document.getElementById("bar-container");
const sizeSlider = document.getElementById("size");
const speedSlider = document.getElementById("speed");
const sizeValue = document.getElementById("sizeValue");
const speedValue = document.getElementById("speedValue");
const generateBtn = document.getElementById("generate");
const stopBtn = document.getElementById("stop");
const algoButtons = document.querySelectorAll("[data-algo]");

sizeSlider.addEventListener("input", () => {
  sizeValue.textContent = sizeSlider.value;
  generateArray();
});
speedSlider.addEventListener("input", () => {
  speedValue.textContent = speedSlider.value;
});
generateBtn.addEventListener("click", generateArray);
stopBtn.addEventListener("click", () => stopRequested = true);

algoButtons.forEach(btn => {
  btn.addEventListener("click", async () => {
    const algo = btn.dataset.algo;
    await runAlgorithm(algo);
  });
});

function randomInt(min, max){ return Math.floor(Math.random() * (max - min + 1)) + min; }

function generateArray(){
  const n = parseInt(sizeSlider.value, 10);
  array = Array.from({length: n}, () => randomInt(10, 380));
  renderBars();
  // reset complexity
  document.getElementById("time-complexity").textContent = "–";
  document.getElementById("space-complexity").textContent = "–";
}

function renderBars(){
  barContainer.innerHTML = "";
  const containerWidth = barContainer.clientWidth || 800;
  const gap = 2;
  const barWidth = Math.max(6, Math.min(22, Math.floor((containerWidth - (array.length-1)*gap) / array.length)));
  barContainer.style.setProperty("--barW", barWidth + "px");

  array.forEach((val, idx) => {
    const bar = document.createElement("div");
    bar.className = "bar";
    bar.style.height = `${val}px`;
    bar.dataset.index = idx;
    barContainer.appendChild(bar);
  });
}

// Animation helpers
function currentDelay(){
  // Lower slider value => faster animation => smaller delay
  return parseInt(speedSlider.value, 10);
}
function stepDelay(){ return new Promise(res => setTimeout(res, currentDelay())); }

function getBar(i){ return barContainer.children[i]; }

async function swapBars(i, j){
  // Swap values
  [array[i], array[j]] = [array[j], array[i]];
  // Swap heights visually
  const bi = getBar(i);
  const bj = getBar(j);
  if(!bi || !bj) return;
  bi.style.background = "var(--swap)";
  bj.style.background = "var(--swap)";
  const h1 = bi.style.height;
  const h2 = bj.style.height;
  bi.style.height = h2;
  bj.style.height = h1;
  await stepDelay();
  bi.style.background = "var(--bar)";
  bj.style.background = "var(--bar)";
}

async function writeBar(i, value, isMerge=false){
  array[i] = value;
  const b = getBar(i);
  if(!b) return;
  b.style.background = "var(--swap)";
  b.style.height = `${value}px`;
  await stepDelay();
  if(!isMerge) b.style.background = "var(--bar)";
}

function highlightCompare(i, j){
  const bi = getBar(i); const bj = getBar(j);
  if(bi) bi.style.background = "var(--compare)";
  if(bj) bj.style.background = "var(--compare)";
}
function clearCompare(i){
  const b = getBar(i);
  if(b) b.style.background = "var(--bar)";
}
function unhighlight(...idxs){
  idxs.forEach(i => {
    const b = getBar(i);
    if(b) b.style.background = "var(--bar)";
  });
}
function markPlaced(i){
  const b = getBar(i);
  if(b) b.style.background = "var(--placed)";
}
function highlightPlaced(i){
  const b = getBar(i);
  if(b) b.style.background = "var(--placed)";
}
function markAllSorted(){
  for(let i=0;i<array.length;i++){
    const b = getBar(i);
    if(b) b.style.background = "var(--placed)";
  }
}

// Control flow
async function runAlgorithm(algo){
  stopRequested = false;
  disableControls(true);
  try{
    if(algo === "bubble")      await bubbleSort();
    else if(algo === "selection") await selectionSort();
    else if(algo === "insertion") await insertionSort();
    else if(algo === "merge")     await mergeSort();
    else if(algo === "quick")     await quickSort();
  } catch(err){
    console.error(err);
  } finally {
    disableControls(false);
  }
}

function disableControls(isSorting){
  sizeSlider.disabled = isSorting;
  speedSlider.disabled = false; // allow changing speed live
  generateBtn.disabled = isSorting;
  algoButtons.forEach(b => b.disabled = isSorting);
  stopBtn.disabled = !isSorting;
}

window.addEventListener("resize", renderBars);

// Bootstrap
generateArray();
