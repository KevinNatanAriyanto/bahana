import { Instance, SnapshotOut, types } from "mobx-state-tree"

/**
 * Model description here for TypeScript hints.
 */
export const LeaveModel = types
  .model("Leave")
  .props({
    id: types.maybe(types.integer),
    company_id: types.maybeNull(types.integer),
    user_id: types.maybeNull(types.integer),
    type_name: types.maybeNull(types.string),
    leave_type_id: types.maybeNull(types.integer),
    leave_date: types.maybeNull(types.string),
    leave_date_end: types.maybeNull(types.string),
    reason: types.maybeNull(types.string),
    is_sakit: types.maybeNull(types.string),
    status: types.maybeNull(types.string),
    masking_status: types.maybeNull(types.string),
    start_hour: types.maybeNull(types.string),
    end_hour: types.maybeNull(types.string),
    date: types.maybeNull(types.string),
    
    // child: types.maybeNull(types.string),
    child: types.maybeNull(types.model({
      start_hour: types.maybeNull(types.string),
      end_hour: types.maybeNull(types.string),
      destination: types.maybeNull(types.string),
      is_done: types.maybeNull(types.integer),
    })),

    data: types.maybe(types.string),
    is_sync: types.maybeNull(types.boolean),

    created_at: types.maybe(types.string),
    updated_at: types.maybe(types.string),
  })
  .views(self => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions(self => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars

  /**
  * Un-comment the following to omit model attributes from your snapshots (and from async storage).
  * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

  * Note that you'll need to import `omit` from ramda, which is already included in the project!
  *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
  */

type LeaveType = Instance<typeof LeaveModel>
export interface Leave extends LeaveType {}
type LeaveSnapshotType = SnapshotOut<typeof LeaveModel>
export interface LeaveSnapshot extends LeaveSnapshotType {}
