import dynamic from 'next/dynamic'

const TravelBookingLanding = dynamic(() => import('@/components/landing/travel-booking-landing'), {
  ssr: true,
})

export default function Home() {
  return <TravelBookingLanding />
}
