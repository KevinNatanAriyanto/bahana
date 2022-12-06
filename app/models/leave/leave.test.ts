import { LeaveModel, Leave } from "./leave"

test("can be created", () => {
  const instance: Leave = LeaveModel.create({})

  expect(instance).toBeTruthy()
})