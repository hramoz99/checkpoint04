const repository = require('../repositories/produto-repository')

exports.get = async (req, res, next) => {
    const data = await repository.get();
    return res.status(200).send(data);
};

exports.post = async (req, res) => {
    const { nome, preco } = req.body;
    if (!nome || !preco) {
        return res.status(400).send({ mensagem: "Campos obrigatórios não foram preenchidos corretamente." });
    }
    await repository.create(req.body);
    res.status(201).send({ mensagem: "Sucesso!" });
};

exports.put = async (req, res) => {
    const id = req.params.id;
    const { nome, preco } = req.body;
    if (!nome || !preco) {
        return res.status(400).send({ mensagem: "Campos obrigatórios não foram preenchidos corretamente." });
    }
    const updated = await repository.update(id, req.body);
    if (!updated) {
        return res.status(404).send({ mensagem: "Cadastro não encontrado." });
    }
    res.status(204).send({ mensagem: "Sucesso!" });
};