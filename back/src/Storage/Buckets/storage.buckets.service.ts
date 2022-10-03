import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as R from 'ramda'

@Injectable()
export class BucketsProviderService {

  private buckets:StorageBucket[]

  private bucketsByID: {[key:string]:StorageBucket}

  constructor(private configService: ConfigService) {
    const storageConfig = this.configService.get<StorageConfig>('storage')

    const endpointsByName: {[key:string]:StorageEndpointConfig}  = R.indexBy(R.prop('name'), storageConfig.endpoints)
    const authsByName: {[key:string]:StorageAuthConfig} = R.indexBy(R.prop('name'), storageConfig.auth)

    this.buckets = storageConfig.buckets.map(b => {
      let ret: StorageBucket = {
        name: b.name,
        id: b.name,
        region: b.region,
      }

      if (b.endpoint) {
        const _endpoint = endpointsByName[b.endpoint]

        ret = {
          ...ret,
          id: `${b.endpoint}-${b.name}`,
          region: b.region || _endpoint?.region,
          endpoint: {
            hostname: _endpoint?.hostname || _endpoint?.host,
            path: _endpoint?.path,
            protocol: _endpoint?.protocol,
            port: _endpoint?.port
          }
        }
      }

      if (b.auth) {
        const _auth = authsByName[b.auth]

        ret = {
          ...ret,
          auth : {
            name: _auth?.name,
            accessKey: _auth?.basic.accessKey,
            secretKey: _auth?.basic.secretKey
          }
        }
      }

      return ret
    })

    this.bucketsByID = R.indexBy(R.prop('id'), this.buckets)
  }

  public findAll(): StorageBucket[] {
    return this.buckets
  }

  public findByID(id: string): StorageBucket {
    return this.bucketsByID[id]
  }
}
