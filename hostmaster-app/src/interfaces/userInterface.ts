import { Review } from "./reviewInterface"

export interface User {
    username: string
    password?: string
    email: string
    disabled?: boolean
    role: string
    firstname: string
    lastname: string
    full_name: string
    document_number: string
    image?: string | null
    reviews: Review[]
    accommodation_ids?: number[]
  }