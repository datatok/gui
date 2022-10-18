import { EuiCard, EuiFlexGroup, EuiFlexItem, EuiIcon, EuiPageTemplate, EuiSpacer, EuiText } from '@elastic/eui'
import { useBucketContext } from 'providers/BucketContext'
import React, { FC, useMemo } from 'react'
import { Route, useNavigateProps } from 'services/routing'

const HomePage: FC = () => {
  /**
   * context
   */
  const bucketContext = useBucketContext()

  const navigateProps = useNavigateProps()

  const items = useMemo(() => {
    return bucketContext.buckets.map(bucket => {
      const navProps = navigateProps(Route.BucketBrowse, { bucket: bucket.id, path: '/' })

      return {
        ...bucket,
        nav: navProps
      }
    })
  }, [bucketContext.buckets, navigateProps])

  return (
    <EuiPageTemplate.Section>
      <EuiText><h3>Select a bucket</h3></EuiText>
      <EuiSpacer />
      <EuiFlexGroup gutterSize="l">
        {items.map(({ name, host, nav }, index) => (
          <EuiFlexItem key={index}>
          <EuiCard
            title={name}
            icon={<EuiIcon type={'storage'} size={'xl'} />}
            description={`host: ${host}`}
            {...nav}
          />
        </EuiFlexItem>
        ))}
      </EuiFlexGroup>
    </EuiPageTemplate.Section>
  )
}

export default HomePage
