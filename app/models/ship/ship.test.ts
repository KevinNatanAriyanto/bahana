import { ShipModel, Ship } from "./ship"

test("can be created", () => {
  const instance: Ship = ShipModel.create({})

  expect(instance).toBeTruthy()
})