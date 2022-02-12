
const User = require('../../app/models/User');
const authHelper = require('../../helpers/auth')

module.exports = {
    async index(req, res) {
        const users = await User.findAll();
        return res.json(users);
    },
    async indexBarbers(req, res) {
        const users = await User.findAll({
            where: { is_barber: true }
        });
        return res.json(users);
    },
    async store(req, res) {
        const { name, email, password, is_barber } = req.body;
        try {
            const re = /\S+@\S+\.\S+/;
            const validEmail =  re.test(email);
            if(!validEmail) {
                return res.status(400).send({ error: "E-mail inválido" });
            }

            if(await User.findOne({ where: { email } })) {
                return res.status(403).send({ error: "Usuário já existe" });
            }

            if(password.length < 8) {
                return res.status(403).send({ error: "Senha deve possuir mais de 8 caracteres" });
            }
    
            const user = await User.create({ name, email, password, is_barber });
            user.password = undefined;
    
            res.json({...user.toJSON(), token: authHelper.generateToken({ id: user.id }) })
        } catch(err) { 
            res.status(400).send({ error: "Erro ao registrar" })
        }
    }
}