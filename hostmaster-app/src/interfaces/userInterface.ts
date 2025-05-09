import { Review } from "./reviewInterface"

export interface User {
    username: string
    email: string
    disabled: boolean
    role: string
    firstname: string
    lastname: string
    full_name: string
    document_number: string
    image: string
    reviews: Review[]
    accommodation_ids: number[]
  }