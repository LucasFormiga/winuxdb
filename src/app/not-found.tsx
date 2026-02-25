import { redirect } from 'next/navigation'

export default function RootNotFound() {
  redirect('/en')
}
