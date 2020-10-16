import { Types } from 'mongoose'
import Ticket from '../ticket'

it('implements optimistic concurrency control', async (done) => {
    const ticket = Ticket.build({
        title: 'some title',
        price: 1,
        userId: new Types.ObjectId().toHexString(),
    })
    await ticket.save()

    const firstInstance = await Ticket.findById(ticket.id)
    const secondInstance = await Ticket.findById(ticket.id)

    firstInstance!.set({ price: 2 })
    secondInstance!.set({ price: 3 })

    await firstInstance!.save()

    // Old implementation
    try {
        await secondInstance!.save()
    } catch (e) {
        return done()
    }
    throw new Error('Should not reach this point')

    // New implementation which works but has a weired behavior
    // expect(async () => {
    //     await secondInstance!.save()
    // }).toThrow()
})

it('Increments version number', async () => {
    const ticket = Ticket.build({
        title: 'some title',
        price: 1,
        userId: new Types.ObjectId().toHexString(),
    })
    await ticket.save()
    expect(ticket.version).toEqual(0)
    await ticket.save()
    expect(ticket.version).toEqual(1)
    await ticket.save()
    expect(ticket.version).toEqual(2)
})
