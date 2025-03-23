import { IOrderData, IOrder, TFormErrors, TOrderForm } from "../../types";
import { IEvents } from "../base/events";

export class OrderModel implements IOrderData {
    protected _order: IOrder = {
        items: [],
        payment: '',
        address: '',
        email: '',
        phone: '',
        total: 0
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

    get order(): IOrder {
        return this._order
    }
    
    clearOrder() {
        this._order = {
            items: [],
            payment: '',
            address: '',
            email: '',
            phone: '',
            total: 0
        }
    }
}