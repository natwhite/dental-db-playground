// https://stackoverflow.com/a/48764436 Solution#2 is used for performance
export class Decimal {
	// Decimal round (half away from zero)
	public static round(num: number, decimalPlaces: number): number {
		const p = Math.pow(10, decimalPlaces || 0);
		const n = (num * p) * (1 + Number.EPSILON);
		return Math.round(n) / p;
	} // Decimal ceil
	public static ceil(num: number, decimalPlaces: number): number {
		const p = Math.pow(10, decimalPlaces || 0);
		const n = (num * p) * (1 - Math.sign(num) * Number.EPSILON);
		return Math.ceil(n) / p;
	} // Decimal floor
	public static floor(num: number, decimalPlaces: number): number {
		const p = Math.pow(10, decimalPlaces || 0);
		const n = (num * p) * (1 + Math.sign(num) * Number.EPSILON);
		return Math.floor(n) / p;
	} // Decimal trunc
	public static trunc(num: number, decimalPlaces: number): number {
		return (num < 0 ? this.ceil : this.floor)(num, decimalPlaces);
	} // Format using fixed-point notation
	public static toFixed(num: number, decimalPlaces: number) {
		return this.round(num, decimalPlaces).toFixed(decimalPlaces);
	}
};