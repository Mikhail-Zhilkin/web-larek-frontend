import { IOrder, IOrderResult, IProduct } from '../types';
import { Api, ApiListResponse } from './base/api';


export class WebLarekAPI extends Api {

    constructor(baseUrl: string) {
        super(baseUrl)
    }

    getProducts(): Promise<IProduct[]> {
        return this.get(`/product`).then((products: ApiListResponse<IProduct>) => products.items.map((item) => item))
    }

    orderProducts(order: IOrder): Promise<IOrderResult> {
        return this.post('/order', order).then((data: IOrderResult) => data)
    }
}   