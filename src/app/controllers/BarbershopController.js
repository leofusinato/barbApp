const User = require('../models/User');
const Barbershop = require('../models/Barbershops');

module.exports = {
    async index(req, res) {
        try {
            const barbershops = await Barbershop.findAll();
            return res.json(barbershops);
        } catch (err) {
            return res.status(400).send({ message: "Erro ao buscar barbearias, tente novamente" })
        }
    },
    async indexFromId(req, res) {
        const { barbershop_id } = req.params;
        try {
            const barbershop = await Barbershop.findByPk(barbershop_id);    
            if(!barbershop) {
                return res.status(400).json({ message: 'Barbearia não encontrada'});
            }
            return res.json(barbershop);
        } catch (err) {
            return res.status(400).send({ message: "Erro ao buscar barbearia, tente novamente" })
        }
    },
    async indexFromUser(req, res) {
        const { user_id } = req.params;

        try {
            const user = await User.findByPk(user_id, {
                include: { association: 'barbershops' }
            });
            if(!user) {
                return res.status(400).json({ message: 'Usuário não encontrado'});
            }
            return res.json(user.barbershops);
        } catch (err) {
            return res.status(400).send({ message: "Erro ao buscar barbearias do barbeiro." })
        }
    },
    async store(req, res) {
        const { user_id } = req.params;
        const { name, phone, address } = req.body;

        try {
            const user = await User.findByPk(user_id);
    
            if(!user) {
                return res.status(400).json({ message: 'Usuário não encontrado'});
            }
            if(!user.is_barber) {
                return res.status(400).json({ message: 'Usuário não cadastrado como barbeiro'});
            }
    
            const barbershop = await Barbershop.create({ 
                name, phone, address, user_id
            });

            await barbershop.addUser(user);
    
            return res.json(barbershop);
        } catch (err) {
            return res.status(400).send({ message: 'Erro ao criar barbearia, tente novamente.' })
        }

    },
    async remove(req, res) {
        const { barbershop_id } = req.params;
        try {
            const barbershop = await Barbershop.findByPk(barbershop_id);
            if(!barbershop) {
                return res.status(400).json({ message: 'Barbearia não encontrada'});
            }

            await barbershop.destroy();

            return res.status(200).json({ message: "Barbearia removida" });
        } catch (err) {
            return res.status(400).send({ message: 'Erro ao remover barbearia, tente novamente.' })
        }
    },
    async update(req, res) {
        const { barbershop_id } = req.params; 
        const { name, phone, address } = req.body;
        try {
            const barbershop = await Barbershop.findByPk(barbershop_id);
            if(!barbershop) {
                return res.status(400).json({ message: 'Barbearia não encontrada'});
            }
            await Barbershop.update({name, phone, address}, {where: { id: barbershop_id}});

            return res.status(200).json(await Barbershop.findByPk(barbershop_id));
        } catch (err) {
            return res.status(400).send({ message: 'Erro ao atualizar barbearia, tente novamente.' })
        }
    }
}