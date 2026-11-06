import db from './db.js'

const getAll = async () => {
    return db.prepare('SELECT * FROM users').all()
}

const getUserByName = async (name) => {
    return db.prepare('SELECT * FROM users WHERE name LIKE ?').all(`%${name}%`)
}

const getById = async (id) => {
    return db.prepare('SELECT * FROM users WHERE id = ?').get(id)
}

const create = async (name) => {
    const insertion = db.prepare('INSERT INTO users (name) VALUES (?)').run(name)
    return await getById(insertion.lastInsertRowid)
}

const update = async (id, name) => {
    db.prepare('UPDATE users SET name = ? WHERE id = ?').run(name, id)
    return await getById(id)
}

const remove = async (id) => {
    const deletionUser = getById(id)
    db.prepare('DELETE FROM users WHERE id = ?').run(id)

    return await deletionUser
}

export {getAll, getUserByName, getById, create, update, remove}