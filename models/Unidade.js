import mongoose from 'mongoose'

const UnidadeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    empresa: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'empresas',
        required:true
    },
    ativos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Ativo'
    }],
    createAt: {
        date: {
            type: Date,
            default: Date.now
        }
    }

})

const Unidade = mongoose.model('unidades', UnidadeSchema)

export default Unidade