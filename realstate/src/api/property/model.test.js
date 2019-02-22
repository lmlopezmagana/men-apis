import { Property } from '.'
import { User } from '../user'

let user, property

beforeEach(async () => {
  user = await User.create({ email: 'a@a.com', password: '123456' })
  property = await Property.create({ ownerId: user, title: 'test', description: 'test', price: 'test', rooms: 'test', categoryId: 'test', address: 'test', zipcode: 'test', city: 'test', province: 'test', loc: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = property.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(property.id)
    expect(typeof view.ownerId).toBe('object')
    expect(view.ownerId.id).toBe(user.id)
    expect(view.title).toBe(property.title)
    expect(view.description).toBe(property.description)
    expect(view.price).toBe(property.price)
    expect(view.rooms).toBe(property.rooms)
    expect(view.categoryId).toBe(property.categoryId)
    expect(view.address).toBe(property.address)
    expect(view.zipcode).toBe(property.zipcode)
    expect(view.city).toBe(property.city)
    expect(view.province).toBe(property.province)
    expect(view.loc).toBe(property.loc)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = property.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(property.id)
    expect(typeof view.ownerId).toBe('object')
    expect(view.ownerId.id).toBe(user.id)
    expect(view.title).toBe(property.title)
    expect(view.description).toBe(property.description)
    expect(view.price).toBe(property.price)
    expect(view.rooms).toBe(property.rooms)
    expect(view.categoryId).toBe(property.categoryId)
    expect(view.address).toBe(property.address)
    expect(view.zipcode).toBe(property.zipcode)
    expect(view.city).toBe(property.city)
    expect(view.province).toBe(property.province)
    expect(view.loc).toBe(property.loc)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
