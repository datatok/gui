import { EuiCard, EuiFlexGroup, EuiFlexItem, EuiSpacer, EuiText } from "@elastic/eui";
import { FC } from "react";
import { Route, useRoutingNavigate } from "services/routing";
import { GuiBucket } from "types";

interface Props {
  bucket: GuiBucket
}

const DetailsPage: FC<Props> = ({ bucket }) => {
  const navigate = useRoutingNavigate()

  return (
    <div>
      <EuiText><h2>{bucket.name}</h2></EuiText>
      <EuiSpacer />
      
    </div>
  )
}

export default DetailsPage