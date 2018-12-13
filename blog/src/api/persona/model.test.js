import { Persona } from '.'

let persona

beforeEach(async () => {
  persona = await Persona.create({ nombre: 'test', fechaNacimiento: 'test', aficiones: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = persona.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(persona.id)
    expect(view.nombre).toBe(persona.nombre)
    expect(view.fechaNacimiento).toBe(persona.fechaNacimiento)
    expect(view.aficiones).toBe(persona.aficiones)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = persona.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(persona.id)
    expect(view.nombre).toBe(persona.nombre)
    expect(view.fechaNacimiento).toBe(persona.fechaNacimiento)
    expect(view.aficiones).toBe(persona.aficiones)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
