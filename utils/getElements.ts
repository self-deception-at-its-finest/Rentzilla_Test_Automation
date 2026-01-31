export function getRandomStringElement(array: string[]) {
    return array[Math.floor(Math.random() * array.length)];
}