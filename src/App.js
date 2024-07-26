

import React, { useState } from 'react';

import './App.css';


const initial = [

[5, 3, '', '', 7, '', '', '', ''],

[6, '', '', 1, 9, 5, '', '', ''],

['', 9, 8, '', '', '', '', 6, ''],

[8, '', '', '', 6, '', '', '', 3],

[4, '', '', 8, '', 3, '', '', 1],

[7, '', '', '', 2, '', '', '', 6],

['', 6, '', '', '', '', 2, 8, ''],

['', '', '', 4, 1, 9, '', '', 5],

['', '', '', '', 8, '', '', 7, 9]

];


function App() {

const [sudokuArr, setSudokuArr] = useState(getDeepCopy(initial));


function getDeepCopy(arr) {

return JSON.parse(JSON.stringify(arr));

}


function onInputChange(e, row, col) {

const val = e.target.value;

const grid = getDeepCopy(sudokuArr);

if (val === '' || (val >= '1' && val <= '9')) {

grid[row][col] = val;

setSudokuArr(grid);

}

}


function compareSudokus(currentSudoku, solvedSudoku) {

let res = {

isComplete: true,

isSolvable: true,

};

for (let i = 0; i < 9; i++) {

for (let j = 0; j < 9; j++) {

if (currentSudoku[i][j] !== solvedSudoku[i][j]) {

if (currentSudoku[i][j] !== '') {

res.isSolvable = false;

}

res.isComplete = false;

}

}

}

return res;

}


function checkSudoku() {

let sudoku = getDeepCopy(sudokuArr);

solver(sudoku);

let compare = compareSudokus(sudokuArr, sudoku);

if (compare.isComplete) {

alert("Congratulations! You have solved the Sudoku.");

} else if (compare.isSolvable) {

alert("Keep going!");

} else {

alert("Sudoku can't be solved. Try again.");

}

}


//validate sudoku

function validateSudoku() {

for (let row = 0; row < 9; row++) {

for (let col = 0; col < 9; col++) {

const num = sudokuArr[row][col];

if (num !== '') {

if (!checkValid(sudokuArr, row, col, num)) {

alert("Sudoku is invalid.");

return;

}

}

}

}

alert("Sudoku is valid so far.");

}


function checkRow(grid, row, num) {

return grid[row].filter(n => n === num).length <= 1;

}


function checkCol(grid, col, num) {

return grid.map(row => row[col]).filter(n => n === num).length <= 1;

}


function checkBox(grid, row, col, num) {

let rowStart = row - (row % 3);

let colStart = col - (col % 3);

let boxNumbers = [];

for (let i = 0; i < 3; i++) {

for (let j = 0; j < 3; j++) {

boxNumbers.push(grid[rowStart + i][colStart + j]);

}

}

return boxNumbers.filter(n => n === num).length <= 1;

}


function checkValid(grid, row, col, num) {

return checkRow(grid, row, num) && checkCol(grid, col, num) && checkBox(grid, row, col, num);

}


function getNext(row, col) {

return col !== 8 ? [row, col + 1] : row !== 8 ? [row + 1, 0] : [0, 0];

}


function solver(grid, row = 0, col = 0) {

if (grid[row][col] !== '') {

let isLast = row >= 8 && col >= 8;

if (!isLast) {

let [newRow, newCol] = getNext(row, col);

return solver(grid, newRow, newCol);

}

return true;

}


for (let num = '1'; num <= '9'; num++) {

if (checkValid(grid, row, col, num)) {

grid[row][col] = num;

let [newRow, newCol] = getNext(row, col);

if (newRow === 0 && newCol === 0) {

return true;

}

if (solver(grid, newRow, newCol)) {

return true;

}

}

}

grid[row][col] = '';

return false;

}


function solveSudoku() {

let sudoku = getDeepCopy(sudokuArr);

solver(sudoku);

setSudokuArr(sudoku);

}


//reset sudoku

function resetSudoku() {

let sudoku = getDeepCopy(initial);

setSudokuArr(sudoku);

}


return (

<div class="row">

<div className="container">

<h1>Sudoku Solver</h1>

<table>

<tbody>

{[...Array(9)].map((_, rowIndex) => (

<tr key={rowIndex}>

{[...Array(9)].map((_, colIndex) => (

<td key={`${rowIndex}-${colIndex}`}>

<input

onChange={(e) => onInputChange(e, rowIndex, colIndex)}

value={sudokuArr[rowIndex][colIndex] === '' ? '' : sudokuArr[rowIndex][colIndex]}

id="input"

disabled={initial[rowIndex][colIndex] !== ''}

/>

</td>

))}

</tr>

))}

</tbody>

</table>

<div class="ms-5">

<button type="button" class="btn btn-primary" onClick={validateSudoku}>validate</button>

<button type="button" class="btn btn-secondary" onClick={checkSudoku}>check</button>

<button type="button" class="btn btn-success" onClick={resetSudoku}>reset</button>

<button type="button" class="btn btn-danger" onClick={solveSudoku}>solve</button>

</div>

</div>

</div>

);

}


export default App;