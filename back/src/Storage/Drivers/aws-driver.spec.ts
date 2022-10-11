import { ListObjectsCommand, ListObjectsV2Command, S3Client } from '@aws-sdk/client-s3';
import { mockClient } from 'aws-sdk-client-mock';
import { AWSStorageDriver } from './aws-driver';
import { v4 as uuidv4 } from 'uuid';

const getLocalAWSDriver = () => {
  return new AWSStorageDriver({
    name: "gui",
    region: 'us-east-1',
    endpoint: {
      hostname: 'localhost',
      port: 9000,
      protocol: 'http',
      path: ''
    },
    auth: {
      accessKey: 'root',
      secretKey: 'rootroot'
    }
  })
}

describe('AWSStorageService', () => {

  it("listing objects", async () => {
    const driver = new AWSStorageDriver({
      name: "gui",
    })

    mockClient(S3Client).on(ListObjectsV2Command).resolvesOnce({
      "$metadata":{
         "attempts":1,
         "cfId":"undefined",
         "extendedRequestId":"undefined",
         "httpStatusCode":200,
         "requestId":"undefined",
         "totalRetryDelay":0
      },
      "CommonPrefixes":[
         {
            "Prefix":"Bucket/"
         },
         {
            "Prefix":"Security/"
         }
      ],
      "Contents":[
         {
            "ETag":"\"4a1c0e1133dbda6f6e8f3e60d984eddf\"",
            "Key":"app.controller.spec.ts",
            "LastModified" : new Date("2022-09-30T01:53:06.801Z"),
            "Owner":{
               "DisplayName":"minio",
               "ID":"02d6176db174dc93cb1b899f7c6078f08654445fe8cf1b6ce98d8855f66bdbf4"
            },
            "Size":617,
            "StorageClass":"STANDARD"
         },
         {
            "ETag":"\"3ab0e83b7d93b85ea489ab994ec79ea1\"",
            "Key":"app.controller.ts",
            "Owner":{
               "DisplayName":"minio",
               "ID":"02d6176db174dc93cb1b899f7c6078f08654445fe8cf1b6ce98d8855f66bdbf4"
            },
            "Size":274,
            "StorageClass":"STANDARD"
         }
      ],
      "Delimiter":"/",
      "IsTruncated":false,
      "MaxKeys":1000,
      "Name":"gui",
      "Prefix":""
   })

   const results = await driver.listObjects("/")

   expect(results).toStrictEqual([{
      name: 'Bucket',
      type: "folder"
    }, {
      name: 'Security',
      type: "folder"
    }, {
      name: 'app.controller.spec.ts',
      type: "file",
      editDate: new Date("2022-09-30T01:53:06.801Z"),
      size: 617
    }, {
      name: 'app.controller.ts',
      type: "file",
      editDate: undefined,
      size: 274
    }])
  })

  it('remove prefix', async () => {
   mockClient(S3Client).on(ListObjectsV2Command).resolvesOnce({
      "$metadata":{
      },
      "CommonPrefixes":[
         {
            "Prefix":"Bucket/"
         },
      ],
      "Contents":[
         {
            "Key":"app.controller.spec.ts",
            "Size":617,
            "StorageClass":"STANDARD"
         },
      ]
   })

   const driver = new AWSStorageDriver({
      name: "gui",
    })

   expect(await driver.listObjects('/')).toEqual([
      {"name": "Bucket", "type": "folder"},
      {"editDate": undefined, "name": "app.controller.spec.ts", "size": 617, "type": "file"}
   ])



  })

  it('create folder and list it', async() => {
    const driver = getLocalAWSDriver()
    const rootPrefix = `__root__${uuidv4()}`

    const res = await driver.createFolder(rootPrefix)

    expect(res.path).toEqual(rootPrefix)
    expect(res.results?.$metadata?.httpStatusCode).toEqual(200)
    
    const objects = await driver.listObjectsRecursive(`${rootPrefix}/`)

    expect(objects).toHaveLength(1)
    expect(objects[0].Key).toBe(`${rootPrefix}/__meta.md`)
  })

  it('remove simple multi keys', async() => {
    const driver = getLocalAWSDriver()
    const rootPrefix = `__root__${uuidv4()}`

    let res = await driver.listObjectsRecursive(rootPrefix)

    expect(res).toHaveLength(0)

    let cRes = await driver.createFolder(`${rootPrefix}/remove/simple`)
    console.log(cRes)
    expect(cRes.results.$metadata.httpStatusCode).toEqual(200)
    

    cRes = await driver.createFolder(`${rootPrefix}/remove/hello/world`)
    console.log(cRes)
    expect(cRes.results.$metadata.httpStatusCode).toEqual(200)

    res = await driver.listObjectsRecursive(rootPrefix)

    expect(res).toHaveLength(2)

    res = await driver.deleteKeys([`${rootPrefix}/remove/`])

    const s = (a, b) => a.key.localeCompare(b.key)

    expect(res.sort(s)).toStrictEqual([
      { status: 200, key: `${rootPrefix}/remove/simple/__meta.md` },
      { status: 200, key: `${rootPrefix}/remove/hello/world/__meta.md` },
    ].sort(s))

    res = await driver.listObjectsRecursive(rootPrefix)

    expect(res).toHaveLength(0)
  })
})