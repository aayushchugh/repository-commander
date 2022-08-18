# Shriproperty

> A Github app that lets you automate your basic tasks by automatically adding labels to your pull requests and
> using `/` commands in your comments to do some nice stuff like approving and merging pull requests.

## Features

- Automatically add labels to pull requests eg:- `Approved`, `Merged`
- Automatically add `WIP` label when title contains any of these keywords `WIP`, `Work In Progress`, `work in progress`, `🚧`
- If `WIP` label is added by user than add `🚧` prefix to issue/pull_request title
- `/` commands can be used in comments eg:- `/approve`, `/merge`, `/label documentation`
- Bot will react with `👍` emoji when a command is found in comment

## Demo

### Automatically adding labels

- When a issue is closed by user and it contains some keyword labels than these labels will be automatically added

  - `bug` - `fixed`
  - `enhancement` - `implemented`
  - `feature` - `implemented`

- Ready for Review (pull_request)

  ![Ready for Review](https://user-images.githubusercontent.com/69336518/185299230-7362c2ff-4cb1-44ef-acdc-0c933c664890.png)

- Approved (pull_request)

  ![Approved](https://user-images.githubusercontent.com/69336518/185299944-c274526f-bdb3-4982-9a73-fbe089dc34f0.gif)

- Merged (pull_request)

  ![Merged](https://user-images.githubusercontent.com/69336518/185300751-c0d47387-c2f3-400b-b6db-6637caa3e328.gif)

- When title contains `WIP`, `Work In Progress`, `:construction:` than add `WIP` Label (pull_request, issue (future release))

  ![Add WIP label when title is updated](https://user-images.githubusercontent.com/69336518/185333109-255911da-3f37-485a-ba7c-03b6af58ef75.gif)

- When title is edited and `WIP` is removed from title than label will also be removed (pull_request, issue(future release))

  ![Auto remove WIP label](https://user-images.githubusercontent.com/69336518/185333772-258192b8-6974-4a0c-8d05-7aa594f0067e.gif)

### `/` command

- `/label <name ...>` (pull_request, issue)

  ![Label command](https://user-images.githubusercontent.com/69336518/185309011-cac30676-bf99-4ad0-94ea-2aa1fa4b0a61.gif)

- `/approve` (pull_request)

  ![Approve command](https://user-images.githubusercontent.com/69336518/185306021-106db100-873d-4482-a882-df4f8764a559.gif)

- `/merge` (pull_request)

  Squash and Merge method will be used to merge the pull request.

  ![Merge Command](https://user-images.githubusercontent.com/69336518/185306473-3c614c19-0bc0-4772-9d40-c1e319b62ac7.gif)

  If changes are not approved but we use `/merge` than it will approve the changes first

  ![Merge and Approve together](https://user-images.githubusercontent.com/69336518/185307260-7926f057-7606-44f2-95ee-ac041d7b7602.gif)

- `/WIP` (pull_request, issue)

  ![WIP](https://user-images.githubusercontent.com/69336518/185307806-96a8f3ae-f485-44ff-9164-ba81f6064df9.gif)

  If we use `/WIP` again than it will remove `WIP` label and title

  ![WIP again](https://user-images.githubusercontent.com/69336518/185308205-c6139e73-c2b5-409e-8396-fb382a4342dd.gif)

- `/close` (pull_request, issue)

  ![Close command](https://user-images.githubusercontent.com/69336518/185327801-89852c28-8ec7-4a70-bde6-8025a4afe0a2.gif)

## Feedback

If you have any feedback, please create a issue or reach out to us at ayushchugh2006@gmail.com

## Support

For support, please create a issue or reach out to us at ayushchugh2006@gmail.com

## Contributing

If you have suggestions for how shriproperty could be improved, or want to report a bug, open an issue! We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## License

[ISC](LICENSE) © 2022 Ayush Chugh

## Authors

- [@aayushchugh](https://www.github.com/aayushchugh)
