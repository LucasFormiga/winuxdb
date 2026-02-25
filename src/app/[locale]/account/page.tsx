import { redirect } from 'next/navigation'
import AccountContent from '@/components/templates/AccountContent'
import { getUserData } from '@/lib/actions/auth'

export default async function AccountPage() {
  const user = await getUserData()

  if (!user) {
    redirect('/login')
  }

  return <AccountContent user={user} />
}
