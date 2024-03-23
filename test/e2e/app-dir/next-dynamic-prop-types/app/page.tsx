import dynamic from 'next/dynamic'
import { lazy } from 'react'

const NextDynamic = dynamic(() => import('./component'))
const ReactLazy = lazy(() => import('./component')) // comparison

export default function Page() {
  return (
    <>
      <NextDynamic from="next/dynamic" />
      <ReactLazy from="react/lazy" />
    </>
  )
}
