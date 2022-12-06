import { Instance, SnapshotOut, types, getSnapshot } from "mobx-state-tree"
import { UserModel } from "@models/user"
import { TimelogModel } from "@models/timelog"

/**
 * Model description here for TypeScript hints.
 */
export const TaskModel = types
  .model("Task")
  .props({
    // id: types.identifier,
    id: types.maybe(types.integer),
    dependent_task_id: types.maybeNull(types.integer),
    heading: types.maybeNull(types.string),
    description: types.maybeNull(types.string),
    start_date: types.maybeNull(types.string),
    due_date: types.maybeNull(types.string),
    status: types.maybeNull(types.string),
    board_column_id: types.maybeNull(types.integer),
    is_requires_gps: types.maybeNull(types.integer),
    is_requires_camera: types.maybeNull(types.integer),
    is_private: types.maybeNull(types.integer),
    total_working_time: types.maybeNull(types.integer),
    interval_report: types.maybeNull(types.integer),
    assignee_user_id: types.maybeNull(types.integer),
    cc_user_id: types.maybeNull(types.string),
    project_id: types.maybeNull(types.integer),
    due_on: types.maybeNull(types.string),
    create_on: types.maybeNull(types.string),
    users: types.array(UserModel, []),
    is_meeting: types.maybeNull(types.string),
    // timelog: types.array(TimelogModel, []),
    project: types.maybeNull(types.model({
      project_name: types.maybeNull(types.string),
    })),
    create_by: types.maybeNull(types.model({
      id: types.maybeNull(types.integer),
      name: types.maybeNull(types.string),
    })),
    taskboard_columns: types.maybeNull(types.model({
      slug: types.maybeNull(types.integer),
      column_name: types.maybeNull(types.string),
      slug: types.maybeNull(types.string),
    })),
    history: types.array(types.model({
      user_id: types.maybeNull(types.integer),
      board_column_id: types.maybeNull(types.integer),
      details: types.maybeNull(types.string),
      activity_log: types.maybeNull(types.string),
      date_time: types.maybeNull(types.string),
    }), []),
    files: types.array(types.model({
      id: types.maybeNull(types.integer),
      hashname: types.maybeNull(types.string),
      filename: types.maybeNull(types.string),
      file_url: types.maybeNull(types.string),
    }), []),

    time_log_active: types.maybeNull(types.model({
      id: types.maybeNull(types.integer),
      status: types.maybeNull(types.string),
      user_id: types.maybeNull(types.integer),
    })),
    is_sync: types.maybeNull(types.boolean),

    created: types.maybe(types.string),
    updated: types.maybe(types.string),

  })
  .views(self => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions(self => ({
    update(key, value){
      self[key] = value
    },
    startWorking(){
      self.time_log_active = {
        status: 'active'
      }
    },
    stopWorking(){
      self.time_log_active = null
    }

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

type TaskType = Instance<typeof TaskModel>
export interface Task extends TaskType {}
type TaskSnapshotType = SnapshotOut<typeof TaskModel>
export interface TaskSnapshot extends TaskSnapshotType {}

// export type User = Instance<typeof UserModel>
// export type UserSnapshot = SnapshotOut<typeof UserModel>

/*
type UserStoreType = Instance<typeof UserStore>
export interface UserStore extends UserStoreType {}
type UserStoreSnapshotType = SnapshotOut<typeof UserStore>
export interface UserStoreSnapshot extends UserStoreSnapshotType {}

// export default UserStore;
*/