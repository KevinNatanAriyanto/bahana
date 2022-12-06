import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { TaskModel } from "@models/task"
import { ProjectModel } from "@models/project"
import { UserModel } from "@models/user"

/**
 * Model description here for TypeScript hints.
 */
export const TimelogModel = types
  .model("Timelog")
  .props({
    id: types.maybe(types.integer),
    company_id: types.maybeNull(types.integer),
    project_id: types.maybeNull(types.integer),
    task_id: types.maybeNull(types.integer),
    user_id: types.maybeNull(types.integer),
    start_time: types.maybeNull(types.string),
    end_time: types.maybeNull(types.string),
    status: types.maybeNull(types.string),
    checker_user_id: types.maybeNull(types.integer),
    latitude: types.maybeNull(types.string),
    longitude: types.maybeNull(types.string),
    task_done: types.maybeNull(types.integer),
    image_full_path: types.maybeNull(types.string),
    image: types.maybeNull(types.string),
    memo: types.maybeNull(types.string),
    total_hours: types.maybeNull(types.string),
    total_minutes: types.maybeNull(types.string),
    reason: types.maybeNull(types.string),
    hours: types.maybeNull(types.string),
    duration: types.maybeNull(types.string),
    timer: types.maybeNull(types.string),
    list_comments: types.maybeNull(types.string),

    user: types.maybeNull(UserModel),
    // task: types.maybeNull(types.array(TaskModel, [])),
    project: types.maybeNull(ProjectModel),

    is_sync: types.maybeNull(types.boolean),

    created_at: types.maybe(types.string),
    updated_at: types.maybe(types.string),
  })
  .views(self => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions(self => ({
    update(key, value){
      self[key] = value
    },
    findLogAfterTime(time){
      if(moment(time).isSameOrAfter(self.end_time)){
        return self
      }
    }

  })) // eslint-disable-line @typescript-eslint/no-unused-vars

  /**
  * Un-comment the following to omit model attributes from your snapshots (and from async storage).
  * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

  * Note that you'll need to import `omit` from ramda, which is already included in the project!
  *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
  */

type TimelogType = Instance<typeof TimelogModel>
export interface Timelog extends TimelogType {}
type TimelogSnapshotType = SnapshotOut<typeof TimelogModel>
export interface TimelogSnapshot extends TimelogSnapshotType {}
