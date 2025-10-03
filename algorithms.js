// algorithms.js
// Contains algorithm functions that operate on the global `array` and DOM bars.
// Each function is async to allow step-by-step animation.

// Utility to set complexity text
const complexityMap = {
  bubble:  { time: "O(n²)", space: "O(1)" },
  selection:{ time: "O(n²)", space: "O(1)" },
  insertion:{ time: "O(n²) (best: O(n))", space: "O(1)" },
  merge:   { time: "O(n log n)", space: "O(n)" },
  quick:   { time: "O(n log n) (worst: O(n²))", space: "O(log n) avg (stack)" },
};

function setComplexity(key){
  const c = complexityMap[key] ?? { time: "–", space: "–" };
  document.getElementById("time-complexity").textContent = c.time;
  document.getElementById("space-complexity").textContent = c.space;
}

// ===== Bubble Sort =====
async function bubbleSort(){
  setComplexity("bubble");
  const n = array.length;
  for(let i = 0; i < n - 1 && !stopRequested; i++){
    for(let j = 0; j < n - i - 1 && !stopRequested; j++){
      highlightCompare(j, j+1);
      await stepDelay();
      if(array[j] > array[j+1]){
        await swapBars(j, j+1);
      }
      unhighlight(j, j+1);
    }
    markPlaced(n - i - 1);
  }
  if(!stopRequested) markAllSorted();
}

// ===== Selection Sort =====
async function selectionSort(){
  setComplexity("selection");
  const n = array.length;
  for(let i = 0; i < n - 1 && !stopRequested; i++){
    let minIdx = i;
    highlightPlaced(i); // current position being filled
    for(let j = i + 1; j < n && !stopRequested; j++){
      highlightCompare(minIdx, j);
      await stepDelay();
      if(array[j] < array[minIdx]){
        unhighlight(minIdx);
        minIdx = j;
      }
      unhighlight(j);
    }
    if(minIdx !== i){
      await swapBars(i, minIdx);
    }
    unhighlight(i, minIdx);
    markPlaced(i);
  }
  if(!stopRequested) markAllSorted();
}

// ===== Insertion Sort =====
async function insertionSort(){
  setComplexity("insertion");
  const n = array.length;
  for(let i = 1; i < n && !stopRequested; i++){
    let key = array[i];
    let j = i - 1;
    highlightPlaced(i);
    while(j >= 0 && array[j] > key && !stopRequested){
      highlightCompare(j, j+1);
      await writeBar(j+1, array[j]); // shift right
      j--;
      await stepDelay();
      clearCompare(j+1);
    }
    await writeBar(j+1, key); // place
    unhighlight(i);
  }
  if(!stopRequested) markAllSorted();
}

// ===== Merge Sort =====
async function mergeSort(){
  setComplexity("merge");
  await mergeSortRange(0, array.length - 1);
  if(!stopRequested) markAllSorted();
}
async function mergeSortRange(l, r){
  if(stopRequested) return;
  if(l >= r) return;
  const m = Math.floor((l + r) / 2);
  await mergeSortRange(l, m);
  await mergeSortRange(m+1, r);
  await merge(l, m, r);
}
async function merge(l, m, r){
  const left = array.slice(l, m+1);
  const right = array.slice(m+1, r+1);
  let i = 0, j = 0, k = l;
  while(i < left.length && j < right.length && !stopRequested){
    highlightCompare(k, k); // mark write position
    await stepDelay();
    if(left[i] <= right[j]){
      await writeBar(k, left[i], true);
      i++;
    }else{
      await writeBar(k, right[j], true);
      j++;
    }
    k++;
  }
  while(i < left.length && !stopRequested){
    await writeBar(k++, left[i++], true);
  }
  while(j < right.length && !stopRequested){
    await writeBar(k++, right[j++], true);
  }
}

// ===== Quick Sort =====
async function quickSort(){
  setComplexity("quick");
  await quickSortRange(0, array.length - 1);
  if(!stopRequested) markAllSorted();
}
async function quickSortRange(l, r){
  if(stopRequested) return;
  if(l >= r) return;
  const p = await partition(l, r);
  await quickSortRange(l, p - 1);
  await quickSortRange(p + 1, r);
}
async function partition(l, r){
  const pivot = array[r];
  highlightPlaced(r); // pivot
  let i = l;
  for(let j = l; j < r && !stopRequested; j++){
    highlightCompare(j, r);
    await stepDelay();
    if(array[j] < pivot){
      await swapBars(i, j);
      i++;
    }
    unhighlight(j);
  }
  await swapBars(i, r);
  unhighlight(r);
  markPlaced(i);
  return i;
}
