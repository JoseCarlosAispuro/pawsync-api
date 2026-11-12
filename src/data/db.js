import { fileURLToPath } from 'node:url'
import Database from 'better-sqlite3';

const dbUrl = process.env.NODE_ENV === 'test'? ':memory:' : fileURLToPath(new URL('./app.db', import.meta.url))

const db = new Database(dbUrl);

db.exec("CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL)")
db.exec("CREATE TABLE IF NOT EXISTS accounts(id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL)")

export const seedUsers = () =>{
    if(db.prepare('SELECT COUNT(*) AS count FROM users').get().count === 0) {
        const initialUsers = ['Jaime', 'Alberto', 'Juana']

        initialUsers.forEach((name) => {
            db.prepare('INSERT INTO users (name) VALUES (?)').run(name)
        })
    }
}

seedUsers()

export default db