import { PermissionModel, Permission } from "./permission"

test("can be created", () => {
  const instance: Permission = PermissionModel.create({})

  expect(instance).toBeTruthy()
})