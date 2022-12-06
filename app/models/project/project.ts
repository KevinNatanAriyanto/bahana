import { Instance, SnapshotOut, types } from "mobx-state-tree"

/**
 * Model description here for TypeScript hints.
 */
export const ProjectModel = types
  .model("Project")
  .props({
    id: types.maybe(types.integer),
    project_name: types.maybeNull(types.string),
    project_summary: types.maybeNull(types.string),
    start_date: types.maybeNull(types.string),
    status: types.maybeNull(types.string),

    team_id: types.maybeNull(types.integer),
    category_id: types.maybeNull(types.integer),
    wilayah_id: types.maybeNull(types.integer),
    subcompany_id: types.maybeNull(types.integer),

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

type ProjectType = Instance<typeof ProjectModel>
export interface Project extends ProjectType {}
type ProjectSnapshotType = SnapshotOut<typeof ProjectModel>
export interface ProjectSnapshot extends ProjectSnapshotType {}
