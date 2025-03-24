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

        if(this._onlineButton) {
            this._onlineButton.addEventListener('click', () => {
                this._onlineButton.classList.add('button_alt-active');
                this._uponReceiptButton.classList.remove('button_alt-active');
                this.onInputChange('payment', 'card');
            })
        }

        if(this._uponReceiptButton) {
            this._uponReceiptButton.addEventListener('click', () => {
                this._uponReceiptButton.classList.add('button_alt-active');
                this._onlineButton.classList.remove('button_alt-active');
                this.onInputChange('payment', 'cash');
            })
        }
    }

    set address(value: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value
    }

    resetPayment() {
        this._uponReceiptButton.classList.remove('button_alt-active');
        this._onlineButton.classList.remove('button_alt-active');
    }
}