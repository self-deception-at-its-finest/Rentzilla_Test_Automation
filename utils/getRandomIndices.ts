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

    const first = Math.floor(Math.random() * (half + 1));

    const rightCount = length - (half + 1);
    const second = half + 1 + Math.floor(Math.random() * rightCount);

    return { first, second };
}
