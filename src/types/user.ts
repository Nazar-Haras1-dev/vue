export type Gender = 'male' | 'female'

export interface User {
  id: number
  gender: Gender
  name: { title: string; first: string; last: string }
  location: {
    street: { number: number; name: string }
    city: string
    state: string
    country: string
    postcode: number
    timezone: { offset: string; description: string }
  }
  email: string
  dob: { date: string; age: number }
  phone: string
  cell: string
  picture: string
  hobbies: string[]
  details: string
}
