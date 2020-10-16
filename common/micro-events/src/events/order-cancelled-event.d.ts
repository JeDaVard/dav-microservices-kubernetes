import { Subjects } from './subjects';
import { OrderStatus } from './types/order-status';
export interface OrderCanceledEvent {
    subject: Subjects.OrderCanceled;
    data: {
        id: string;
        status: OrderStatus.Created;
        userId: string;
        expiresAt: string;
        ticket: {
            id: string;
            price: number;
        };
    };
}
