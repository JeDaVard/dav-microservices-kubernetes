export enum OrderStatus {
    // When order a normal (not reserved) ticket
    Created = 'created',

    // When order a reserved ticket, or user cancelled, or payment time is expired
    Cancelled = 'cancelled',

    // Successfully reserved, waiting for payment
    Pending = 'pending',

    // All done
    Fulfilled = 'fulfilled',
}
