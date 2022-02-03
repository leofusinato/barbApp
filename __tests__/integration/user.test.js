const request = require('supertest');

const app = require('../../src/index')

describe('User register', () => {

    it('should validate users with the same email', async () => {

        const response = await request(app)
        .post('/users')
        .send({ 
            name: "Léo 23",
            email: "leo2345@gmail.com",
            password: "12345678",
            is_barber: true
        });
        
        expect(response.status).toBe(200);

        const response2 = await request(app)
        .post('/users')
        .send({ 
            name: "Léo 23",
            email: "leo2345@gmail.com",
            password: "12345678",
            is_barber: true
        });

        expect(response2.status).toBe(403);

    })

    it('should register users with different emails', async () => {

        const response = await request(app)
        .post('/users')
        .send({ 
            name: "Teste",
            email: "teste@gmail.com",
            password: "12345678",
            is_barber: true
        });
        
        expect(response.status).toBe(200);

        const response2 = await request(app)
        .post('/users')
        .send({ 
            name: "Teste2",
            email: "teste2@gmail.com",
            password: "12345678",
            is_barber: true
        });

        expect(response2.status).toBe(200);

    })

    it('should validate invalid emails', async () => {
        const response = await request(app)
        .post('/users')
        .send({ 
            name: "Teste",
            email: "testegmail.com",
            password: "12345678",
            is_barber: true
        });
        
        expect(response.status).toBe(400);
    })

    it('should validate passwords with less than 8 caracters', async () => {
        const response = await request(app)
        .post('/users')
        .send({ 
            name: "Teste",
            email: "teste@gmail.com",
            password: "123",
            is_barber: true
        });
        
        expect(response.status).toBe(403);
    })

    it('should validate passwords with 8 caracters or more', async () => {
        const response = await request(app)
        .post('/users')
        .send({ 
            name: "Teste",
            email: "teste123@gmail.com",
            password: "12345678",
            is_barber: true
        });
        
        expect(response.status).toBe(200);
    })
})