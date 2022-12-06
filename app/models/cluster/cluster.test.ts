import { ClusterModel, Cluster } from "./cluster"

test("can be created", () => {
  const instance: Cluster = ClusterModel.create({})

  expect(instance).toBeTruthy()
})