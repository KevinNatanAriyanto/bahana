import { GpsModel, Gps } from "./gps"

test("can be created", () => {
  const instance: Gps = GpsModel.create({})

  expect(instance).toBeTruthy()
})