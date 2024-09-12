const mongoose = require('mongoose')
const Produto = mongoose.model('Produto')

exports.get = async () => {
    const result = await Produto.find({})
    return result
}

exports.create = async (data) => {
    const novoProduto = new Produto(data);
    await novoProduto.save();
}


exports.update = async (idProduto, data) => {
    const result = await Produto.findOneAndUpdate(
        { idProduto: idProduto },
        { $set: {
            nome: data.nome,
            preco: data.preco,
            categoria: data.categoria
        } },
        { new: true, runValidators: true }
    );

    if (!result) {
        throw new Error('Produto não encontrado');
    }

    return result;
}
