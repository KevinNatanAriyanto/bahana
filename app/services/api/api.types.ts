import { GeneralApiProblem } from "./api-problem"

export interface AppDefault {
	
}

export interface User {
  id: number
  name: string
}

export type GetDefaultArrayResult = { kind: "ok"; data: [] } | GeneralApiProblem
export type GetDefaultResult = { kind: "ok"; data: AppDefault } | GeneralApiProblem
export type GetUsersResult = { kind: "ok"; users: User[] } | GeneralApiProblem
export type GetUserResult = { kind: "ok"; user: User } | GeneralApiProblem
