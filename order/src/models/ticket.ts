import mongoose from 'mongoose'
import { Order } from './order'
import { OrderStatus } from '@kuber-ticket/micro-events/build'

interface TicketAttrs {
    title: string
    price: number
    id: string
}

export interface TicketDoc extends mongoose.Document {
    title: string
    price: number
    isReserved(): Promise<boolean>
}

interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc
}

const ticketSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id
                delete ret._id
            },
        },
    },
)

ticketSchema.statics.build = function (attrs: TicketAttrs) {
    return new Ticket({
        _id: attrs.id,
        title: attrs.price,
        price: attrs.price,
    })
}

ticketSchema.methods.isReserved = async function () {
    const reservedOrder = await Order.findOne({
        ticket: this,
        status: { $in: [OrderStatus.Created, OrderStatus.Pending, OrderStatus.Fulfilled] },
    })
    return !!reservedOrder
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema)

export { Ticket }
