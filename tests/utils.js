import { beforeEach } from "vitest"
import db, {seedUsers} from '../src/data/db.js'

const cleanupRules = {
    'users': () => {
        db.exec("DELETE FROM users")
        db.exec("DELETE FROM sqlite_sequence WHERE name = 'users'")
        seedUsers()
    },
    'auth': () =>{
        db.exec("DELETE FROM accounts")
        db.exec("DELETE FROM sqlite_sequence WHERE name = 'accounts'")
    }
}

export const clearDb = (tables) => {
    beforeEach(() => {
        tables.forEach((table) => {
            cleanupRules[table]()
        })
    })
}