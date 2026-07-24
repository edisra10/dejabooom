import dynamic from 'next/dynamic'

const AiTripLanding = dynamic(() => import('@/components/landing/ai-trip-landing'), {
  ssr: true,
})

export default function Home() {
  return <AiTripLanding />
}
