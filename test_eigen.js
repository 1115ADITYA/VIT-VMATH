const fs = require('fs');
const code = fs.readFileSync('get-started.js', 'utf8');
const startIdx = code.indexOf('function identityMatrix');
const endIdx = code.indexOf('// Matrix Formatting Helper');
eval(code.substring(startIdx, endIdx));

console.log('=== Eigenvalue Tests ===');

// 4x4 Diagonal [1,2,3,4]
let D4 = [[1,0,0,0],[0,2,0,0],[0,0,3,0],[0,0,0,4]];
console.log('4x4 Diagonal (expect 1,2,3,4):', qrEigenvalues(D4));

// 4x4 Tridiagonal
let T4 = [[4,1,0,0],[1,4,1,0],[0,1,4,1],[0,0,1,4]];
console.log('4x4 Tridiag (expect ~2.382,3.382,4.618,5.618):', qrEigenvalues(T4).map(e=>e.toFixed(3)));

// 5x5 Diagonal [1,2,3,4,5]
let D5 = [[1,0,0,0,0],[0,2,0,0,0],[0,0,3,0,0],[0,0,0,4,0],[0,0,0,0,5]];
console.log('5x5 Diagonal (expect 1,2,3,4,5):', qrEigenvalues(D5));

// Eigenvectors for 4x4 diagonal
let ev1 = findEigenvectors(D4, 1);
let ev2 = findEigenvectors(D4, 2);
let ev3 = findEigenvectors(D4, 3);
let ev4 = findEigenvectors(D4, 4);
console.log('\n=== Eigenvector Tests (4x4 diagonal) ===');
console.log('EV lambda=1:', ev1);
console.log('EV lambda=2:', ev2);
console.log('EV lambda=3:', ev3);
console.log('EV lambda=4:', ev4);
