export enum Category {
	SOUND,
	LIGHT,
	TRUSS,
	MEDIA
}

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