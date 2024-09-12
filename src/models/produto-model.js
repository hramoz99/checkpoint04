const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const produtoSchema = new Schema({
    idProduto: {
        type: String,
        required: true,
        trim: true
    },
    nome: {
        type: String,
        required: true,
        trim: true
    },
    preco: {
        type: String,
        required: true,
        trim: true
    },
    categoria: {
        type: String,
        required: true,
        trim: true
    }
});

module.exports = mongoose.model('Produto', produtoSchema);
