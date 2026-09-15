import { redirect } from 'next/navigation'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function PrescriptionRouteRedirect({ params }: PageProps) {
  const { id } = await params
  redirect(`/patients/${id}/prescribe`)
}
