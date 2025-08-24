export enum Category {
	"SOUND",
	"LIGHT",
	"TRUSS",
	"MEDIA"
}
export const CategoryValues = Object.keys(Category).filter((v) => isNaN(Number(v)))

export class Product {
	constructor(
		public id: string,
		public name: string,
		public price: number,
		public description: string,
		public categories: Category[],
		public imageUrl: string
	) {}

}