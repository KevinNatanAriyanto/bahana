import { NotificationModel, Notification } from "./notification"

test("can be created", () => {
  const instance: Notification = NotificationModel.create({})

  expect(instance).toBeTruthy()
})