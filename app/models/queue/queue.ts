import { Instance, SnapshotOut, types } from "mobx-state-tree"

/**
 * Model description here for TypeScript hints.
 */
export const QueueModel = types
  .model("Queue")
  .props({
    id: types.maybe(types.integer),
    type: types.maybeNull(types.string),
    description: types.maybeNull(types.string),
    action: types.maybeNull(types.string),
    data: types.maybeNull(types.string),
    status: types.maybeNull(types.string),
    related_id: types.maybeNull(types.integer),
    running_times: types.optional(types.integer, 0),
    will_update: types.maybeNull(types.string),

    created_at: types.maybeNull(types.string),
    updated_at: types.maybeNull(types.string),
  })
  .views(self => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions(self => ({
    update(key, value){
      self[key] = value
    },

    async sync(rootstore){

      console.log('running queue!')
      console.log(self)

      self.update("status", "running")

      // increment running times
      self.update("running_times", (self.running_times + 1))

      // var result = await RootStoreModel[self.action](JSON.parse(self.data));
      eval("var act = rootstore."+self.action)
      // var response = await act(JSON.parse(self.data)).then(() => {

      var data = JSON.parse(self.data);
      if(data._parts){
        // data = data._parts;
        var form_data = new FormData();
        // for ( var key in data._parts ) {
        //     form_data.append(key, data._parts[key]);
        // }

        for(var p in data._parts){
          form_data.append(data._parts[p][0], data._parts[p][1]);
        }

        data = form_data;
      }

      var response = await act(data);
      if(response.kind == "ok"){
        self.update("status", null)

        if(response.data && response.data.error){
          return false
        }

        return true
      }else{

        // on failing, reset the status
        // self.status = null;
        self.update("status", null)
        return false
      }
    }
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

  /**
  * Un-comment the following to omit model attributes from your snapshots (and from async storage).
  * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

  * Note that you'll need to import `omit` from ramda, which is already included in the project!
  *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
  */

type QueueType = Instance<typeof QueueModel>
export interface Queue extends QueueType {}
type QueueSnapshotType = SnapshotOut<typeof QueueModel>
export interface QueueSnapshot extends QueueSnapshotType {}
