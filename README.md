# Serverless Todo App
## How to run

- Install amplify package: `npm install -g @aws-amplify/cliclear`
- Configure AWS access by running `amplify configure`
- Create an environment with `amplify env add test`
- Run the command `amplify status` see a list of resources that will be created

```
Current Environment: test

| Category | Resource name       | Operation | Provider plugin   |
| -------- | ------------------- | --------- | ----------------- |
| Api      | myapi               | Create    | awscloudformation |
| Auth     | amplifytodo9fcffbc6 | Create    | awscloudformation |

```
- Run `amplify push` to build all your local backend resources and provision it in the cloud
- To host in the application, run `amplify hosting add` and `amplify publish` to deploy your application
