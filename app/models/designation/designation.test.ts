import { DesignationModel, Designation } from "./designation"

test("can be created", () => {
  const instance: Designation = DesignationModel.create({})

  expect(instance).toBeTruthy()
})