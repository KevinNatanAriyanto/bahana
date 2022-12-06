import { Instance, SnapshotOut, types, getSnapshot } from "mobx-state-tree"

/**
 * Model description here for TypeScript hints.
 */
export const UserModel = types
  .model("User")
  .props({
    // id: types.identifier,
    id: types.maybe(types.integer),
    // company_id: types.maybeNull(types.integer),
    name: types.maybeNull(types.string),
    email: types.maybeNull(types.string),
    image: types.maybeNull(types.string),
    mobile: types.maybeNull(types.string),
    gender: types.maybeNull(types.string),
    locale: types.maybeNull(types.string),
    status: types.maybeNull(types.string),
    login: types.maybeNull(types.string),
    super_admin: types.maybeNull(types.string),
    email_verification_code: types.maybeNull(types.string),
    unreadNotifications: types.maybeNull(types.string),
    image_url: types.maybeNull(types.string),
    modules: types.maybeNull(types.string),
    roles: types.maybeNull(types.string),
    role: types.maybeNull(types.string),
    user_other_role: types.maybeNull(types.string),
    access_token: types.maybeNull(types.string),
    data: types.maybeNull(types.string),
    expires: types.maybeNull(types.string),
    expires_in: types.maybeNull(types.integer),
    permissions: types.maybeNull(types.string),

    employee: types.maybeNull(types.model({
      department_id: types.maybeNull(types.integer),
      wilayah_id: types.maybeNull(types.integer),
      sub_company_id: types.maybeNull(types.integer),
      designation_id: types.maybeNull(types.integer),
      cabang_id: types.maybeNull(types.integer),
      cluster_working_hour_id: types.maybeNull(types.integer),
      office_id: types.maybeNull(types.integer),
      is_abk: types.maybeNull(types.integer),
      is_pc: types.maybeNull(types.integer),
      is_pe: types.maybeNull(types.integer),
      is_hrd_kapal: types.maybeNull(types.integer),
      is_atasan: types.maybeNull(types.integer),
    })),

    onesignal_player_id: types.maybeNull(types.string),
    created_at: types.maybe(types.string),
    updated_at: types.maybe(types.string),

  })
  .views(self => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions(self => ({
    

  })) // eslint-disable-line @typescript-eslint/no-unused-vars

/*
export const UserStore = types
  .model("UserStore")
  .props({
    currentUser: types.array(User),
    // currentUser: types.maybe(types.reference(User)),
  })
  .views(self => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions(self => ({
    setCurrentUser(param, data){
      eval("self.currentUser."+param+ "= data");
    },
    showCurrentUser(param){
      eval("return self.currentUser."+param);
    },
    getCurrentUser(){
      return self.currentUser;
      // return getSnapshot(self.currentUser)
    },
    doRegister(){

    },
    setLoginUser(data){

    },
    loadUserStorage(){

    }

  })) // eslint-disable-line @typescript-eslint/no-unused-vars
  // .create({
  //   currentUser: []
  // })

  /**
  * Un-comment the following to omit model attributes from your snapshots (and from async storage).
  * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

  * Note that you'll need to import `omit` from ramda, which is already included in the project!
  *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
  */

type UserType = Instance<typeof UserModel>
export interface User extends UserType {}
type UserSnapshotType = SnapshotOut<typeof UserModel>
export interface UserSnapshot extends UserSnapshotType {}

// export type User = Instance<typeof UserModel>
// export type UserSnapshot = SnapshotOut<typeof UserModel>

/*
type UserStoreType = Instance<typeof UserStore>
export interface UserStore extends UserStoreType {}
type UserStoreSnapshotType = SnapshotOut<typeof UserStore>
export interface UserStoreSnapshot extends UserStoreSnapshotType {}

// export default UserStore;
*/