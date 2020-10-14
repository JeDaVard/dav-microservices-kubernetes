import mongoose from 'mongoose'

interface OrderAttrs {
    userId: string
    status: string
    expiresAt: Date
    ticket: TicketDoc
}

interface OrderDoc extends mongoose.Document {
    status: string
    userId: string
    expiresAt: Date
    ticket: TicketDoc
}
interface OrderModel extends mongoose.Model<OrderDoc> {
    build(attrs: OrderAttrs): OrderDoc
}

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Types.ObjectId,
            required: true,
        },
        status: {
            type: String,
            enum: ['created', 'pending', 'canceled', 'fulfilled'],
        },
        expiresAt: {
            type: mongoose.Schema.Types.Date,
        },
        ticket: {
            type: mongoose.Types.ObjectId,
            ref: 'Ticket',
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

orderSchema.statics.build = function (attrs: OrderAttrs) {
    return new Order(attrs)
}

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema)

export { Order }
