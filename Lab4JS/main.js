
function generateNormalArray(size) {
    return Array.from({ length: size }, () => Math.floor(Math.random() * 1000));
}

function generateSparseArray(size) {
    let arr = new Array(size);
    for (let i = 0; i < size; i++) {
        
        if (Math.random() > 0.3) {
            arr[i] = Math.floor(Math.random() * 1000);
        }
    }
    return arr;
}

console.log("=== ТЕСТУВАННЯ НЕРОЗРІДЖЕНОГО МАСИВУ (100 елементів) ===");
let normalArray = generateNormalArray(100);

let arrNormal1 = normalArray.slice();
let arrNormal2 = normalArray.slice();
let arrNormal3 = normalArray.slice();
let arrNormal4 = normalArray.slice();
let arrNormal5 = normalArray.slice();

SortLib.bubbleSort(arrNormal1, 'asc');
SortLib.selectionSort(arrNormal2, 'desc');
SortLib.insertionSort(arrNormal3, 'asc');
SortLib.shellSort(arrNormal4, 'desc');
SortLib.quickSort(arrNormal5, 'asc');

console.log("\n=== ТЕСТУВАННЯ РОЗРІДЖЕНОГО МАСИВУ (100 елементів, з undefined) ===");
let sparseArray = generateSparseArray(100);

let arrSparse1 = sparseArray.slice();
let arrSparse2 = sparseArray.slice();
let arrSparse3 = sparseArray.slice();
let arrSparse4 = sparseArray.slice();
let arrSparse5 = sparseArray.slice();

SortLib.bubbleSort(arrSparse1, 'desc');
SortLib.selectionSort(arrSparse2, 'asc');
SortLib.insertionSort(arrSparse3, 'desc');
SortLib.shellSort(arrSparse4, 'asc');
SortLib.quickSort(arrSparse5, 'desc');

console.log("\nУсі тести успішно виконано! Відкрийте код, щоб побачити реалізацію.");