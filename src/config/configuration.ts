export function configuration() {
  return {
    port: process.env.PORT || 3000,
    domain: process.env.DOMAIN || 'localhost',
    discord: {
      token: process.env.DISCORD_TOKEN ?? 'discord_token',
      clientId: process.env.DISCORD_CLIENT_ID ?? 'discord_client_id',
      clientSecret: process.env.DISCORD_CLIENT_SECRET ?? 'discord_client_secret',
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
