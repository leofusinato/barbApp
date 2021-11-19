const Barbershop = require('../models/Barbershops');
const Product = require('../models/Product');

module.exports = {
    async indexFromId(req, res) {
        const { product_id } = req.params;

        try {
            const product = await Product.findByPk(product_id);
            if(!product) {
                return res.status(404).json({ message: 'Produto não encontrado'});
            }
            return res.json(product);
        } catch (err) {
            return res.status(400).json({ message: 'Erro ao buscar produtos da barbearia'})
        }
    },
    async index(req, res) {
        const { barbershop_id } = req.params;

        try {
            const barbershop = await Barbershop.findByPk(barbershop_id);
            if(!barbershop) {
                return res.status(404).json({ message: 'Barbearia não encontrada'});
            }
            const products = await Product.findAll({
                where: { 
                    barbershop_id,
                }
            });
            return res.json(products);
        } catch (err) {
            return res.status(400).json({ message: 'Erro ao buscar produtos da barbearia'})
        }
    },
    async store(req, res) {
        const { barbershop_id } = req.params;
        const { name, value } = req.body;

        try {
            const barbershop = await Barbershop.findByPk(barbershop_id);
            if(!barbershop) {
                return res.status(404).json({ message: 'Barbearia não encontrada'});
            }
            const product = await Product.create({ name, value, barbershop_id });
            return res.json(product);
        } catch (err) {
            return res.status(400).json({ message: err})
        }
    },
    async update(req, res) {
        const { product_id } = req.params;
        const { name, value } = req.body;

        try {
            const product = await Product.findByPk(product_id);
            if(!product) {
                return res.status(404).json({ message: 'Produto não encontrado'});
            }
            await Product.update({ name, value }, { where: { id: product.id } });
            return res.json(await Product.findByPk(product_id));
        } catch (err) {
            return res.status(400).json({ message: 'Erro ao buscar produtos da barbearia'})
        }
    },
    async remove(req, res) {
        const { product_id } = req.params;

        try {
            const product = await Product.findByPk(product_id);
            if(!product) {
                return res.status(404).json({ message: 'Produto não encontrado'});
            }
            await product.destroy();
            return res.json({ message: 'Produto removido com sucesso' });
        } catch (err) {
            return res.status(400).json({ message: 'Erro ao remover produto da barbearia'})
        }
    }
}