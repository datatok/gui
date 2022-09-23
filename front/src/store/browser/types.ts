export type GuiBrowserFile = {
  name: string
  path: string
  type: string
  children?: GuiBrowserFile[]
  parent?: GuiBrowserFile
}

export type GuiBrowserFileReadonly = {
  readonly name: string
  readonly path: string
  readonly type: string
  readonly children?: Readonly<GuiBrowserFileReadonly[]>
  readonly parent?: Readonly<GuiBrowserFileReadonly>
}