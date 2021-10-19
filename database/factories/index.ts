import Project from "App/Models/Project";
import Factory from "@ioc:Adonis/Lucid/Factory";

export const ProjectFactory = Factory.define(Project, ({ faker }) => {
  return {
    name: faker.internet.userName(),
    // username: faker.internet.userName(),
    // email: faker.internet.email(),
    // password: faker.internet.password(),
  };
}).build();
