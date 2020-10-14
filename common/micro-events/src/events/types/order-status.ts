export enum OrderStatus {
    // When order a normal (not reserved) ticket
    Created = 'created',

    // When order a reserved ticket, or user canceled, or payment time is expired
    Canceled = 'canceled',

    // Successfully reserved, waiting for payment
    Pending = 'pending',

    // All done
    Fulfilled = 'fulfilled',
}
