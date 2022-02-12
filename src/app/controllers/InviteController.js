const Invite = require('../models/Invite');
const Barbershop = require('../models/Barbershops');
const User = require('../models/User');

module.exports = {
    async indexFromUser(req, res) {
        const { user_id } = req.params;

        try {
            const user = await User.findByPk(user_id);
            if(!user) {
                return res.status(400).json({ message: 'Pessoa não encontrada' })
            }
            const invites = await Invite.findAll({
                where: { user_id },
                order: [['schedule', 'DESC']],
                include: [
                    { association: 'barbershop' }, 
                    { association: 'barber' }
                ]
            });
            invites.map((invite) => {
                invite.barber_id = undefined;
                invite.barbershop_id = undefined;
            })
            return res.json(invites);
        } catch(err) {
            return res.status(400).json({ message: 'Erro ao buscar os convites' })
        }
    },
    async indexFromBarber(req, res) {
        const { barber_id } = req.params;

        try {
            const barber = await User.findByPk(barber_id);
            if(!barber) {
                return res.status(400).json({ message: 'Barbeiro não encontrado' })
            }
            if(!barber.is_barber) {
                return res.status(400).json({ message: 'Usuário não é um barbeiro' })
            }
            
            const invites = await Invite.findAll({
                where: { barber_id }
            });
            return res.json(invites);
        } catch(err) {
            return res.status(400).json({ message: 'Erro ao buscar os convites' })
        }
    },
    async index(req, res) {
        try {
            const invites = await Invite.findAll();
            return res.json(invites);
        } catch(err) {
            return res.status(400).json({ message: 'Erro ao buscar os convites' })
        }
    },
    async store(req, res) {
        const { barbershop, user, barber, schedule, situation } = req.body;

        try {
            const userFind = await User.findByPk(user.id);
            if(!userFind) {
                return res.status(400).json({ message: 'Usuário não encontrado' })
            }
            const barberFind = await User.findByPk(barber.id);
            if(!barberFind) {
                return res.status(400).json({ message: 'Barbeiro não encontrado' })
            }
            const barbershopFind = await Barbershop.findByPk(barbershop.id);
            if(!barbershopFind) {
                return res.status(400).json({ message: 'Barbearia não encontrada' })
            }

            const invite = await Invite.create({ 
                barbershop_id: barbershop.id, 
                user_id: user.id, 
                barber_id: barber.id, 
                schedule, 
                situation 
            });
            return res.json(invite);
        } catch(err) {
            return res.status(400).json({ message: 'Erro ao cadastrar convite' })
        }
    },
    async update(req, res) {
        const { invite_id } = req.params;
        const { barber, schedule, situation } = req.body;

        try {
            const invite = await Invite.findByPk(invite_id);
            if(!invite) {
                return res.status(400).json({ message: 'Convite não encontrado' })
            }
            const barberFind = await User.findByPk(barber.id);
            if(!barberFind) {
                return res.status(400).json({ message: 'Barbeiro não encontrado' })
            }
            await Invite.update({ barber_id: barber.id, schedule, situation }, { where: { id: invite_id } });
            return res.json(await Invite.findByPk(invite_id));
        } catch(err) {
            return res.status(400).json({ message: 'Erro ao atualizar o convite' })
        }
    },
    async accept(req, res) {
        const { invite_id } = req.params;
        
        try {
            const invite = await Invite.findByPk(invite_id);
            if(!invite) {
                return res.status(400).json({ message: 'Convite não encontrado' })
            }
            await Invite.update({ situation: 2 }, { where: { id: invite_id } });
            return res.json({ message: "Convite aceito com sucesso!" });
        } catch(err) {
            return res.status(400).json({ message: 'Erro ao aceitar o convite' })
        }
    },
    async recuse(req, res) {
        const { invite_id } = req.params;
        
        try {
            const invite = await Invite.findByPk(invite_id);
            if(!invite) {
                return res.status(400).json({ message: 'Convite não encontrado' })
            }
            await Invite.update({ situation: 3 }, { where: { id: invite_id } });
            return res.json({ message: "Convite recusado com sucesso!" });
        } catch(err) {
            return res.status(400).json({ message: 'Erro ao recusar o convite' })
        }
    },
    async remove(req, res) {
        const { invite_id } = req.params;

        try {
            const invite = await Invite.findByPk(invite_id);
            if(!invite) {
                return res.status(400).json({ message: 'Convite não encontrada' })
            }
            await invite.destroy();
            return res.json({ message: 'Convite removido com sucesso'});
        } catch(err) {
            return res.status(400).json({ message: 'Erro ao remover o convite' })
        }
    }
}