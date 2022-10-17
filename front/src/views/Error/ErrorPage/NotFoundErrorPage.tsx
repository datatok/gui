import React, { FC } from 'react'
import { useRouteError } from 'react-router-dom'

const NotFoundErrorPage: FC = () => {
  const error = useRouteError()
  console.error(error)

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
      </p>
    </div>
  )
}

export default NotFoundErrorPage
