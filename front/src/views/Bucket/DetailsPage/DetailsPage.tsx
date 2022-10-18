import { EuiSpacer, EuiText } from '@elastic/eui'
import { useBucketContext } from 'providers/BucketContext'
import React, { FC } from 'react'

const DetailsPage: FC = () => {
  const { current: bucket } = useBucketContext()

  if (bucket === null) {
    return <></>
  }

  return (
    <div>
      <EuiText><h2>{bucket.name}</h2></EuiText>
      <EuiSpacer />

    </div>
  )
}

export default DetailsPage
