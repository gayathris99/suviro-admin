import { neon } from '@neondatabase/serverless'
import bcrypt from 'bcryptjs'
import readline from 'node:readline'
import { config } from 'dotenv'

config({ path: '.env.local' })

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL not found in .env.local')
  process.exit(1)
}

const sql = neon(process.env.DATABASE_URL)
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const ask = (q) => new Promise((res) => rl.question(q, res))

async function main() {
  console.log('\n-- Seed Suviro Admin User --\n')
  const email = (await ask('Admin email: ')).trim().toLowerCase()
  const password = (await ask('Admin password: ')).trim()

  if (!email || !password) {
    console.error('\nEmail and password are required.')
    rl.close(); process.exit(1)
  }
  if (password.length < 8) {
    console.error('\nPassword must be at least 8 characters.')
    rl.close(); process.exit(1)
  }

  const existing = await sql`SELECT id FROM admin_user WHERE email = ${email}`
  if (existing.length > 0) {
    console.error(`\nAn admin with email ${email} already exists.`)
    rl.close(); process.exit(1)
  }

  const hash = await bcrypt.hash(password, 12)
  await sql`INSERT INTO admin_user (email, password_hash) VALUES (${email}, ${hash})`

  console.log(`\nAdmin user created: ${email}\n`)
  rl.close(); process.exit(0)
}

main().catch((err) => {
  console.error('\nFailed:', err.message)
  rl.close(); process.exit(1)
})
