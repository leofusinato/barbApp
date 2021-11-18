const User = require('../models/User');
const Barbershop = require('../models/Barbershops');

module.exports = {
    async index(req, res) { 
        const { barbershop_id } = req.params;

        try {
            const barbershop = await Barbershop.findByPk(barbershop_id);
            if(!barbershop) {
                return res.status(404).json({ message: 'Barbearia não encontrada' });
            }

            const users = await barbershop.getUsers();
            return res.json(users);
            
        } catch (err) {
            return res.status(400).json({message: 'Erro ao buscar barbeiros, tente novamente'});
        }
    },
    async indexFromUser(req, res) {
        const { barbershop_id, user_id } = req.params;

        try {
            const barbershop = await Barbershop.findByPk(barbershop_id);
            if(!barbershop) {
                return res.status(404).json({ message: 'Barbearia não encontrada' });
            }

            const user = await User.findByPk(user_id);
            if(!user) {
                return res.status(404).json({ message: 'Usuário não encontrado' });
            }
            const barbers = await barbershop.getUsers();
            if(barbers.length > 0) {
                barbers.map((barber) => {
                    if(barber.id == user_id) {
                        return res.json(barber);
                    }
                })
            } else {
                return res.status(404).json({message: "Esta barbearia ainda não possui barbeiros"});
            }
            return res.status(404).json({message: "Este barbeiro não pertence a esta barbearia"});
        } catch (err) {
            return res.status(400).json({message: 'Erro ao buscar barbeiro, tente novamente'});
        }
    },
    async store(req, res) {
        const { barbershop_id, user_id } = req.params;

        try {
            const barbershop = await Barbershop.findByPk(barbershop_id);
            if(!barbershop) {
                return res.status(404).json({ message: 'Barbearia não encontrada' });
            }
            const user = await User.findByPk(user_id);
            if(!user) {
                return res.status(404).json({ message: 'Usuário não encontrado' });
            }

            const users = await barbershop.getUsers();
            if(users.length > 0) {
                users.forEach((user) =>{
                    if(user.id == user_id) {
                        return res.status(400).json({message: 'Usuário já é um barbeiro'});
                    }
                })
            }
            
            await barbershop.addUser(user);

            return res.json(barbershop);
        } catch (err) {
            return res.status(400).json({message: 'Erro ao inserir barbeiro, tente novamente'});
        }
    },
    async removeBarber(req, res) {
        const { barbershop_id, user_id } = req.params;

        try {
            const barbershop = await Barbershop.findByPk(barbershop_id);
            if(!barbershop) {
                return res.status(404).json({ message: 'Barbearia não encontrada' });
            }

            const user = await User.findByPk(user_id);
            if(!user) {
                return res.status(404).json({ message: 'Usuário não encontrado' });
            }

            const users = await barbershop.getUsers();
            let userToRemove = null;
            if(users.length > 0) {
                users.forEach((user) =>{
                    if(user.id == user_id) {
                        userToRemove = user;
                    }
                })
            } else {
                return res.status(404).json({message: "Esta barbearia ainda não possui barbeiros"});
            }
            if(userToRemove) {
                await barbershop.removeUser(userToRemove);
                return res.status(200).json({message: 'Barbeiro removido da barbearia' });
            }
            return res.status(404).json({message: 'Este barbeiro não pertence a esta barbearia' })
        } catch (err) {
            return res.status(400).json({message: 'Erro ao remover barbeiro, tente novamente'});
        }
    }
}