import express from "express";
import Ativo from "../models/Ativo.js";
import Healthscore from "../models/Healthscore.js";
import authMiddleware from "../middlewares/auth.js";
const router = express.Router();

router.use(authMiddleware);

router.post("/create", async (req, res) => {
  try {
    const { name, description, urlImage, status, health, unidade } = req.body;

    const user = req.userId;

    const ativo = await Ativo.create({
      name,
      description,
      image: urlImage,
      status,
      user,
      unidade
    });
   
    if(health !== undefined){
        console.log(health)
    const healthscore = await Healthscore.create({ health, ativo: ativo._id });

    ativo.healthscore = healthscore._id;
   
    await ativo.save();
    }
    res.send({ ativo });
  } catch (error) {
    res.status(400).send({ error: "Erro ao criar o ativo!"+error });
  }
});

router.get("/:unidadeId", async(req,res)=>{
    const unidadeId = req.params.unidadeId
    console.log(unidadeId)
    try {
     const ativos = await Ativo.find({unidade:unidadeId}).populate("healthscore")
     
     res.send({ativos})
        
    } catch (error) {
        res.status(400).send({error:"Não foi possivel buscar os ativos da unidade "+error})
    }
})

router.put('/:ativoId',async(req,res)=>{
  try {
    const { name, description, urlImage, status, health, unidade } = req.body;
    const {ativoId} = req.params

    const user = req.userId;

    const ativo = await Ativo.findByIdAndUpdate(ativoId,{
      name,
      description,
      image: urlImage,
      status,
      user,
      unidade,
    }, {new:true});
    if(health !== undefined){
    await Healthscore.deleteOne({ativo:ativo._id})
    const healthscore = await Healthscore.create({ health, ativo: ativo._id });

    ativo.healthscore = healthscore._id;
   
    await ativo.save();
    }
    
    res.send({ ativo });
  } catch (error) {
    res.status(400).send({ error: "Erro ao criar o ativo!"+error });
  }   
})

export default router;
