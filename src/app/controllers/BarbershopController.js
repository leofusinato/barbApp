const User = require('../models/User');
const Barbershop = require('../models/Barbershops');

module.exports = {
    async index(req, res) {
        try {
            const barbershops = await Barbershop.findAll();
            return res.json(barbershops);
        } catch (err) {
            return res.status(400).send({ error: "Error on get barbershops, try again." })
        }
    },
    async indexFromUser(req, res) {
        const { user_id } = req.params;

        try {
            const user = await User.findByPk(user_id, {
                include: { association: 'barbershops' }
            });
            if(!user) {
                return res.status(400).json({ error: 'User not found'});
            }
            return res.json(user.barbershops);
        } catch (err) {
            return res.status(400).send({ error: "Error on get user's barbershops, try again." })
        }
    },
    async store(req, res) {
        const { user_id } = req.params;
        const { name, phone, address } = req.body;

        try {
            const user = await User.findByPk(user_id);
    
            if(!user) {
                return res.status(400).json({ error: 'User not found'});
            }
    
            const barbershop = await Barbershop.create({ 
                name, phone, address, user_id
            });
    
            return res.json(barbershop);
        } catch (err) {
            return res.status(400).send({ error: 'Error on create barbershop, try again.' })
        }

    },
    async remove(req, res) {
        const { barbershop_id } = req.params;
        try {
            const barbershop = await Barbershop.findByPk(barbershop_id);
            if(!barbershop) {
                return res.status(400).json({ error: 'Barbershop not found'});
            }

            await barbershop.destroy();

            return res.status(200).json({ message: "Barbershop deleted" });
        } catch (err) {
            return res.status(400).send({ error: 'Error on delete barbershop, try again.' })
        }
    }
}