let isSorting = false; // Flag to check if sorting is in progress
let timeoutId; // To store timeout ID
const container = document.getElementById('container');
let selectedAlgorithm = 'bubbleSort';

// Generate random array of heights
const array = Array.from({ length: 30 }, () => Math.floor(Math.random() * 300) + 10);

// Function to visualize array
function visualizeArray(array) {
    container.innerHTML = ''; // Clear container
    array.forEach((value) => {
        const bar = document.createElement('div');
        bar.classList.add('bar');
        bar.style.height = `${value}px`;
        container.appendChild(bar);
    });
}

// Sorting algorithms
async function bubbleSort(array) {
    const len = array.length;
    for (let i = 0; i < len - 1; i++) {
        for (let j = 0; j < len - 1 - i; j++) {
            if (!isSorting) return; // Check if sorting is stopped
            if (array[j] > array[j + 1]) {
                // Swap elements
                await sleep(100); // Delay for visualization
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
                visualizeArray(array);
            }
        }
    }
}

async function selectionSort(array) {
    const len = array.length;
    for (let i = 0; i < len - 1; i++) {
        let minIndex = i;
        for (let j = i + 1; j < len; j++) {
            if (!isSorting) return;
            if (array[j] < array[minIndex]) {
                minIndex = j;
            }
        }
        [array[i], array[minIndex]] = [array[minIndex], array[i]];
        await sleep(100);
        visualizeArray(array);
    }
}

async function mergeSort(array) {
    async function merge(arr, left, mid, right) {
        let n1 = mid - left + 1;
        let n2 = right - mid;
        let L = new Array(n1);
        let R = new Array(n2);

        for (let i = 0; i < n1; i++) {
            L[i] = arr[left + i];
        }
        for (let j = 0; j < n2; j++) {
            R[j] = arr[mid + 1 + j];
        }

        let i = 0, j = 0, k = left;
        while (i < n1 && j < n2) {
            if (L[i] <= R[j]) {
                arr[k] = L[i];
                i++;
            } else {
                arr[k] = R[j];
                j++;
            }
            k++;
        }
        while (i < n1) {
            arr[k] = L[i];
            i++;
            k++;
        }
        while (j < n2) {
            arr[k] = R[j];
            j++;
            k++;
        }
    }

    async function mergeSortHelper(arr, left, right) {
        if (left >= right) return;
        let mid = Math.floor((left + right) / 2);
        await mergeSortHelper(arr, left, mid);
        await mergeSortHelper(arr, mid + 1, right);
        await merge(arr, left, mid, right);
        visualizeArray(array);
        await sleep(100);
    }

    await mergeSortHelper(array, 0, array.length - 1);
}

async function quickSort(array, low = 0, high = array.length - 1) {
    if (low < high) {
        let pi = await partition(array, low, high);
        await quickSort(array, low, pi - 1);
        await quickSort(array, pi + 1, high);
    }
}

async function partition(array, low, high) {
    let pivot = array[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
        if (!isSorting) return;
        if (array[j] <= pivot) {
            i++;
            [array[i], array[j]] = [array[j], array[i]];
            visualizeArray(array);
            await sleep(100);
        }
    }
    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    visualizeArray(array);
    await sleep(100);
    return i + 1;
}

async function insertionSort(array) 
{
    const len = array.length;
    for (let i = 1; i < len; i++) {
        let key = array[i];
        let j = i - 1;
        while (j >= 0 && array[j] > key) {
            if (!isSorting) return;
            array[j + 1] = array[j];
            j = j - 1;
            visualizeArray(array);
            await sleep(100);
        }
        array[j + 1] = key;
    }
}
async function heapify(array, n, i) 
{
    
    let largest = i; // Initialize largest as root
    let left = 2 * i + 1; // Left child
    let right = 2 * i + 2; // Right child

    // If left child is larger than root
    if (left < n && array[left] > array[largest]) {
        largest = left;
    }

    // If right child is larger than largest so far
    if (right < n && array[right] > array[largest]) {
        largest = right;
    }

    // If largest is not root
    if (largest !== i) {
        [array[i], array[largest]] = [array[largest], array[i]];

        // Recursively heapify the affected sub-tree
        await heapify(array, n, largest);
        visualizeArray(array);
        
        await sleep(100);
    }
}

async function heapSort(array) {
    const n = array.length;

    // Build heap (rearrange array)
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        await heapify(array, n, i);
    }

    // One by one extract an element from heap
    for (let i = n - 1; i > 0; i--) {
        if(!isSorting) return;
        // Move current root to end
        [array[0], array[i]] = [array[i], array[0]];

        // call max heapify on the reduced heap

        await heapify(array, i, 0);
    }
    visualizeArray(array);
}


// Utility function to introduce delay
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Start sorting when button is clicked
function startSorting() {
    isSorting = true;
    const selectedValue = document.getElementById('sortAlgorithm').value;
    selectedAlgorithm = selectedValue;
    eval(selectedValue + '(array.slice())'); // Pass a copy of array to prevent modification of original array
}

// Stop sorting when button is clicked
function stopSorting() {
    isSorting = false;
}

// Initial visualization
visualizeArray(array);