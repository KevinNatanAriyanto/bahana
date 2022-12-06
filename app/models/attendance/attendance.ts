import { Instance, SnapshotOut, types } from "mobx-state-tree"

/**
 * Model description here for TypeScript hints.
 */
export const AttendanceModel = types
  .model("Attendance")
  .props({
    id: types.maybe(types.integer),
    company_id: types.maybeNull(types.integer),
    user_id: types.maybeNull(types.integer),
    clock_in_time: types.maybeNull(types.string),
    clock_out_time: types.maybeNull(types.string),
    clock_out_from: types.maybeNull(types.string),
    clock_in_latitude: types.maybeNull(types.string),
    clock_in_longitude: types.maybeNull(types.string),
    clock_out_latitude: types.maybeNull(types.string),
    clock_out_latitude: types.maybeNull(types.string),
    clock_out_longitude: types.maybeNull(types.string),
    
    // clock_in_image: types.maybeNull(types.string),
    // clock_out_image: types.maybeNull(types.string),

    clock_in_image: types.maybeNull(types.model({
      uri: types.maybeNull(types.string),
      name: types.maybeNull(types.string),
      type: types.maybeNull(types.string),
    })),
    clock_out_image: types.maybeNull(types.model({
      uri: types.maybeNull(types.string),
      name: types.maybeNull(types.string),
      type: types.maybeNull(types.string),
    })),
    
    working_from: types.maybeNull(types.string),
    clock_in_date: types.maybeNull(types.string),
    late: types.maybeNull(types.string),
    half_day: types.maybeNull(types.string),
    status: types.maybeNull(types.integer),
    
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

type AttendanceType = Instance<typeof AttendanceModel>
export interface Attendance extends AttendanceType {}
type AttendanceSnapshotType = SnapshotOut<typeof AttendanceModel>
export interface AttendanceSnapshot extends AttendanceSnapshotType {}
