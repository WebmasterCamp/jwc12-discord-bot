export function configuration() {
  return {
    port: process.env.PORT || 3000,
    discord: {
      token: process.env.DISCORD_TOKEN ?? 'discord_token',
    },
    database: {
      name: process.env.DATABASE_NAME ?? 'discord',
      host: process.env.DATABASE_HOST ?? 'localhost',
      port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
      username: process.env.DATABASE_USERNAME ?? 'postgres',
      password: process.env.DATABASE_PASSWORD ?? 'postgres',
    },
  }
}