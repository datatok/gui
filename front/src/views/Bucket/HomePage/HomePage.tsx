import { EuiCard, EuiFlexGroup, EuiFlexItem, EuiIcon, EuiPage, EuiPageTemplate, EuiSpacer, EuiText } from "@elastic/eui";
import { useBucketContext } from "providers/BucketContext";
import { FC } from "react";
import { Route, useRoutingNavigate } from "services/routing";
import { GuiBucket } from "types";

const HomePage: FC = () => {
  /**
   * context
   */
  const { buckets } = useBucketContext()

  const navigate = useRoutingNavigate()

  return (
    <EuiPageTemplate>
      <EuiPageTemplate.Header pageTitle="Please select a bucket"></EuiPageTemplate.Header>
      <EuiPageTemplate.Section>
        <EuiSpacer />
        <EuiFlexGroup gutterSize="l">
          {buckets.map(({name, host, id}, index) => (
            <EuiFlexItem key={index}>
            <EuiCard
              title={name}
              icon={<EuiIcon type={'storage'} size={'xl'} />}
              description={`host: ${host}`}
              onClick={() => {
                navigate(Route.BucketHome, { bucket: id })
              }}
            />
          </EuiFlexItem>
          ))}
        </EuiFlexGroup>
      </EuiPageTemplate.Section>
    </EuiPageTemplate>
  )
}

export default HomePage