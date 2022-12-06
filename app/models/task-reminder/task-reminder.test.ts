import { TaskReminderModel, TaskReminder } from "./task-reminder"

test("can be created", () => {
  const instance: TaskReminder = TaskReminderModel.create({})

  expect(instance).toBeTruthy()
})