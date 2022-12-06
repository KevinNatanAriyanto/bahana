import { Instance, SnapshotOut, types, getSnapshot } from "mobx-state-tree"

/**
 * Model description here for TypeScript hints.
 */
export const JobModel = types
  .model("Job")
  .props({
    // id: types.identifier,
    key: types.maybe(types.string),

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

type JobType = Instance<typeof JobModel>
export interface Job extends JobType {}
type JobSnapshotType = SnapshotOut<typeof JobModel>
export interface JobSnapshot extends JobSnapshotType {}

// export type User = Instance<typeof UserModel>
// export type UserSnapshot = SnapshotOut<typeof UserModel>

/*
type UserStoreType = Instance<typeof UserStore>
export interface UserStore extends UserStoreType {}
type UserStoreSnapshotType = SnapshotOut<typeof UserStore>
export interface UserStoreSnapshot extends UserStoreSnapshotType {}

// export default UserStore;
*/