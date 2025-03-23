import { TOrder } from "../../types";
import { IEvents } from "../base/events";
import { FormView } from "./FormView";


export class OrderView extends FormView<TOrder> {
    protected _onlineButton: HTMLButtonElement;
    protected _uponReceiptButton: HTMLButtonElement;
    protected _deliveryAddress: HTMLInputElement;
    
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events)
        this._onlineButton = container.querySelector('button[name="card"]');
        this._uponReceiptButton = container.querySelector('button[name="cash"]');
        this._deliveryAddress = container.querySelector('input[name="address"]');

        this._onlineButton.addEventListener('click', () => {
            events.emit('order:changed', {
                payment: this._onlineButton.name
            })
        });

        this._uponReceiptButton.addEventListener('click', () => {
            events.emit('order:changed', {
                payment: this._uponReceiptButton.name
            })
        });
    }

    set payment(value: string) {
        const buttons = [this._onlineButton, this._uponReceiptButton];
        buttons.forEach((item) => {
            this.toggleClass(item, 'button_alt-active', item.name === value)
        })
    };

    set deliveryAddress(value: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value
    }
}