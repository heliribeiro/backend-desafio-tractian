import mongoose from 'mongoose'

const HealthscoreSchema = new mongoose.Schema({

    health: {
        type: Number,
        required: true
    },
    ativo: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Ativo',
        required:true
    }

})

const Healthscore = mongoose.model('Healthscore', HealthscoreSchema)

export default Healthscore