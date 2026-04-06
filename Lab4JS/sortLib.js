
const SortLib = {

    _extractValidElements: function(arr) {
        let valid = [];
        let undefinedCount = 0;
        
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] === undefined) {
                undefinedCount++;
            } else {
                valid.push(arr[i]);
            }
        }
        
        if (undefinedCount > 0) {
            console.warn(`[Системне повідомлення]: Знайдено та переміщено в кінець ${undefinedCount} undefined-елементів (розріджений масив).`);
        }
        
        return { valid, undefinedCount };
    },

    _rebuildArray: function(originalArr, sortedValid, undefinedCount) {
        for (let i = 0; i < sortedValid.length; i++) {
            originalArr[i] = sortedValid[i];
        }
        for (let i = sortedValid.length; i < originalArr.length; i++) {
            originalArr[i] = undefined;
        }
        return originalArr;
    },

    bubbleSort: function(arr, order = 'asc') {
        let { valid, undefinedCount } = this._extractValidElements(arr);
        let comps = 0, swaps = 0;
        let n = valid.length;

        for (let i = 0; i < n - 1; i++) {
            for (let j = 0; j < n - i - 1; j++) {
                comps++;
                let condition = order === 'asc' ? valid[j] > valid[j + 1] : valid[j] < valid[j + 1];
                if (condition) {
                    let temp = valid[j];
                    valid[j] = valid[j + 1];
                    valid[j + 1] = temp;
                    swaps++;
                }
            }
        }
        console.log(`[Обміну | ${order}] Порівнянь: ${comps}, Обмінів: ${swaps}`);
        return this._rebuildArray(arr, valid, undefinedCount);
    },

    selectionSort: function(arr, order = 'asc') {
        let { valid, undefinedCount } = this._extractValidElements(arr);
        let comps = 0, swaps = 0;
        let n = valid.length;

        for (let i = 0; i < n - 1; i++) {
            let targetIdx = i;
            for (let j = i + 1; j < n; j++) {
                comps++;
                let condition = order === 'asc' ? valid[j] < valid[targetIdx] : valid[j] > valid[targetIdx];
                if (condition) {
                    targetIdx = j;
                }
            }
            if (targetIdx !== i) {
                let temp = valid[i];
                valid[i] = valid[targetIdx];
                valid[targetIdx] = temp;
                swaps++;
            }
        }
        console.log(`[Мінімальних елементів | ${order}] Порівнянь: ${comps}, Обмінів: ${swaps}`);
        return this._rebuildArray(arr, valid, undefinedCount);
    },

    insertionSort: function(arr, order = 'asc') {
        let { valid, undefinedCount } = this._extractValidElements(arr);
        let comps = 0, moves = 0;
        let n = valid.length;

        for (let i = 1; i < n; i++) {
            let key = valid[i];
            let j = i - 1;

            comps++; 
            while (j >= 0 && (order === 'asc' ? valid[j] > key : valid[j] < key)) {
                valid[j + 1] = valid[j];
                j--;
                moves++;
                if (j >= 0) comps++; 
            }
            valid[j + 1] = key;
            if (j !== i - 1) moves++; 
        }
        console.log(`[Вставок | ${order}] Порівнянь: ${comps}, Переміщень: ${moves}`);
        return this._rebuildArray(arr, valid, undefinedCount);
    },

    shellSort: function(arr, order = 'asc') {
        let { valid, undefinedCount } = this._extractValidElements(arr);
        let comps = 0, moves = 0;
        let n = valid.length;

        for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
            for (let i = gap; i < n; i++) {
                let temp = valid[i];
                let j;
                comps++;
                for (j = i; j >= gap && (order === 'asc' ? valid[j - gap] > temp : valid[j - gap] < temp); j -= gap) {
                    valid[j] = valid[j - gap];
                    moves++;
                    if (j - gap >= gap) comps++;
                }
                valid[j] = temp;
                moves++;
            }
        }
        console.log(`[Шелла | ${order}] Порівнянь: ${comps}, Переміщень: ${moves}`);
        return this._rebuildArray(arr, valid, undefinedCount);
    },

    quickSort: function(arr, order = 'asc') {
        let { valid, undefinedCount } = this._extractValidElements(arr);
        let stats = { comps: 0, swaps: 0 };

        const partition = (arr, low, high) => {
            let pivot = arr[Math.floor((low + high) / 2)];
            let i = low;
            let j = high;

            while (i <= j) {
                while (order === 'asc' ? arr[i] < pivot : arr[i] > pivot) {
                    stats.comps++; i++;
                }
                stats.comps++; 

                while (order === 'asc' ? arr[j] > pivot : arr[j] < pivot) {
                    stats.comps++; j--;
                }
                stats.comps++; 

                if (i <= j) {
                    let temp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = temp;
                    stats.swaps++;
                    i++;
                    j--;
                }
            }
            return i;
        };

        const qSort = (arr, low, high) => {
            if (arr.length > 1) {
                let index = partition(arr, low, high);
                if (low < index - 1) qSort(arr, low, index - 1);
                if (index < high) qSort(arr, index, high);
            }
        };

        qSort(valid, 0, valid.length - 1);
        console.log(`[Хоара (Quick) | ${order}] Порівнянь: ${stats.comps}, Обмінів: ${stats.swaps}`);
        return this._rebuildArray(arr, valid, undefinedCount);
    }
};