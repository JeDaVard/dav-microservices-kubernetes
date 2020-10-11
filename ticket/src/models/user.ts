import mongoose from 'mongoose'
import { Password } from '../service/password'

// Interface that describes input properties to create a new User
interface UserAttrs {
    email: string
    password: string
}

// Interface that describes the properties that a User model, including static methods
interface UserModel extends mongoose.Model<UserDocument> {
    build(attrs: UserAttrs): UserDocument
}

// Interface that describes properties that a user document has
interface UserDocument extends mongoose.Document {
    email: string
    password: string
    createdAt: string
    updatedAt: string
}

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform(_, ret) {
                ret.id = ret._id
                delete ret._id
                delete ret.password
                delete ret.__v
            },
        },
    },
)

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const hashed = await Password.toHash(this.get('password'))
        this.set('password', hashed)
    }
    next()
})

userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs)
}

const User = mongoose.model<UserDocument, UserModel>('User', userSchema)

export { User }
