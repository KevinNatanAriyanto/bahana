import { SettingsModel, Settings } from "./settings"

test("can be created", () => {
  const instance: Settings = SettingsModel.create({})

  expect(instance).toBeTruthy()
})