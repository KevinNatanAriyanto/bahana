import { JobModel, Job } from "./job"

test("can be created", () => {
  const instance: Job = JobModel.create({})

  expect(instance).toBeTruthy()
})