declare global {
	interface String {
		/**
		 * Capitalize the first letter in the string
		 *
		 * **Usage:**
		 *
		 * ```js
		 * "hello world".capitalize(); // "Hello world"
		 * ```
		 */
		capitalize(): string;
	}
}

String.prototype.capitalize = function (): string {
	if (Array.from(this).length === 0) return "";
	const [first, ...rest] = Array.from(this);
	return first.toUpperCase() + rest.join("");
};

export {}; // make the file as a module
