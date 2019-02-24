import mongoose, { Schema } from 'mongoose'
import Photo from '../photo/model'
import { finished } from 'stream';

const propertySchema = new Schema({
  ownerId: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  price: {
    type: Number,
    required: true
  },
  rooms: {
    type: Number
  },
  size: {
    type: Number
  },
  categoryId: {
    type: Schema.ObjectId,
    ref: 'Category'
  },
  address: {
    type: String
  },
  zipcode: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  province: {
    type: String
  },
  loc: {
    type: String,
    required: true
  }
}, {
  strict: false,
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id }
  }
})

propertySchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      ownerId: this.ownerId.view(full),
      title: this.title,
      description: this.description,
      price: this.price,
      rooms: this.rooms,
      categoryId: this.categoryId,
      address: this.address,
      zipcode: this.zipcode,
      city: this.city,
      province: this.province,
      loc: this.loc,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

propertySchema.pre('remove', {query:true}, function(next){
  Photo    
    .find({propertyId: this.id})
    .exec((err, result) => {
      Promise.all(result.map(photo => photo.remove()))
      next()
    }
    )
})

const model = mongoose.model('Property', propertySchema)

export const schema = model.schema
export default model
