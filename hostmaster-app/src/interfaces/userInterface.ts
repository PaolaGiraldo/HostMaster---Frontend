import { Review } from "./reviewInterface"

export interface User {
    username: string
    email: string
    disabled: boolean
    role: string
    firstname: string
    lastname: string
    document_number: string
    image: string
    review: Review[]
    accommodation_ids: number[]
  }