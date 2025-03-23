import { IBasketData, TBasketItem, IOrderData } from "../../types";
import { IEvents } from "../base/events";

export class BasketModel implements IBasketData {
    protected _products: TBasketItem[] = [];
    protected events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
    }

    get products():TBasketItem[] {
        return this._products;
    }

    addProduct(product: TBasketItem): void {
        const productInBasket = this.products.some((item) => item.id === product.id);
        if(productInBasket) {
            this.deleteProduct(product)
        } else this._products.push(product);
        this.events.emit('basket:changed');
    }

    deleteProduct(product: TBasketItem): void {
        this._products = this._products.filter((item) => item.id !== product.id);
        this.events.emit('basket:changed');
    }

    clearBusket(): void {
        this._products = [];
        this.events.emit('basket:changed');
    }

    getBusketItems(): number {
        return this._products.length
    }

    toggleButtonStatus(product: TBasketItem) {
        const isPriceInvalid = product.price === null;
      
        if (isPriceInvalid) {
          return 'Нельзя купить';
        }
      
        const isProductInBasket = this._products.some((item) => item.id === product.id);
        return isProductInBasket ? 'Убрать' : 'Купить';
      }

    makeAnOrder(order: IOrderData) {
        order.setOrderField('items', this._products.map((item) => item.id));
        order.setOrderField('total', this.getTotalPrice());
    }

    getTotalPrice(): number {
        let totalPrice = 0;
        this._products.map((item) => totalPrice += item.price);
        return totalPrice;
    }
      

}