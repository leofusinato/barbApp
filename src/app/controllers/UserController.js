
const User = require('../../app/models/User');
const authHelper = require('../../helpers/auth')

module.exports = {
    async index(req, res) {
        const users = await User.findAll();
        return res.json(users);
    },
    async store(req, res) {
        const { name, email, password, is_barber } = req.body;
        try {
            if(await User.findOne({ where: { email } })) {
                return res.status(403).send({ error: "Usuário já existe" });
            }
    
            const user = await User.create({ name, email, password, is_barber });
            user.password = undefined;
    
            res.json({...user.toJSON(), token: authHelper.generateToken({ id: user.id }) })
        } catch(err) { 
            res.status(400).send({ error: "Erro ao registrar" })
        }
    }
}