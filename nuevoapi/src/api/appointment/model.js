import mongoose, { Schema } from 'mongoose'

const appointmentSchema = new Schema({
  user_id: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String
  },
  description: {
    type: String
  },
  date: {
    type: String
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id }
  }
})

appointmentSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      user_id: this.user_id.view(full),
      title: this.title,
      description: this.description,
      date: this.date,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

const model = mongoose.model('Appointment', appointmentSchema)

export const schema = model.schema
export default model
