import mongoose, { Schema } from 'mongoose'

const personaSchema = new Schema({
  nombre: {
    type: String
  },
  fechaNacimiento: {
    type: Date
  },
  aficiones: [{
    type: String
  }]
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id }
  }
})

personaSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      nombre: this.nombre,
      fechaNacimiento: this.fechaNacimiento,
      aficiones: this.aficiones,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

const model = mongoose.model('Persona', personaSchema)

export const schema = model.schema
export default model
