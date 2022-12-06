import { Instance, SnapshotOut, types } from "mobx-state-tree"

/**
 * Model description here for TypeScript hints.
 */
export const ClusterModel = types
  .model("Cluster")
  .props({
    id: types.maybe(types.integer),
    company_id: types.maybeNull(types.integer),
    type: types.maybeNull(types.string),
    name: types.maybeNull(types.string),
    start_hour: types.maybeNull(types.string),
    end_hour: types.maybeNull(types.string),
    json: types.maybeNull(types.string),
    jadwal_today: types.maybeNull(types.model({
      jam_masuk: types.maybeNull(types.string),
      jam_pulang: types.maybeNull(types.string),
    })),
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

type ClusterType = Instance<typeof ClusterModel>
export interface Cluster extends ClusterType {}
type ClusterSnapshotType = SnapshotOut<typeof ClusterModel>
export interface ClusterSnapshot extends ClusterSnapshotType {}
