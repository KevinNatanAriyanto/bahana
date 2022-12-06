import { TaskModel, Task } from "./task"

test("can be created", () => {
  const instance: Task = TaskModel.create({})

  expect(instance).toBeTruthy()
})