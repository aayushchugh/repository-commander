<div align="center">
<img src="./logo.svg" height="200" width="200" alt="logo" align="center"/>
<h1>Repo Command</h1>

A GitHub bot that automates repository management through commands and automatic labeling.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub release](https://img.shields.io/github/release/aayushchugh/repo-command.svg)](https://github.com/aayushchugh/repo-command/releases/)

</div>

## Features

### Automatic Labeling

- Labels new PRs as "ready for review"
- Adds "approved" label when PR is approved
- Adds "changes requested" when changes are requested
- Adds "merged" label to merged PRs
- Adds "fixed" label to closed bug issues
- Adds "implemented" label to closed feature/enhancement issues

### Commands

Use these commands in PR/issue comments:

- `/approve` - Approve a pull request
- `/merge` - Merge a pull request using rebase
- `/close` - Close an issue or pull request
- `/wip` - Mark as work in progress
- `/label <name>` - Add labels
- `/request-info` - Request more information

### Smart Automations

- Requests more information when issue descriptions are too short
- Welcomes first-time contributors
- Manages labels based on PR/issue status
- Automatically removes labels when conditions change

## Installation

1. [Install the GitHub App](https://github.com/apps/repo-command)
2. Grant access to your repositories
3. Optionally create a config file (see Configuration section)

## Usage

### Commands

1. **Approve PR**

    ```
    /approve
    ```

    Approves the pull request (requires write access)

2. **Merge PR**

    ```
    /merge
    ```

    Merges the pull request using rebase strategy (requires write access)

3. **Add Labels**

    ```
    /label bug documentation
    ```

    Adds one or more labels to the issue/PR

4. **Work in Progress**

    ```
    /wip
    ```

    Marks PR as work in progress

5. **Request Information**
    ```
    /request-info
    ```
    Requests additional information from the author

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

5. **Welcome Messages** (`welcomeContributor`, `welcomeIssue`)
    - Welcomes first-time contributors
    - Provides helpful onboarding information
    - Triggers on: First PR or issue

## Configuration

Create a `.github/repo-command.yml` file in your repository:

```yaml
# Minimum length required for issue/PR descriptions
minBodyLength: 50

# Enable/disable commands
commands:
    wip: true
    approve: true
    close: true
    label: true
    merge: true
    requestInfo: true

# Enable/disable automations
automations:
    addReadyForReview: true
    addApprovedLabel: true
    addChangesRequestedLabel: true
    addMergedLabel: true
    requestMoreInfo: true
    addLabelsOnClose: true
    welcomeContributor: true
    welcomeIssue: true

# Configure labels
labels:
    wip: "work in progress"
    readyForReview: "ready for review"
    approved: "approved"
    changesRequested: "changes requested"
    needsMoreInfo: "needs more info"
    merged: "merged"
    bug: "bug"
    feature: "feature"
    enhancement: "enhancement"
    fixed: "fixed"
    implemented: "implemented"

# Configure messages
messages:
    welcomeContributor: |
        Thanks for your first pull request, @{user}! 🎉
        The team will review your changes soon.
    welcomeIssue: |
        Thanks for opening your first issue, @{user}! 🎉
    requestMoreInfo: |
        Hey @{user}! Please provide more details in your {type}.
    moreInfoAdded: |
        Thanks @{user} for adding more information!
```

## Development

### Prerequisites

- Node.js >= 16
- npm or yarn
- A GitHub account

### Local Setup

1. Clone the repository

```bash
git clone git@github.com:aayushchugh/repo-command.git
cd repo-command
```

2. Install dependencies

```bash
npm install
```

3. Create a `.env` file:

```env
APP_ID=your_app_id
PRIVATE_KEY=your_private_key
WEBHOOK_SECRET=your_webhook_secret
```

4. Start the bot

```bash
npm run dev
```

### Docker Support

Run using Docker:

```bash
# Using Docker Compose
docker compose up -d

# Or using Docker directly
docker build -t repo-command .
docker run -d \
  -p 3000:3000 \
  --env-file .env \
  --name repo-command \
  repo-command
```

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md).

## Support

For support:

- Open an issue
- Email: hey@ayushchugh.com

## License

[MIT](LICENSE) © Ayush Chugh

docker run -d \
 -p 3000:3000 \
 --env-file .env \
 --name repo-command \
 repo-command

```

The bot will be available at `http://localhost:3000`.
```
