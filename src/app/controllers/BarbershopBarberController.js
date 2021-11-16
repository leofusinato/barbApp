const User = require('../models/User');
const Barbershop = require('../models/Barbershops');

module.exports = {
    async index(req, res) { 
        const { barbershop_id } = req.params;

        try {
            const barbershop = await Barbershop.findByPk(barbershop_id);
            if(!barbershop) {
                return res.status(404).json({ error: 'Barbershop not found' });
            }

            const users = await barbershop.getUsers();
            return res.json(users);
            
        } catch (err) {
            return res.status(400).json({error: 'Error on creating barber, try again'});
        }
    },
    async store(req, res) {
        const { barbershop_id, user_id } = req.params;

        try {
            const barbershop = await Barbershop.findByPk(barbershop_id);
            if(!barbershop) {
                return res.status(404).json({ error: 'Barbershop not found' });
            }
            const user = await User.findByPk(user_id);
            if(!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            const users = await barbershop.getUsers();
            console.log(users);
            if(users.length > 0) {
                users.forEach((user) =>{
                    if(user.id == user_id) {
                        return res.status(400).json({error: 'User is already a barber'});
                    }
                })
            }
            
            await barbershop.addUser(user);

            return res.json(barbershop);
        } catch (err) {
            return res.status(400).json({error: 'Error on creating barber, try again'});
        }
    }
}