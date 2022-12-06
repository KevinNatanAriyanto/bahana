import { AttendanceModel, Attendance } from "./attendance"

test("can be created", () => {
  const instance: Attendance = AttendanceModel.create({})

  expect(instance).toBeTruthy()
})