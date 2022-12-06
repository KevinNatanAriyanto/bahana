import { OfficeModel, Office } from "./office"

test("can be created", () => {
  const instance: Office = OfficeModel.create({})

  expect(instance).toBeTruthy()
})