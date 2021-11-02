const User = require('../models/User');
const authHelper = require('../helpers/auth')

module.exports = {
    async index(req, res) {
        const users = await User.findAll();
        return res.json(users);
    },
    async store(req, res) {
        const { name, email, password } = req.body;
        try {
            if(await User.findOne({ where: { email } })) {
                return res.status(403).send({ error: "User already exists" });
            }
    
            const user = await User.create({ name, email, password });
            user.password = undefined;
    
            return res.json({ user, token: authHelper.generateToken({ id: user.id }) });
        } catch(err) { 
            res.status(400).send({ error: "Registration failed" })
        }
    }
}