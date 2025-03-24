import { IOrderData, IOrder, TFormErrors, TOrderForm } from "../../types";
import { IEvents } from "../base/events";

export class OrderModel implements IOrderData {
    protected _order: Partial<IOrder> = {
        payment: '',
        address: '',
        email: '',
        phone: ''
    }
    protected _formErrors: TFormErrors

    constructor(protected events: IEvents) {
        this.events = events
    }

    validatedOrder() {
        const errors: typeof this._formErrors = {};
        if(!this._order.payment) {
            errors.payment = "Выберите способ оплаты"
        }
        if(!this._order.address) {
            errors.address = "Укажите адрес доставки"
        }
        if(!this._order.email) {
            errors.email = "Укажите почту"
        }
        if(!this._order.phone) {
            errors.phone = "Укажите телефон"
        }

        this._formErrors = errors;
        this.events.emit('formErrors:changed', this._formErrors);
        return Object.keys(errors).length === 0;
    }

    setOrderField(field: keyof TOrderForm, value: string) {
        this._order[field] = value;
        this.validatedOrder()
    }

    createOrderToPost(items: string[], total: number):IOrder {
        return {
            items,
            total,
            payment: this._order.payment,
            address: this._order.address,
            email: this._order.email,
            phone: this._order.phone
        }
    }

    get order(): Partial<IOrder> {
        return this._order
    }

    clearOrder() {
        this._order = {
            payment: '',
            address: '',
            email: '',
            phone: ''
        }
    }
}