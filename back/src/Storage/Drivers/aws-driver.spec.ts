import { ListObjectsCommand, S3Client } from '@aws-sdk/client-s3';
import { mockClient } from 'aws-sdk-client-mock';
import { AWSStorageDriver } from './aws-driver';

describe('AWSStorageService', () => {

  it("listing objects", async () => {
    const driver = new AWSStorageDriver({
      name: "gui",
    })

    jest.spyOn(driver.getClient(), 'send').mockImplementation((command:ListObjectsCommand) => {
      return new Promise((resolve, reject) => {
        resolve({
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
                "ChecksumAlgorithm":"undefined",
                "ETag":"\"4a1c0e1133dbda6f6e8f3e60d984eddf\"",
                "Key":"app.controller.spec.ts",
                "LastModified":"2022-09-30T01:53:06.801Z",
                "Owner":{
                   "DisplayName":"minio",
                   "ID":"02d6176db174dc93cb1b899f7c6078f08654445fe8cf1b6ce98d8855f66bdbf4"
                },
                "Size":617,
                "StorageClass":"STANDARD"
             },
             {
                "ChecksumAlgorithm":"undefined",
                "ETag":"\"3ab0e83b7d93b85ea489ab994ec79ea1\"",
                "Key":"app.controller.ts",
                "LastModified":"2022-09-30T01:53:06.803Z",
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
          "Marker":"",
          "MaxKeys":1000,
          "Name":"gui",
          "Prefix":""
       })
      })
    })

    const results = await driver.listObjects("/")

    expect(results).toStrictEqual([{
      name: 'Bucket/',
      type: "folder"
    }, {
      name: 'Security/',
      type: "folder"
    }, {
      name: 'app.controller.spec.ts',
      type: "file",
      editDate: "2022-09-30T01:53:06.801Z",
      size: 617
    }, {
      name: 'app.controller.ts',
      type: "file",
      editDate: "2022-09-30T01:53:06.803Z",
      size: 274
    }])
  })

  it('remove prefix', async () => {
   mockClient(S3Client).on(ListObjectsCommand).resolvesOnce({
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
      {"name": "Bucket/", "type": "folder"},
      {"editDate": undefined, "name": "app.controller.spec.ts", "size": 617, "type": "file"}
   ])



  })
})