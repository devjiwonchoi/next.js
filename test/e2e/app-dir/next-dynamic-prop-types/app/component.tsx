import PropTypes from 'prop-types'

const Component = ({ from, notRequired }) => {
  const Heading = from === 'next/dynamic' ? 'h1' : 'h2'
  if (notRequired) {
    return <p>not required</p>
  }
  return <Heading>{from}</Heading>
}

Component.propTypes = {
  from: PropTypes.string.isRequired,
  notRequired: PropTypes.string,
}

export default Component
