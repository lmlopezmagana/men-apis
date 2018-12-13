import { Opinion } from '.'

let opinion

beforeEach(async () => {
  opinion = await Opinion.create({ fecha: 'test', texto: 'test', usuario_id: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = opinion.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(opinion.id)
    expect(view.fecha).toBe(opinion.fecha)
    expect(view.texto).toBe(opinion.texto)
    expect(view.usuario_id).toBe(opinion.usuario_id)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = opinion.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(opinion.id)
    expect(view.fecha).toBe(opinion.fecha)
    expect(view.texto).toBe(opinion.texto)
    expect(view.usuario_id).toBe(opinion.usuario_id)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
