import { EuiCard, EuiFlexGroup, EuiFlexItem, EuiSpacer, EuiText } from "@elastic/eui";
import { FC } from "react";
import { Route, useRoutingNavigate } from "services/routing";
import { GuiBucket } from "types";

interface Props {
  buckets: GuiBucket[]
}

const HomePage: FC<Props> = ({ buckets }) => {
  const navigate = useRoutingNavigate()

  return (
    <div>
      <EuiText><h2>Please select a bucket:</h2></EuiText>
      <EuiSpacer />
      <EuiFlexGroup gutterSize="l">
        {buckets.map(({name, host, id}, index) => (
          <EuiFlexItem key={index}>
          <EuiCard
            title={name}
            description={`host: ${host}`}
            onClick={() => {
              navigate(Route.BucketHome, { bucket: id })
            }}
          />
        </EuiFlexItem>
        ))}
      </EuiFlexGroup>
    </div>
  )
}

export default HomePage