import { Instance, SnapshotOut, types, getSnapshot } from "mobx-state-tree"

/**
 * Model description here for TypeScript hints.
 */
export const CartItemModel = types
  .model("CartItem")
  .props({
    id: types.maybe(types.string),
    type: types.maybe(types.string),
    image: types.maybe(types.string),
    title: types.maybe(types.string),
    description: types.maybe(types.string),
    quantity: types.maybe(types.number),
    price: types.maybe(types.number),
    data: types.maybe(types.string),

  })
  .views(self => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions(self => ({
    

  })) // eslint-disable-line @typescript-eslint/no-unused-vars

type CartItemType = Instance<typeof CartItemModel>
export interface CartItem extends CartItemType {}
type CartItemSnapshotType = SnapshotOut<typeof CartItemModel>
export interface CartItemSnapshot extends CartItemSnapshotType {}