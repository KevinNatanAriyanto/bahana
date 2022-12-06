import { Instance, SnapshotOut, types } from "mobx-state-tree"
import Reactotron from 'reactotron-react-native';

/**
 * Model description here for TypeScript hints.
 */
export const SettingsModel = types
  .model("Settings")
  .props({
    application_version: types.maybeNull(types.string),
    update_version: types.maybeNull(types.string),
    radius_tracking: types.maybeNull(types.string),
    bypass_store_gps_cluster: types.maybeNull(types.string),
    offline_mode: types.maybeNull(types.boolean),
    data: types.maybe(types.string),
  })
  .views(self => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions(self => ({
    resetOfflineMode(){
      self.offline_mode = null
    }
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

  /**
  * Un-comment the following to omit model attributes from your snapshots (and from async storage).
  * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

  * Note that you'll need to import `omit` from ramda, which is already included in the project!
  *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
  */

type SettingsType = Instance<typeof SettingsModel>
export interface Settings extends SettingsType {}
type SettingsSnapshotType = SnapshotOut<typeof SettingsModel>
export interface SettingsSnapshot extends SettingsSnapshotType {}
