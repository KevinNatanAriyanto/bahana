import { Instance, SnapshotOut, types } from "mobx-state-tree"

/**
 * Model description here for TypeScript hints.
 */
export const OfficeModel = types
  .model("Office")
  .props({
    id: types.maybe(types.integer),
    company_id: types.maybeNull(types.integer),
    wfh: types.maybeNull(types.boolean),
    wifi: types.maybeNull(types.array(types.model({
      id: types.maybeNull(types.integer),
      office_id: types.maybeNull(types.integer),
      name: types.maybeNull(types.string),
      bssid: types.maybeNull(types.string),
      created_at: types.maybeNull(types.string),
      updated_at: types.maybeNull(types.string),
    }))),
    radius: types.maybeNull(types.integer),
    latitude: types.maybeNull(types.string),
    longitude: types.maybeNull(types.string),
    name: types.maybeNull(types.string),
    code: types.maybeNull(types.string),
    latitude: types.maybeNull(types.string),
    longitude: types.maybeNull(types.string),
    jam_istirahat_awal: types.maybeNull(types.string),
    jam_istirahat_akhir: types.maybeNull(types.string),
    data: types.maybe(types.string),

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

type OfficeType = Instance<typeof OfficeModel>
export interface Office extends OfficeType {}
type OfficeSnapshotType = SnapshotOut<typeof OfficeModel>
export interface OfficeSnapshot extends OfficeSnapshotType {}
