import mongoose, { Schema } from 'mongoose'

const opinionSchema = new Schema({
  fecha: {
    type: Date,
    default: Date.now
  },
  texto: {
    type: String
  },
  usuario_id: {
    type: Schema.Types.ObjectId,
    ref: 'Persona'
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id }
  }
})

opinionSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      fecha: this.fecha,
      texto: this.texto,
      usuario_id: this.usuario_id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

const model = mongoose.model('Opinion', opinionSchema)

export const schema = model.schema
export default model
