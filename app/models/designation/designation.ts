import { Instance, SnapshotOut, types } from "mobx-state-tree"

/**
 * Model description here for TypeScript hints.
 */
export const DesignationModel = types
  .model("Designation")
  .props({
    id: types.maybe(types.integer),
    company_id: types.maybeNull(types.integer),
    check_late: types.maybeNull(types.integer),
    name: types.maybeNull(types.string),

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

type DesignationType = Instance<typeof DesignationModel>
export interface Designation extends DesignationType {}
type DesignationSnapshotType = SnapshotOut<typeof DesignationModel>
export interface DesignationSnapshot extends DesignationSnapshotType {}
