import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import {app} from '../app.js';
import jwt from 'jsonwebtoken';
import { clearDb } from "./utils.js";

const token = jwt.sign({id: 1}, process.env.JWT_SECRET, { expiresIn: '5m' })

clearDb(['users'])

describe('GET /users', () => {
    it('responde 200 y una lista', async () => {
        const res = await request(app).get('/users')
        expect(res.status).toBe(200)
        expect(Array.isArray(res.body)).toBe(true)
        expect(res.body).toHaveLength(3)
    })
})

describe('GET /users/:id', () => {
    it('responde 200 y el usuario', async () => {
        const res = await request(app).get('/users/1')
        expect(res.status).toBe(200)
        expect(res.body).toEqual({id: 1, name: 'Jaime'})

    })

    it('responde 400 y un mensaje de error', async () => {
        const res = await request(app).get('/users/abc')
        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('error')
    })
})


describe('Request without authentication', () => {
    it.each([['post', '/users'], ['put', '/users/1'], ['delete', '/users/1']])('%s %s sin token responde 401', async (method, path)=> {
        const res = await request(app)[method](path)
        expect(res.status).toBe(401)
        expect(res.body).toEqual({error: 'Authorization header missing'})
    })
})

describe('POST /users', () => {
    it('responde 201 y un usuario', async() => {
        const res = await request(app).post('/users').set('Authorization', `Bearer ${token}`).send({name: '    Pedro    '})
        expect(res.status).toBe(201)
        expect(res.body.name).toBe('Pedro')
        expect(res.header.location).toBe(`/users/${res.body.id}`)

    })
})

describe('PUT /users/:id', () => {
    it('responde 200 y el usuario actualizado', async () => {
        const res = await request(app).put('/users/1').set('Authorization', `Bearer ${token}`).send({name: 'Nuevo'})
        expect(res.status).toBe(200)
        expect(res.body).toEqual({id: 1, name: 'Nuevo'})
    })

    it('responde 404 y mensaje no se encontro usuario', async () => {
        const res = await request(app).put('/users/999').set('Authorization', `Bearer ${token}`).send({name: 'Nuevo'})
        expect(res.status).toBe(404)
        expect(res.body).toEqual({error: 'User not found'})
    })

    it('responde 400 y mensaje de error', async () => {
        const res = await request(app).put('/users/1').set('Authorization', `Bearer ${token}`).send({name: ''})
        expect(res.status).toBe(400)
    })

    it('actualiza y muestra usuario actualizado', async () => {
        const updateRes = await request(app).put('/users/1').set('Authorization', `Bearer ${token}`).send({name: 'Nuevo'})

        expect(updateRes.status).toBe(200)

        const getRes = await request(app).get('/users/1')

        expect(getRes.status).toBe(200)
        expect(getRes.body).toEqual({id: 1, name: 'Nuevo'})
    })
})

describe('DELETE /users/:id', () => {
    it('responde 404', async () => {
        const res = await request(app).delete('/users/999').set('Authorization', `Bearer ${token}`)
        expect(res.status).toBe(404)
    })

    it('responde 204', async () => {
        const res = await request(app).delete('/users/1').set('Authorization', `Bearer ${token}`)
        expect(res.status).toBe(204)
    })

    it('borra un usuario y luego ya no existe ', async () => {
        const deleteRes = await request(app).delete('/users/1').set('Authorization', `Bearer ${token}`)
        expect(deleteRes.status).toBe(204)

        const getRes = await request(app).get('/users/1')
        expect(getRes.status).toBe(404)
    })
})