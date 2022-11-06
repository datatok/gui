import { EuiCallOut, EuiCard, EuiDescriptionList, EuiFlexGroup, EuiFlexItem, EuiIcon, EuiPageTemplate, EuiSpacer, EuiText } from '@elastic/eui'
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

  if (items.length === 0) {
    return (<EuiPageTemplate.Section>
      <EuiCallOut color='warning'>
        <EuiText>
          No buckets found!
          <br />
          <ul>
            <li>Check internet connection</li>
            <li>Check configuration is OK</li>
          </ul>
        </EuiText>
      </EuiCallOut>
    </EuiPageTemplate.Section>)
  }

  return (
    <EuiPageTemplate.Section>
      <EuiText><h3>Select a bucket</h3></EuiText>
      <EuiSpacer />
      <EuiFlexGroup gutterSize="l" justifyContent="spaceEvenly">
        {items.map(({ title, name, host, nav }, index) => (
          <EuiFlexItem key={index} css={{ width: '25%' }}>
          <EuiCard
            title={title}
            icon={<EuiIcon type={'storage'} size={'xl'} />}
            description={(<EuiDescriptionList listItems={[
              {
                title: 'Bucket',
                description: name
              },
              {
                title: 'Host',
                description: host
              }
            ]}/>)}
            {...nav}
          />
        </EuiFlexItem>
        ))}
      </EuiFlexGroup>
    </EuiPageTemplate.Section>
  )
}

export default HomePage
