const User = require('../models/User');
const authHelper = require('../helpers/auth')

module.exports = {
    async auth(req, res) {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });

        if(!user) {
            return res.status(400).send({ error: 'User not found' });
        }

        if(user.password !== password) {
            return res.status(400).send({ error: 'Invalid password' });
        }

        user.password = undefined;

        res.send({ user, token: authHelper.generateToken({ id: user.id }) })
    },
}