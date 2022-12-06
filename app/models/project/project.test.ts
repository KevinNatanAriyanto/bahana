import { ProjectModel, Project } from "./project"

test("can be created", () => {
  const instance: Project = ProjectModel.create({})

  expect(instance).toBeTruthy()
})