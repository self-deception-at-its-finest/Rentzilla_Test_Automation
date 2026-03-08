function randomNumber(finish: number, start: number = 0): number {
    return start + Math.floor(Math.random() * finish);
}

export function getTwoRandomIndices(length: number): {
    first: number;
    second: number | null;
} {
    if (length <= 0) {
        throw new Error("Array length must be positive");
    }

    if (length === 1) {
        return { first: 0, second: null };
    }

    const half = Math.floor(length / 2);

    const first = randomNumber(half + 1);

    const rightCount = length - (half + 1);
    const second = randomNumber(rightCount, half + 1);

    return { first, second };
}

export function getRandomManufacturerId(): number {
    return randomNumber(10, 1);
}

export function getRandomPrice(): number {
    return randomNumber(10000, 1000);
}
