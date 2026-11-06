import { fileURLToPath } from 'node:url'
import Database from 'better-sqlite3';

const dbUrl = fileURLToPath(new URL('./app.db', import.meta.url))
const db = new Database(dbUrl);

db.exec("CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL)")

if(db.prepare('SELECT COUNT(*) AS count FROM users').get().count === 0) {
    const initialUsers = ['Jaime', 'Alberto', 'Juana']

    initialUsers.forEach((name) => {
        db.prepare('INSERT INTO users (name) VALUES (?)').run(name)
    })
}

export default db