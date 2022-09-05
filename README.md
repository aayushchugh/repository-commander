<div align="center">

<img src="./logo.svg" height="200" width="200" alt="logo" align="center"/>
<h1>
 Repository Commander
</h1>
</div>

A Github app that lets you automate your basic tasks by automatically adding labels to your pull requests and
using `/` commands in your comments to do some nice stuff like approving and merging pull requests.

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/e01156ab13ab4cfd9608be9af5327600)](https://app.codacy.com/gh/shriproperty/repository-commander?utm_source=github.com&utm_medium=referral&utm_content=shriproperty/repository-commander&utm_campaign=Badge_Grade_Settings)
[![Deploy server](https://github.com/shriproperty/repository-commander/actions/workflows/deploy.yml/badge.svg)](https://github.com/shriproperty/repository-commander/actions/workflows/deploy.yml)

## Features

-   Automatically add labels to pull requests eg:- `Approved`, `Merged`
-   `/` commands can be used in comments eg:- `/approve`, `/merge`, `/label documentation`
-   Bot will react with `🚀` emoji when a command is found in comment
-   When a new issue is created and body is less than 20 characters than bot will ask for more information
-   After user edits the body and adds the required information bot will remove the `needs more information` label

## Demo

### Automatically adding labels

-   When a issue is closed by user and it contains some keyword labels than these labels will be automatically added

    -   `bug` - `fixed`
    -   `enhancement` - `implemented`
    -   `feature` - `implemented`

> If these labels are not present in the repo than bot will create them automatically with random color

-   Ready for Review (pull_request)

    ![Ready for Review](https://user-images.githubusercontent.com/69336518/187087709-33ae28db-8c9e-44a0-a231-45068ea34aef.png)

-   Approved (pull_request)

    ![Approved](https://user-images.githubusercontent.com/69336518/187087871-38086613-059e-459e-954a-10506b5cabd8.gif)

-   Merged (pull_request)

    ![Merged](https://user-images.githubusercontent.com/69336518/187088126-7e59afe9-2cde-4831-8782-25f95837cd81.gif)

### Ask for more information

-   When a new issue is created and body is less than 20 characters than bot will ask for more information

    ![needs more information](https://user-images.githubusercontent.com/69336518/188457969-62d19224-62ef-47ac-80f8-f2e90e1d0ae5.png)

-   After user edits the body and adds the required information bot will remove the `needs more information` label

    ![remove needs more information](https://user-images.githubusercontent.com/69336518/188458497-f6d3fe20-8859-4930-b4bd-1506a566f133.png)

### `/` command

-   `/label <name ...>` (pull_request, issue)

    ![Label command](https://user-images.githubusercontent.com/69336518/187088515-67693ab6-4949-4a80-8ee2-0a6b2d1d266e.gif)

-   `/approve` (pull_request)

    ![Approve command](https://user-images.githubusercontent.com/69336518/188456650-0c9a1295-6c87-4d7c-802d-9183bd422c58.gif)

-   `/merge` (pull_request)

    Rebase and Merge method will be used to merge the pull request.

    ![Merge Command](https://user-images.githubusercontent.com/69336518/188457124-b7299f5e-64a6-4eeb-a719-d81f65b25423.gif)

-   `/WIP` (pull_request, issue)

    ![WIP](https://user-images.githubusercontent.com/69336518/187088635-24fe7609-eb40-47de-b1af-72210712d79a.gif)

-   `/close` (pull_request, issue)

    ![Close command]((https://user-images.githubusercontent.com/69336518/188459023-9195e332-7aa7-4f84-9bb8-7cc8fb45432b.gif)

## Contributing

If you have suggestions for how shriproperty could be improved, or want to report a bug, open an issue! We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## Run Locally

You need to clone the [server](https://github.com/shriproperty/server) first and start it

Clone the project

```bash
  git clone git@github.com:shriproperty/bot.git
```

Go to the project directory

```bash
  cd bot
```

Install dependencies

```bash
    yarn
```

Start the server

```bash
    yarn start
```

For further assistance checkout probot [docs](https://probot.github.io/docs/README/)

## Feedback

If you have any feedback, please create a issue or reach out to us at ayushchugh2006@gmail.com, info@shriproperty.com

## Support

For support, please create a issue or reach out to us at ayushchugh2006@gmail.com, info@shriproperty.com

## License

[ISC](LICENSE) © 2022 Ayush Chugh

## Authors

-   [@aayushchugh](https://www.github.com/aayushchugh)
