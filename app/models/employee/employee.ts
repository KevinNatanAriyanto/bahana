import { Instance, SnapshotOut, types } from "mobx-state-tree"

/**
 * Model description here for TypeScript hints.
 */
export const EmployeeModel = types
  .model("Employee")
  .props({
    id: types.maybe(types.integer),
    address: types.maybeNull(types.string),
    permission: types.maybeNull(types.string),
    permission_require: types.maybeNull(types.string),
    office_start_time: types.maybeNull(types.string),
    office_end_time: types.maybeNull(types.string),
    latitude: types.maybeNull(types.string),
    longitude: types.maybeNull(types.string),
    option_employee: types.maybeNull(types.string),
    atur_tugas: types.maybeNull(types.string),
    menambahkan_pengumuman: types.maybeNull(types.string),
    karyawan_khusus: types.maybeNull(types.string),
    additional_field: types.maybeNull(types.string),
    joining_date: types.maybeNull(types.string),
    no_notification: types.maybeNull(types.integer),
    no_notification_start: types.maybeNull(types.string),
    no_notification_end: types.maybeNull(types.string),
    is_abk: types.maybeNull(types.integer),
    is_pc: types.maybeNull(types.integer),
    is_hrd_kapal: types.maybeNull(types.integer),
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

type EmployeeType = Instance<typeof EmployeeModel>
export interface Employee extends EmployeeType {}
type EmployeeSnapshotType = SnapshotOut<typeof EmployeeModel>
export interface EmployeeSnapshot extends EmployeeSnapshotType {}
