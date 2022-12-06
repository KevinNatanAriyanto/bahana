import { CartItemModel, CartItem } from "./cart-item"

test("can be created", () => {
  const instance: CartItem = CartItemModel.create({})

  expect(instance).toBeTruthy()
})