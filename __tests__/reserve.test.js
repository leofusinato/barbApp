const request = require('supertest');

const app = require('../src/index')

describe('Reserve register', () => {
    
    it('should not permit register reserves with date less than now', async () => {

        const response2 = await request(app)
        .post('/users')
        .send({ 
            name: "Teste",
            email: "reserve@gmail.com",
            password: "12345678",
            is_barber: false
        });
        
        expect(response2.status).toBe(200);
        const token = response2.body.token;

        // const response2 = await request(app)
        // .post('/users')
        // .send({ 
        //     name: "Teste barber",
        //     email: "leo2345@gmail.com",
        //     password: "12345678",
        //     is_barber: true
        // });

        // expect(response2.status).toBe(200);
        
        // const response3 = await request(app)
        // .post('/users/2/barbershop')
        // .send({ 
        //     name: "Teste barber",
        //     email: "leo2345@gmail.com",
        //     password: "12345678",
        //     is_barber: true
        // });

        // expect(response3.status).toBe(200);

        const date = new Date();
        date.setDate(date.getDate() - 1);
        
        const response = await request(app)
        .post('/reserve')
        .set('Authorization', `Bearer ${token}`)
        .send({ 
            barbershop_id: 1,
            user_id: 1,
            barber_id: 2,
            schedule: date,
            situation: 1
        })

        expect(response.status).toBe(400);
    })

})