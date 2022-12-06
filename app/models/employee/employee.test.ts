import { EmployeeModel, Employee } from "./employee"

test("can be created", () => {
  const instance: Employee = EmployeeModel.create({})

  expect(instance).toBeTruthy()
})