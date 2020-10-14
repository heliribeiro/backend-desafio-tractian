import mongoose from 'mongoose'

const EmpresaSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    unidades:[{
        type: mongoose.Types.ObjectId,
        ref:'unidades',
        required: true
    }],
    createAt: {
        date: {
            type: Date,
            default: Date.now
        }
    }

})

const Empresa = mongoose.model('empresas', EmpresaSchema)

export default Empresa