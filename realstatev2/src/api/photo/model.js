import mongoose, { Schema } from 'mongoose'

const uploadService = require('../../services/upload')

const photoSchema = new Schema({
  propertyId: {
    type: Schema.ObjectId,
    ref: 'Property'
  },
  imgurLink: {
    type: String
  },
  deletehash: {
    type: String
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id }
  }
})

photoSchema.pre('remove', {query: true }, function(next){
  console.log('Elminando la imagen' + this.imgurLink)
  uploadService.deleteImage(this.deletehash)
  return next();
})

photoSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      propertyId: this.propertyId,
      imgurLink: this.imgurLink,
      deletehash: this.deletehash,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

const model = mongoose.model('Photo', photoSchema)

export const schema = model.schema
export default model
