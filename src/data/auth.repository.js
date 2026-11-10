import db from './db.js'

const getAccountByUsername = (name) => {
    return db.prepare('SELECT * FROM accounts WHERE username = ?').get(name)
}

const getAccountById = (id) => {
    return db.prepare('SELECT * FROM accounts WHERE id = ?').get(id)
}

const register = async (username, password) => {
    return db.prepare('INSERT INTO accounts (username, password_hash) VALUES ($username, $password)').run({
        username,
        password
    })
}

export{getAccountByUsername, getAccountById, register}