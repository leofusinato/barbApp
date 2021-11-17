const User = require('../../app/models/User');
const authHelper = require('../../helpers/auth')
const crypto = require('crypto');
const mailer = require('../../modules/mailer');

module.exports = {
    async auth(req, res) {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });

        if(!user) {
            return res.status(400).send({ message: 'Usuáro não encontrado' });
        }

        if(user.password !== password) {
            return res.status(400).send({ message: 'Senha inválida' });
        }

        user.password = undefined;

        res.send({ user, token: authHelper.generateToken({ id: user.id }) })
    },
    async forgotPassword(req, res) {
        const { email } = req.body;
        try {
            const user = await User.findOne({ where: { email } });
            if(!user) {
                return res.status(400).send({ message: 'Usuáro não encontrado' });
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
                from: 'leonardo.alex.fusinato@gmail.com', 
                template: 'auth/forgot_password', 
                context: { token }
            }, (err) => {
                if(err) {
                    console.log(err);
                    return res.status(400).send({ message: 'Não foi possível enviar e-mail de esquecimento de senha, tente novamente' })    
                }
                return res.send();
            })

        } catch(err) {
           return res.status(400).send({ message: 'Erro no esquecimento de senha, tente novamente.' })
        }
    },
    async resetPassword(req, res) {
        const { email, token, password } = req.body;
        try {
            const user = await User.findOne({ where: { email } });
            if(!user) {
                return res.status(400).send({ message: 'Usuáro não encontrado' });
            }

            if(token !== user.passwordResetToken) {
                return res.status(400).send({ message: 'Token inválido' })
            }

            const now = new Date();
            if(now > user.passwordResetExpires) {
                return res.status(400).send({ message: 'Token expirado, gere um novo' })    
            }

            user.password = password;
            user.save()

            return res.send();

        } catch(err) {
            return res.status(400).send({ message: 'Não foi possível resetar a senha, tente novamente.' })
        }
    }
}