import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import userRouter from './routes/userRouter.js'
import empresaRouter from './routes/empresaRouter.js'
import ativoRouter from './routes/ativoRouter.js'

const uri = 'mongodb+srv://tractianAdmin:tractian2020@cluster0.8ypaq.mongodb.net/desafioTractian?retryWrites=true&w=majority'
const port = 4000;

(async()=>{
	try {
		await mongoose
		.connect(uri,
		{
		  useNewUrlParser: true,
		  useUnifiedTopology: true,
		  useFindAndModify: false,
		  useCreateIndex: true
		}
			)			
			console.log('Você está conectado no banco!')

	} catch (error) {
				console.log('Não foi possível conectar ao banco');
	}   
})()

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(cors())

app.use('/user',userRouter)
app.use('/empresa',empresaRouter)
app.use('/ativo', ativoRouter)

app.listen(port, ()=>{
	console.log('Servidor iniciado!')
})