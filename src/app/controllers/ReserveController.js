const Reserve = require('../models/Reserve');
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
            const reserves = await Reserve.findAll({
                where: { user_id },
                order: [['schedule', 'DESC']],
                include: [
                    { association: 'barbershop' }, 
                    { association: 'barber' }
                ]
            });
            reserves.map((reserve) => {
                reserve.barber_id = undefined;
                reserve.barbershop_id = undefined;
            })
            return res.json(reserves);
        } catch(err) {
            return res.status(400).json({ message: 'Erro ao buscar as reservas' })
        }
    },
    async lastIndexFromUser(req, res) {
        const { user_id } = req.params; 

        try {
            const user = await User.findByPk(user_id);
            if(!user) {
                return res.status(404).json({ message: 'Pessoa não encontrada' })
            }
            const reserve = await Reserve.findOne({
                where: { user_id },
                order: [['schedule', 'DESC']],
                include: { association: 'barbershop' }
            });
            if(!reserve) { 
                return res.status(404).json({ message: 'O usuário ainda não possui reservas' })    
            }
            reserve.barbershop_id = undefined;
            return res.json(reserve);
        } catch(err) {
            return res.status(400).json({ message: 'Erro ao buscar as reservas' })
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
            
            const reserves = await Reserve.findAll({
                where: { barber_id }
            });
            return res.json(reserves);
        } catch(err) {
            return res.status(400).json({ message: 'Erro ao buscar as reservas' })
        }
    },
    async indexFromBarbershop(req, res) {
        const { barbershop_id } = req.params;

        try {
            const barbershop = await Barbershop.findByPk(barbershop_id);
            if(!barbershop) {
                return res.status(400).json({ message: 'Barbearia não encontrada' })
            }
            
            const reserves = await Reserve.findAll({
                where: { barbershop_id }
            });
            return res.json(reserves);
        } catch(err) {
            return res.status(400).json({ message: 'Erro ao buscar as reservas' })
        }
    },
    async index(req, res) {
        try {
            const reserves = await Reserve.findAll();
            return res.json(reserves);
        } catch(err) {
            return res.status(400).json({ message: 'Erro ao buscar as reservas' })
        }
    },
    async store(req, res) {
        const { barbershop, user, barber, schedule, situation } = req.body;
        const user_id = user.id;
        const barbershop_id = barbershop.id;
        const barber_id = barber.id;

        try {

            if(schedule <= new Date()) {
                return res.status(400).json({ message: 'A data e hora devem ser maior que a de agora' });
            }

            const userExistent = await User.findByPk(user_id);
            if(!userExistent) {
                console.log("Usuário não encontrado");
                return res.status(400).json({ message: 'Usuário não encontrado' })
            }
            const barberExistent = await User.findByPk(barber_id);
            if(!barberExistent) {
                console.log("Barbeiro não encontrado");
                return res.status(400).json({ message: 'Barbeiro não encontrado' })
            }
            const barbershopExistent = await Barbershop.findByPk(barbershop_id);
            if(!barbershopExistent) {
                console.log(barbershop_id);
                return res.status(400).json({ message: 'Barbearia não encontrada' })
            }

            const barbers = await barbershopExistent.getUsers();
            let found = false;
            if(barbers.length > 0) {
                barbers.map((barber) => {
                    if(barber.id == barber_id) { 
                        found = true;
                    }
                })
            } else {
                return res.status(400).json({ message: 'Esta barbearia não possui barbeiros' })
            }
            if(found) {
                const reserve = await Reserve.create({ barbershop_id, user_id, barber_id, schedule, situation });
                return res.json(reserve);
            }
            return res.status(400).json({ message: 'O barbeiro não pertence a esta barbearia' })
        } catch(err) {
            return res.status(400).json({ message: 'Erro ao cadastrar a reserva' })
        }
    },
    async update(req, res) {
        const { reserve_id } = req.params;
        const { barber_id, schedule, situation } = req.body;

        try {
            const reserve = await Reserve.findByPk(reserve_id);
            if(!reserve) {
                return res.status(404).json({ message: 'Reserva não encontrada' })
            }
            const barber = await User.findByPk(barber_id);
            if(!barber) {
                return res.status(404).json({ message: 'Barbeiro não encontrado' })
            }
            await Reserve.update({ barber_id, schedule, situation }, { where: { id: reserve_id } });
            return res.json(await Reserve.findByPk(reserve_id));
        } catch(err) {
            return res.status(400).json({ message: 'Erro ao atualizar a reserva' })
        }
    },
    async accept(req, res) {
        const { reserve_id } = req.params;
        
        try {
            const reserve = await Reserve.findOne({
                where: { id: reserve_id },
            });
            if(!reserve) {
                return res.status(404).json({ message: 'Reserva não encontrada' })
            }
            await Reserve.update({ situation: 2 }, { where: { id: reserve_id}});
            return res.json({ message: "Reserva aceita com sucesso" });
        } catch (err) {
            return res.status(400).json({ message: 'Erro ao aceitar a reserva' })
        }
    },
    async recuse(req, res) {
        const { reserve_id } = req.params;
        
        try {
            const reserve = await Reserve.findOne({
                where: { id: reserve_id },
            });
            if(!reserve) {
                return res.status(404).json({ message: 'Reserva não encontrada' })
            }
            await Reserve.update({ situation: 3 }, { where: { id: reserve_id}});
            return res.json({ message: "Reserva recusada com sucesso" });
        } catch (err) {
            return res.status(400).json({ message: 'Erro ao recusar a reserva' })
        }
    },
    async remove(req, res) {
        const { reserve_id } = req.params;

        try {
            const reserve = await Reserve.findByPk(reserve_id);
            if(!reserve) {
                return res.status(400).json({ message: 'Reserva não encontrada' })
            }
            await reserve.destroy();
            return res.json({ message: 'Reserva removida com sucesso'});
        } catch(err) {
            return res.status(400).json({ message: 'Erro ao remover a  reserva' })
        }
    }
}