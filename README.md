<div align="center">

<img src="./logo.svg" height="200" width="200" alt="logo" align="center"/>
<h1>
 Repository Commander
</h1>
</div>

A Github app that lets you automate your basic tasks by automatically adding labels to your pull requests and
using `/` commands in your comments to do some nice stuff like approving and merging pull requests.

## Features

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/e01156ab13ab4cfd9608be9af5327600)](https://app.codacy.com/gh/shriproperty/repository-commander?utm_source=github.com&utm_medium=referral&utm_content=shriproperty/repository-commander&utm_campaign=Badge_Grade_Settings)

- Automatically add labels to pull requests eg:- `Approved`, `Merged`
- `/` commands can be used in comments eg:- `/approve`, `/merge`, `/label documentation`
- Bot will react with `🚀` emoji when a command is found in comment

## Demo

### Automatically adding labels

- When a issue is closed by user and it contains some keyword labels than these labels will be automatically added

  - `bug` - `fixed`
  - `enhancement` - `implemented`
  - `feature` - `implemented`

> If these labels are not present in the repo than bot will create them automatically with random color

- Ready for Review (pull_request)

  ![Ready for Review](https://user-images.githubusercontent.com/69336518/187087709-33ae28db-8c9e-44a0-a231-45068ea34aef.png)

- Approved (pull_request)

  ![Approved](https://user-images.githubusercontent.com/69336518/187087871-38086613-059e-459e-954a-10506b5cabd8.gif)

- Merged (pull_request)

  ![Merged](https://user-images.githubusercontent.com/69336518/187088126-7e59afe9-2cde-4831-8782-25f95837cd81.gif)

### `/` command

- `/label <name ...>` (pull_request, issue)

  ![Label command](https://user-images.githubusercontent.com/69336518/187088515-67693ab6-4949-4a80-8ee2-0a6b2d1d266e.gif)

- `/approve` (pull_request)

  ![Approve command](https://user-images.githubusercontent.com/69336518/187089239-5acfde34-cefb-47f8-8b8d-a82b84855ce9.gif)

- `/merge` (pull_request)

  Rebase and Merge method will be used to merge the pull request.

  ![Merge Command](https://user-images.githubusercontent.com/69336518/187089488-3df12116-eac0-4d3a-8309-f447a333ea3b.gif)

  You can bypass `/approve` command and execute `/merge` directly this will approve that changes first and than merge

  ![Merge and Approve together](https://user-images.githubusercontent.com/69336518/187089739-cd20508a-0b3f-4a00-99ce-550f6ccb4609.gif)

- `/WIP` (pull_request, issue)

  ![WIP](https://user-images.githubusercontent.com/69336518/187088635-24fe7609-eb40-47de-b1af-72210712d79a.gif)

- `/close` (pull_request, issue)

  ![Close command](https://user-images.githubusercontent.com/69336518/187088876-68257a26-01ac-49d5-aa8f-310870874287.gif)

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

- [@aayushchugh](https://www.github.com/aayushchugh)
