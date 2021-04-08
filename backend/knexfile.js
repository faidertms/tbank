module.exports = {
    client: 'pg',
    connection: {
        host: process.env.DB_HOST ?? "127.0.0.1",
        port: Number(process.env.DB_PORT),
        user: process.env.DB_USERNAME ?? "dev",
        password: process.env.DB_PASSWORD ?? "secrt",
        database: process.env.DB_DATABASE ?? "db"

    },
    migrations: {
        directory: process.env.NODE_ENV == 'production' ? './build/database/migrations' : './src/database/migrations',
    },
    seeds: {
        directory: process.env.NODE_ENV == 'production' ? './build/database/seeds' : './src/database/seeds',
    }
};
