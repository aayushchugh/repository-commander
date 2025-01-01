<div align="center">

<img src="./logo.svg" height="200" width="200" alt="logo" align="center"/>
<h1>
 Repository Commander
</h1>
</div>

A Github app that lets you automate your basic tasks by automatically adding labels to your pull requests and
using `/` commands in your comments to do some nice stuff like approving and merging pull requests.

## Features

- Automatically add labels to pull requests eg:- `Approved`, `Merged`
- `/` commands can be used in comments eg:- `/approve`, `/merge`, `/label documentation`
- Bot will react with `🚀` emoji when a command is found in comment
- When a new issue is created and body is less than 20 characters than bot will ask for more information
- After user edits the body and adds the required information bot will remove the `needs more information` label

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

### Ask for more information

- When a new issue is created and body is less than 20 characters than bot will ask for more information

    ![needs more information](https://user-images.githubusercontent.com/69336518/188457969-62d19224-62ef-47ac-80f8-f2e90e1d0ae5.png)

- After user edits the body and adds the required information bot will remove the `needs more information` label

    ![remove needs more information](https://user-images.githubusercontent.com/69336518/188458497-f6d3fe20-8859-4930-b4bd-1506a566f133.png)

### `/` command

- `/label <name ...>` (pull_request, issue)

    ![Label command](https://user-images.githubusercontent.com/69336518/187088515-67693ab6-4949-4a80-8ee2-0a6b2d1d266e.gif)

- `/approve` (pull_request)

    ![Approve command](https://user-images.githubusercontent.com/69336518/188456650-0c9a1295-6c87-4d7c-802d-9183bd422c58.gif)

- `/merge` (pull_request)

    Rebase and Merge method will be used to merge the pull request.

    ![Merge Command](https://user-images.githubusercontent.com/69336518/188457124-b7299f5e-64a6-4eeb-a719-d81f65b25423.gif)

- `/WIP` (pull_request, issue)

    ![WIP](https://user-images.githubusercontent.com/69336518/187088635-24fe7609-eb40-47de-b1af-72210712d79a.gif)

- `/close` (pull_request, issue)

    ![Close command]((https://user-images.githubusercontent.com/69336518/188459023-9195e332-7aa7-4f84-9bb8-7cc8fb45432b.gif)

### Automations

The bot includes several automatic behaviors that can be enabled or disabled:

1. **Ready for Review** (`addReadyForReview`)

    - Adds "ready for review" label to new pull requests
    - Triggers on: Pull request opened

2. **Approval Labels** (`addApprovedLabel`)

    - Adds "approved" label when PR is approved
    - Removes "changes requested" label if present
    - Triggers on: Pull request review submitted

3. **Changes Requested** (`addChangesRequestedLabel`)

    - Adds "changes requested" label when changes are requested
    - Removes "approved" and "ready for review" labels
    - Triggers on: Pull request review submitted

4. **Merged Label** (`addMergedLabel`)

    - Adds "merged" label when PR is merged
    - Removes review-related labels
    - Triggers on: Pull request closed (merged)

5. **Closed Label Management** (`removeClosedLabel`)

    - Removes "closed" label when PR is reopened
    - Triggers on: Pull request reopened

6. **Request More Info** (`requestMoreInfo`)

    - Adds "needs more info" label when issue/PR description is too short
    - Removes label when description is updated
    - Triggers on: Issues opened/edited

7. **Close Labels** (`addLabelsOnClose`)

    - Adds "fixed" label to closed bug issues
    - Adds "implemented" label to closed feature/enhancement issues
    - Triggers on: Issue closed

8. **Welcome Messages** (`welcomeContributor`, `welcomeIssue`)

    - Welcomes first-time contributors when they open their first PR
    - Welcomes users when they open their first issue
    - Provides helpful information and next steps
    - Triggers on: Pull request opened, Issues opened

Each automation can be enabled or disabled independently through the configuration file.

## Configuration

Create a `.github/repository-commander.yml` file in your repository to customize the bot's behavior:

```yml
# Minimum length required for issue/PR descriptions
minBodyLength: 50

# Enable/disable commands
commands:
    # Enable/disable /wip command (default: true)
    wip: true
    # Enable/disable /approve command (default: true)
    approve: true
    # Enable/disable /close command (default: true)
    close: true
    # Enable/disable /label command (default: true)
    label: true
    # Enable/disable /merge command (default: true)
    merge: true
    # Enable/disable /request-info command (default: true)
    requestInfo: true

# Enable/disable automations
automations:
    # Automatically add ready for review label to new PRs (default: true)
    addReadyForReview: true
    # Automatically add approved label when PR is approved (default: true)
    addApprovedLabel: true
    # Automatically add changes requested label when changes are requested (default: true)
    addChangesRequestedLabel: true
    # Automatically add merged label when PR is merged (default: true)
    addMergedLabel: true
    # Automatically remove closed label when PR is reopened (default: true)
    removeClosedLabel: true
    # Automatically request more info on short descriptions (default: true)
    requestMoreInfo: true
    # Automatically add labels on issue close (default: true)
    addLabelsOnClose: true
    # Welcome new contributors on their first PR (default: true)
    welcomeContributor: true
    # Welcome users on their first issue (default: true)
    welcomeIssue: true

# Configure label names
labels:
    # Label for work in progress (default: "WIP")
    wip: "work in progress"
    # Label for ready for review (default: "ready for review")
    readyForReview: "ready for review"
    # Label for approved PRs (default: "approved")
    approved: "approved"
    # Label for PRs needing changes (default: "changes requested")
    changesRequested: "changes requested"
    # Label for issues needing more info (default: "needs more info")
    needsMoreInfo: "needs more info"
    # Label for merged PRs (default: "merged")
    merged: "merged"
    # Label for closed issues/PRs (default: "closed")
    closed: "closed"
    # Label for bugs (default: "bug")
    bug: "bug"
    # Label for features (default: "feature")
    feature: "feature"
    # Label for enhancements (default: "enhancement")
    enhancement: "enhancement"
    # Label for fixed issues (default: "fixed")
    fixed: "fixed"
    # Label for implemented features (default: "implemented")
    implemented: "implemented"

# Configure label colors
colors:
    # Color for error/warning labels (default: "AA2626")
    red: "AA2626"
    # Color for pending labels (default: "B60205")
    orange: "B60205"
    # Color for neutral labels (default: "383214")
    gray: "383214"

# Configure welcome messages
messages:
    # Message for first-time PR contributors (use {user} for username)
    welcomeContributor: |
        Thanks for your first pull request, @{user}! 🎉

        The team will review your changes soon. In the meantime, please make sure:
        - [ ] Tests pass
        - [ ] Documentation is updated (if needed)
        - [ ] Commit messages follow our guidelines

        Welcome to our community! 🚀

    # Message for first-time issue creators (use {user} for username)
    welcomeIssue: |
        Thanks for opening your first issue, @{user}! 🎉

        We appreciate you taking the time to contribute to the project.
        Someone will respond to your issue soon. 👍

    # Message when requesting more information
    requestMoreInfo: |
        Hey @{user}! We need more information.
        Please edit your {type} to include more details.

    # Message when user adds more information
    moreInfoAdded: |
        Thanks @{user} for adding more information!

Available placeholders:
- `{user}` - Will be replaced with the username
- `{type}` - Will be replaced with "issue" or "pull request" (only in requestMoreInfo)
```

## Contributing

If you have suggestions for how shriproperty could be improved, or want to report a bug, open an issue! We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## Run Locally

You need to clone the [repository-commander](https://github.com/aayushchugh/repository-commander) first and start it

Clone the project

```bash
  git clone git@github.com:aayushchugh/repository-commander.git
```

Go to the project directory

```bash
  cd repository-commander
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

If you have any feedback, please create a issue or reach out to me at `hey@ayushchugh.com`

## Support

For support, please create a issue or reach out to me at `hey@ayushchugh.com`
