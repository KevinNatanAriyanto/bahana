import { Instance, SnapshotOut, types } from "mobx-state-tree"

/**
 * Model description here for TypeScript hints.
 */
export const GpsModel = types
  .model("Gps")
  .props({
    id: types.maybe(types.integer),
    mockLocationsEnabled: types.maybeNull(types.boolean),
    isFromMockProvider: types.maybeNull(types.boolean),
    radius: types.maybeNull(types.number),
    altitude: types.maybeNull(types.number),
    accuracy: types.maybeNull(types.number),
    longitude: types.maybeNull(types.number),
    latitude: types.maybeNull(types.number),
    time: types.maybeNull(types.number),
    locationProvider: types.maybeNull(types.integer),
    provider: types.maybeNull(types.string),
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

type GpsType = Instance<typeof GpsModel>
export interface Gps extends GpsType {}
type GpsSnapshotType = SnapshotOut<typeof GpsModel>
export interface GpsSnapshot extends GpsSnapshotType {}
