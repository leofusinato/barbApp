const User = require('../../app/models/User');
const authHelper = require('../../helpers/auth')
const crypto = require('crypto');
const mailer = require('../../modules/mailer');

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
    async forgotPassword(req, res) {
        const { email } = req.body;
        try {
            const user = await User.findOne({ where: { email } });
            if(!user) {
                return res.status(400).send({ error: 'User not found' });
            }

            const token = crypto.randomBytes(20).toString('hex');

            const now = new Date();
            now.setHours(now.getHours() + 1);

            await User.update(
                { 
                    passwordResetToken: token,
                    passwordResetExpires: now
                },
                { where: {
                    id: user.id,
                 } }
            );

            mailer.sendMail({ 
                to: email, 
                from: 'leonardo.fusinato@magazord.com.br', 
                template: 'auth/forgot_password', 
                context: { token }
            }, (err) => {
                if(err) {
                    console.log(err);
                    return res.status(400).send({ error: 'Cannot send forgot password email.' })    
                }
                return res.send();
            })

        } catch(err) {
           return res.status(400).send({ error: 'Error on forgot password, try again.' })
        }
    },
    async resetPassword(req, res) {
        const { email, token, password } = req.body;
        try {
            const user = await User.findOne({ where: { email } });
            if(!user) {
                return res.status(400).send({ error: 'User not found' });
            }

            if(token !== user.passwordResetToken) {
                return res.status(400).send({ error: 'Invalid token' })
            }

            const now = new Date();
            if(now > user.passwordResetExpires) {
                return res.status(400).send({ error: 'Token expired, generate a new one' })    
            }

            user.password = password;
            user.save()

            return res.send();

        } catch(err) {
            return res.status(400).send({ error: 'Cannot reset password, try again.' })
        }
    }
}