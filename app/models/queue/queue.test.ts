import { QueueModel, Queue } from "./queue"

test("can be created", () => {
  const instance: Queue = QueueModel.create({})

  expect(instance).toBeTruthy()
})