import { nextTestSetup } from 'e2e-utils'

describe('next-dynamic-prop-types', () => {
  const { next } = nextTestSetup({
    files: __dirname,
    dependencies: {
      'prop-types': '^15',
    },
  })

  it('should resolve prop-types', async () => {
    const $ = await next.render$('/')
    expect($('h1').text()).toBe('next/dynamic')
    expect($('h2').text()).toBe('react/lazy')
    // should not render the not required prop
    expect($('p').length).toBe(0)
  })
})
