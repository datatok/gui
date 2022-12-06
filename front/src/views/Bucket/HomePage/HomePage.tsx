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

  const getDescriptionList = ({ host, name }: { host: string, name: string }): any[] => {
    const ar = [{
      title: 'Type',
      description: host !== null && host !== undefined ? 'Remote' : 'Local'
    }, {
      title: 'Bucket',
      description: name
    }]

    if (host !== null && host !== undefined) {
      return [...ar, {
        title: 'Host',
        description: host
      }]
    }

    return ar
  }

  const getIcon = ({ host }): string => {
    return host !== null && host !== undefined ? 'storage' : 'submodule'
  }

  return (
    <EuiPageTemplate.Section>
      <EuiText><h3>Select a bucket</h3></EuiText>
      <EuiSpacer />
      <EuiFlexGroup gutterSize="l" justifyContent="spaceAround">
        {items.map(({ title, name, host, nav }, index) => (
          <EuiFlexItem key={index} css={{ width: '25%' }}>
          <EuiCard
            title={title}
            icon={<EuiIcon type={getIcon({ host })} size={'xl'} />}
            description={(<EuiDescriptionList listItems={getDescriptionList({ host, name })}/>)}
            {...nav}
          />
        </EuiFlexItem>
        ))}
      </EuiFlexGroup>
    </EuiPageTemplate.Section>
  )
}

export default HomePage
