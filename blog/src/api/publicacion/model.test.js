import { Publicacion } from '.'

let publicacion

beforeEach(async () => {
  publicacion = await Publicacion.create({ titulo: 'test', autor: 'test', opiniones: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = publicacion.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(publicacion.id)
    expect(view.titulo).toBe(publicacion.titulo)
    expect(view.autor).toBe(publicacion.autor)
    expect(view.opiniones).toBe(publicacion.opiniones)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = publicacion.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(publicacion.id)
    expect(view.titulo).toBe(publicacion.titulo)
    expect(view.autor).toBe(publicacion.autor)
    expect(view.opiniones).toBe(publicacion.opiniones)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
