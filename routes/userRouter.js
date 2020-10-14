import express from 'express'
import User from '../models/User.js'
import jwt from 'jsonwebtoken'
import authConfig from '../config/auth.js'

const router = express.Router()

function generateToken(params = {}){
    const token = jwt.sign(params, authConfig.secret, {
        expiresIn: 86400
    })
    return token
}


router.post('/register', async (req,res)=>{
   const {name, email, password} = req.body
    try {
        if(await User.findOne({email}))
            return res.status(400).send({error:'Usuario ja existe no banco'})
        
        const user = await User.create({name,email,password})

        user.password = undefined
        res.send({
            user,
            token: generateToken({id: user.id})    
        })
        return
    } catch (error) {
        res.status(400).send({error:'Cadastro do Usuário falhou'+error})
    }
})

router.post('/authenticate', async(req,res)=> {
    const {email, password} = req.body
   try {
       const user = await User.findOne({email}).select('+password')
       if(!user){
           res.status(400).send({error:"O usuário não está cadastrado"})
       }
       if(user.password !== password){
           res.status(400).send({error:"Senha inválida"})
       }

       user.password = undefined

       res.send({
           user,
           token: generateToken({id: user.id})
        })

   } catch (error) {
       res.status(400).send({error:"erro no login"})
   }
})

export default router