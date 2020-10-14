import express from "express";
import Empresa from "../models/Empresa.js";
import authMiddleware from "../middlewares/auth.js";
import Unidade from "../models/Unidade.js";
import User from "../models/User.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/create", async (req, res) => {
  const { name, unidades } = req.body;

  try {
    const user = await User.findById({ _id: req.userId });

    if (user.empresa)
      return res.status(400).send({
        error: "O usuário só poder ter uma empresa cadastrada no sistema!",
      });

    const empresaExists = await Empresa.findOne({ name });
    if (empresaExists)
      return res.status(400).send({ error: "A empresa ja está cadastrada!" });

    const empresa = await Empresa.create({ name });

    await Promise.all(
      unidades.map(async (unidade) => {
        const unidadeEmpresa = new Unidade({
          ...unidade,
          empresa: empresa._id,
        });
        await unidadeEmpresa.save();
        empresa.unidades.push(unidadeEmpresa);
      })
    );

    await empresa.save();
    await User.findByIdAndUpdate(req.userId, { empresa: empresa._id });

    res.send({ empresa });
  } catch (error) {
    res.status(400).send({ error: "Não foi possive criar a empresa " + error });
  }
});

router.get("/:empresaId", async (req, res) => {
  const { empresaId } = req.params;
  try {
    const empresa = await Empresa.findById({ _id: empresaId }).populate(
      "unidades"
    );

    if (!empresa) res.status(400).send({ error: "Id inválido" });

    res.send({ empresa });
  } catch (error) {}
});

router.put("/:empresaId", async (req, res) => {
  const { name, unidades } = req.body;
  const { empresaId } = req.params;
  try {
    const empresa = await Empresa.findByIdAndUpdate(
      empresaId,
      {
        name
      },
      { new: true }
    );

    empresa.unidades = [];

    await Unidade.deleteOne({ empresa: empresaId });

    await Promise.all(
      unidades.map(async (unidade) => {
        const unidadeEmpresa = new Unidade({
          ...unidade,
          empresa: empresa._id,
        });
        await unidadeEmpresa.save();
        empresa.unidades.push(unidadeEmpresa);
      })
    );

    await empresa.save();

    res.send({ empresa });
  } catch (error) {
    res
      .status(400)
      .send({ error: "Não foi possive atualizar a empresa " + error });
  }
});

router.delete("/:empresaId", async (req, res) => {
  try {
    const { empresaId } = req.params;
    await Empresa.findByIdAndRemove(empresaId);
    await User.findByIdAndUpdate(req.userId, { $unset: { empresa: 1 } });
    res.send();
  } catch (error) {
    res.status(400).send({ error: "Falha ao deletar empresa " + error });
  }
});

export default router;
