import { redirect } from 'next/navigation'
import { getUserData } from '@/lib/actions/auth'
import AccountContent from '@/components/templates/AccountContent'

export default async function AccountPage() {
  const user = await getUserData()

  if (!user) {
    redirect('/login')
  }

  return <AccountContent user={user} />
}
