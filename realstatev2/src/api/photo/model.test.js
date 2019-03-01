import { Photo } from '.'

let photo

beforeEach(async () => {
  photo = await Photo.create({ propertyId: 'test', imgurLink: 'test', deletehash: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = photo.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(photo.id)
    expect(view.propertyId).toBe(photo.propertyId)
    expect(view.imgurLink).toBe(photo.imgurLink)
    expect(view.deletehash).toBe(photo.deletehash)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = photo.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(photo.id)
    expect(view.propertyId).toBe(photo.propertyId)
    expect(view.imgurLink).toBe(photo.imgurLink)
    expect(view.deletehash).toBe(photo.deletehash)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
