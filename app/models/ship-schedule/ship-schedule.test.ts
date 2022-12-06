import { ShipScheduleModel, ShipSchedule } from "./ship-schedule"

test("can be created", () => {
  const instance: ShipSchedule = ShipScheduleModel.create({})

  expect(instance).toBeTruthy()
})