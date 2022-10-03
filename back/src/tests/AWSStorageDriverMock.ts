import { S3Client } from "@aws-sdk/client-s3";
import { mockClient } from "aws-sdk-client-mock";
import { AWSStorageDriver } from "src/Storage/Drivers/aws-driver";

class AWSStorageDriverMock extends AWSStorageDriver {
  public clientMock

  public constructor(bucket: StorageBucket) {
    super(bucket)

    this.clientMock = mockClient(this.client)
  }
}