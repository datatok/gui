import axios from "axios"
import { SiteContext } from "providers/Site/context"
import React from "react"

const apiServer = "http://localhost:3001"

export const get = <T>(pathURL: string) => {
  const fullURL = `${apiServer}${pathURL}`

  const apiAccessToken = React.useContext(SiteContext).apiAccessToken

  return axios.get<T>(fullURL, {
    headers: {
      Authorization: "Bearer " + apiAccessToken
   }
  })
}

export const post = <T>(pathURL: string, data: any) => {
  const fullURL = `${apiServer}${pathURL}`
  return axios.post<T>(fullURL, data)
}