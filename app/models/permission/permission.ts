import { Instance, SnapshotOut, types } from "mobx-state-tree"

/**
 * Model description here for TypeScript hints.
 */
export const PermissionModel = types
  .model("Permission")
  .props({
    id: types.maybe(types.integer),
    karyawan_khusus: types.maybeNull(types.string),
    edit_lat_long: types.maybeNull(types.string),
    report_task: types.maybeNull(types.string),
    list_tugas: types.maybeNull(types.string),
    create_tugas: types.maybeNull(types.string),
    edit_tugas: types.maybeNull(types.string),
    delete_tugas: types.maybeNull(types.string),
    list_proyek: types.maybeNull(types.string),
    create_proyek: types.maybeNull(types.string),
    edit_proyek: types.maybeNull(types.string),
    delete_proyek: types.maybeNull(types.string),
    list_pengumuman: types.maybeNull(types.string),
    create_pengumuman: types.maybeNull(types.string),
    edit_pengumuman: types.maybeNull(types.string),
    delete_pengumuman: types.maybeNull(types.string),
    list_ticket: types.maybeNull(types.string),
    create_ticket: types.maybeNull(types.string),
    edit_ticket: types.maybeNull(types.string),
    delete_ticket: types.maybeNull(types.string),
    reply_ticket: types.maybeNull(types.string),
    is_required_absence: types.maybeNull(types.string),

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

type PermissionType = Instance<typeof PermissionModel>
export interface Permission extends PermissionType {}
type PermissionSnapshotType = SnapshotOut<typeof PermissionModel>
export interface PermissionSnapshot extends PermissionSnapshotType {}
