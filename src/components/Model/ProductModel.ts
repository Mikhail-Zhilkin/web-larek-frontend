import { IProductData, IProduct } from "../../types";
import { IEvents } from "../base/events";

export class ProductModel implements IProductData {
    protected _products: IProduct[];
    protected _preview: string | null;
    protected events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
    }

    setProducts(products: IProduct[]) {
        this._products = products;
        this.events.emit('products:changed')
    }

    getProduct(productId: string) {
        return this._products.find((item) => item.id === productId)
    }

    setPreview(product: IProduct) { 
        this._preview = product.id
        this.events.emit('preview:changed', product)

    }

    get products() {
        return this._products
    }

    get preview() {
        return this._preview
    }
}