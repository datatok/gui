import { EuiSuperSelect, EuiSuperSelectOption } from '@elastic/eui'
import React, { FC, useState } from 'react'
import { Route, useRoutingNavigate } from 'services/routing'
import { GuiBucket } from 'types'

interface BucketSelectProps {
  buckets: GuiBucket[]
  bucket: GuiBucket | null
}

const bucketToOption = (bucket: GuiBucket): EuiSuperSelectOption<string> => {
  return {
    inputDisplay: `${bucket.name} ${bucket.host !== '' ? `(${bucket.host})` : ''}`,
    value: bucket.id
  }
}

const BucketSelect: FC<BucketSelectProps> = ({ buckets, bucket }) => {
  const labels = buckets.map(bucketToOption)

  const navigate = useRoutingNavigate()

  const [selectedValue, setSelectedValue] = useState<string>(bucket === null ? '' : bucket.id)

  const onChange = (bucket: string): void => {
    navigate(Route.BucketHome, { bucket })
  }

  React.useEffect(() => {
    setSelectedValue(bucket === null ? '' : bucket.id)
  }, [bucket])

  return (
    <EuiSuperSelect
      options={labels}
      placeholder="Select a bucket"
      onChange={onChange}
      valueOfSelected={selectedValue}
    />
  )
}

export default BucketSelect
