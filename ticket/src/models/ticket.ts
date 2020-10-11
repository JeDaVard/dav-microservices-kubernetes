import mongoose from 'mongoose'

interface TicketAttr {
    title: string
    price: number
    userId: string
}

interface TicketDoc extends mongoose.Document {
    title: string
    price: number
    userId: string
    createdAt: string
    updatedAt: string
}

interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttr): TicketDoc
}

const ticketSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            minlength: 0.1,
            required: true,
        },
        userId: {
            type: mongoose.Types.ObjectId,
            required: true,
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

ticketSchema.statics.build = (attrs: TicketAttr) => {
    return new Ticket(attrs)
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema)

export default Ticket
