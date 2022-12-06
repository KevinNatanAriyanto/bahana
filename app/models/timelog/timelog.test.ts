import { TimelogModel, Timelog } from "./timelog"

test("can be created", () => {
  const instance: Timelog = TimelogModel.create({})

  expect(instance).toBeTruthy()
})