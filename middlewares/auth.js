import jwt from 'jsonwebtoken'
import authConfig from '../config/auth.js'

const authenticate  = (req,res,next)=>{
    const authHeader = req.headers.authorization

    if(!authHeader){
        return res.status(401).send({error:'O token não foi fornecido'})
    }

    const parts = authHeader.split(' ')
    if(!parts.length === 2)
        return res.status(401).send({error:'Erro no token'})

    const [bearer,token] = parts

    if(!/^Bearer$/i.test(bearer))
				return res.status(401).send({error:'Formato de token inválido'})
				
		
    jwt.verify(token, authConfig.secret, (err,decoded)=>{
			if(err) res.status(401).send({error:'Token inválido'})

			req.userId = decoded.id
		})
		return next()
}


export default authenticate