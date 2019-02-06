import { Appointment } from '.'
import { User } from '../user'

let user, appointment

beforeEach(async () => {
  user = await User.create({ email: 'a@a.com', password: '123456' })
  appointment = await Appointment.create({ user_id: user, title: 'test', description: 'test', date: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = appointment.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(appointment.id)
    expect(typeof view.user_id).toBe('object')
    expect(view.user_id.id).toBe(user.id)
    expect(view.title).toBe(appointment.title)
    expect(view.description).toBe(appointment.description)
    expect(view.date).toBe(appointment.date)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = appointment.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(appointment.id)
    expect(typeof view.user_id).toBe('object')
    expect(view.user_id.id).toBe(user.id)
    expect(view.title).toBe(appointment.title)
    expect(view.description).toBe(appointment.description)
    expect(view.date).toBe(appointment.date)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
