const request = require('supertest');
const User = require('../src/app/models/User');

const app = require('../src/index')

describe('Reserve register', () => {
    
    it('should not permit register reserves with date less than now', async () => {

        const response = await request(app)
        .post('/users')
        .send({ 
            name: "Teste",
            email: "reserve@gmail.com",
            password: "12345678",
            is_barber: false
        });
        
        expect(response.status).toBe(200);
        const token = response.body.token;

        const date = new Date();
        date.setDate(date.getDate() - 1);
        
        const response2 = await request(app)
        .post('/reserve')
        .set('Authorization', `Bearer ${token}`)
        .send({ 
            barbershop_id: 1,
            user_id: 1,
            barber_id: 2,
            schedule: date,
            situation: 1
        })

        expect(response2.status).toBe(400);
    })

    it('should register reserves with date more or equal than now', async () => {

        const response = await request(app)
        .post('/users')
        .send({ 
            name: "Teste2",
            email: "reserve2@gmail.com",
            password: "12345678",
            is_barber: false
        });
        
        expect(response.status).toBe(200);
        const { token, id } = response.body;

        const response2 = await request(app)
        .post('/users')
        .send({ 
            name: "Teste barber",
            email: "testebarber@gmail.com",
            password: "12345678",
            is_barber: true
        });

        expect(response2.status).toBe(200);
        const barberId = response2.body.id;
        
        const response3 = await request(app)
        .post(`/users/${barberId}/barbershop`)
        .set('Authorization', `Bearer ${token}`)
        .send({ 
            name: "Barbearia do Teste",
            phone: "(47) 991601884",
            address: "Rua Tal, 123, Ibirama - SC"
        });

        expect(response3.status).toBe(200);
        const barbershopId = response3.body.id;

        const date = new Date(new Date().getFullYear() + 1, 11, 20);
        
        const response4 = await request(app)
        .post('/reserve')
        .set('Authorization', `Bearer ${token}`)
        .send({ 
            barbershop_id:barbershopId,
            user_id: id,
            barber_id: barberId,
            schedule: date,
            situation: 1
        })

        expect(response4.status).toBe(200);
    })

    it('should return last reserve from a user', async () => {
        const response = await request(app)
        .post('/users')
        .send({ 
            name: "Teste3",
            email: "reserve3@gmail.com",
            password: "12345678",
            is_barber: false
        });
        
        expect(response.status).toBe(200);
        const { token, id } = response.body;

        const response2 = await request(app)
        .post('/users')
        .send({ 
            name: "Teste barber",
            email: "testebarber123@gmail.com",
            password: "12345678",
            is_barber: true
        });

        expect(response2.status).toBe(200);
        const barberId = response2.body.id;
        
        const response3 = await request(app)
        .post(`/users/${barberId}/barbershop`)
        .set('Authorization', `Bearer ${token}`)
        .send({ 
            name: "Barbearia do Teste 2",
            phone: "(47) 991601884",
            address: "Rua Tal, 123, Ibirama - SC"
        });

        expect(response3.status).toBe(200);
        const barbershopId = response3.body.id;

        const date = new Date(new Date().getFullYear() + 1, 11, 20);
        
        const response4 = await request(app)
        .post('/reserve')
        .set('Authorization', `Bearer ${token}`)
        .send({ 
            barbershop_id:barbershopId,
            user_id: id,
            barber_id: barberId,
            schedule: date,
            situation: 1
        })

        expect(response4.status).toBe(200);
        const reserveId = response4.body.id;

        const lastReserve = await request(app)
        .get(`/reserve/user/${id}/last`)
        .set('Authorization', `Bearer ${token}`);
        
        expect(lastReserve.status).toBe(200);

        expect(lastReserve.body.id).toBe(reserveId);

    })

    it('should confirm reserves', async () => {
        const response = await request(app)
        .post('/users')
        .send({ 
            name: "Teste4",
            email: "reserve4@gmail.com",
            password: "12345678",
            is_barber: false
        });
        
        expect(response.status).toBe(200);
        const { token, id } = response.body;

        const response2 = await request(app)
        .post('/users')
        .send({ 
            name: "Teste barber 2",
            email: "testebarber124@gmail.com",
            password: "12345678",
            is_barber: true
        });

        expect(response2.status).toBe(200);
        const barberId = response2.body.id;
        
        const response3 = await request(app)
        .post(`/users/${barberId}/barbershop`)
        .set('Authorization', `Bearer ${token}`)
        .send({ 
            name: "Barbearia do Teste 3",
            phone: "(47) 991601884",
            address: "Rua Tal, 123, Ibirama - SC"
        });

        expect(response3.status).toBe(200);
        const barbershopId = response3.body.id;

        const date = new Date(new Date().getFullYear() + 1, 11, 20);
        
        const response4 = await request(app)
        .post('/reserve')
        .set('Authorization', `Bearer ${token}`)
        .send({ 
            barbershop_id:barbershopId,
            user_id: id,
            barber_id: barberId,
            schedule: date,
            situation: 1
        })

        expect(response4.status).toBe(200);
        const reserveId = response4.body.id;

        const confirmResponse = await request(app)
        .put(`/reserve/${reserveId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ 
            barbershop_id: barbershopId,
            user_id: id,
            barber_id: barberId,
            schedule: "2021-11-18T15:00:00.000Z",
            situation: 2
        });

        expect(confirmResponse.status).toBe(200);


    })

    it('should cancel reserves', async () => {
        const response = await request(app)
        .post('/users')
        .send({ 
            name: "Teste5",
            email: "reserve5@gmail.com",
            password: "12345678",
            is_barber: false
        });
        
        expect(response.status).toBe(200);
        const { token, id } = response.body;

        const response2 = await request(app)
        .post('/users')
        .send({ 
            name: "Teste barber 3",
            email: "testebarber125@gmail.com",
            password: "12345678",
            is_barber: true
        });

        expect(response2.status).toBe(200);
        const barberId = response2.body.id;
        
        const response3 = await request(app)
        .post(`/users/${barberId}/barbershop`)
        .set('Authorization', `Bearer ${token}`)
        .send({ 
            name: "Barbearia do Teste 4",
            phone: "(47) 991601884",
            address: "Rua Tal, 123, Ibirama - SC"
        });

        expect(response3.status).toBe(200);
        const barbershopId = response3.body.id;

        const date = new Date(new Date().getFullYear() + 1, 11, 20);
        
        const response4 = await request(app)
        .post('/reserve')
        .set('Authorization', `Bearer ${token}`)
        .send({ 
            barbershop_id:barbershopId,
            user_id: id,
            barber_id: barberId,
            schedule: date,
            situation: 1
        })

        expect(response4.status).toBe(200);
        const reserveId = response4.body.id;

        const confirmResponse = await request(app)
        .put(`/reserve/${reserveId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ 
            barbershop_id: barbershopId,
            user_id: id,
            barber_id: barberId,
            schedule: "2021-11-18T15:00:00.000Z",
            situation: 3
        });

        expect(confirmResponse.status).toBe(200);


    })

})