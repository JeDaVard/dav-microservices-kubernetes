// interface env {
//     [key: string]: string | any
// }

const env = {
    NATS_URL: process.env.NATS_URL,
    NATS_CLIENT_ID: process.env.NATS_CLIENT_ID,
    NATS_CLUSTER_ID: process.env.NATS_CLUSTER_ID,
}

for (let envVar in env) {
    const key = envVar as keyof typeof env
    if (!env[key]) throw new Error(`${key} variable must be defined!`)
}

export { env }
