import { Instance, SnapshotOut, types } from "mobx-state-tree"

/**
 * Model description here for TypeScript hints.
 */
export const ShipScheduleModel = types
  .model("ShipSchedule")
  .props({
    id: types.maybe(types.integer),    
    user_id: types.maybeNull(types.integer),
    kapal_id: types.maybeNull(types.integer),
    date_start: types.maybeNull(types.string),
    date_end: types.maybeNull(types.string),
    status: types.maybeNull(types.string),
    kapal_name: types.maybeNull(types.string),
    code: types.maybeNull(types.string),
    created_by: types.maybeNull(types.integer),

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

type ShipScheduleType = Instance<typeof ShipScheduleModel>
export interface ShipSchedule extends ShipScheduleType {}
type ShipScheduleSnapshotType = SnapshotOut<typeof ShipScheduleModel>
export interface ShipScheduleSnapshot extends ShipScheduleSnapshotType {}
