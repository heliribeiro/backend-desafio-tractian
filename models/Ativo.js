import mongoose from "mongoose";

const AtivoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique:true
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default:
      "https://pcdn.piiojs.com/i/icmh4j/vw,883,vh,0,r,0,pr,1,wp,1/https%3A%2F%2Ftractian.com%2Fwp-content%2Fuploads%2Fpad-copyright-2.png",
  }, 
  status: {
    type: String,
    enum: ["Disponível", "Em manutenção", "Desativado"],
    required: true,
  },
  healthscore:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'Healthscore',
    required: function (){
      return this.status === "Disponível"
    }
  },
	user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  unidade: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "unidades",
    required: true,
  },
  createAt: {
    date: {
      type: Date,
      default: Date.now,
    },
  },
});

const Ativo = mongoose.model("Ativo", AtivoSchema);

export default Ativo;
