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
- `/merge` - Merge a pull request
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

<img width="1404" alt="image" src="https://github.com/user-attachments/assets/c15be504-a2e9-496e-bf63-ddd4dcf759ad" />

2. **Merge PR**

    ```
    /merge
    ```

    Merges the pull request using rebase strategy (requires write access)

<img width="1417" alt="image" src="https://github.com/user-attachments/assets/85a37b6a-a13b-44aa-895d-43edeb02e95a" />

3. **Close**

    ```
    /close
    ```

    Closes a issue/PR

   <img width="1404" alt="image" src="https://github.com/user-attachments/assets/8deba0de-9aff-48f4-883d-9b5419c89879" />


4. **Add Labels**

    ```
    /label bug documentation
    ```

    Adds one or more labels to the issue/PR

<img width="1400" alt="image" src="https://github.com/user-attachments/assets/8bc0ee2a-caf7-4204-acc2-9f15f91efbd3" />


5. **Work in Progress**

    ```
    /wip
    ```

    Marks PR as work in progress

<img width="1422" alt="image" src="https://github.com/user-attachments/assets/e4f1026c-3fb5-4763-9c93-875084a26574" />


6. **Request Information**
    ```
    /request-info
    ```
    Requests additional information from the author

<img width="1405" alt="image" src="https://github.com/user-attachments/assets/81e84593-9934-44ce-8e85-d3f1d404048a" />


### Automations

The bot includes several automatic behaviors that can be enabled or disabled:

1. **Request more info** (`requestMoreInfo`)

   - Request more information from user when description is too short
   - Triggers on: Issue opened

  <img width="1402" alt="image" src="https://github.com/user-attachments/assets/7c52d5d1-2d17-4cb7-a94d-1735a05612d4" />


2. **Ready for Review** (`addReadyForReview`)

    - Adds "ready for review" label to new pull requests
    - Triggers on: Pull request opened

<img width="950" alt="image" src="https://github.com/user-attachments/assets/257880d5-aa91-4b4b-876e-0c9ca5c27ffc" />

  

3. **Approval Labels** (`addApprovedLabel`)

    - Adds "approved" label when PR is approved
    - Removes "changes requested" label if present
    - Triggers on: Pull request review submitted

 <img width="1404" alt="image" src="https://github.com/user-attachments/assets/c15be504-a2e9-496e-bf63-ddd4dcf759ad" />


4. **Changes Requested** (`addChangesRequestedLabel`)

    - Adds "changes requested" label when changes are requested
    - Removes "approved" and "ready for review" labels
    - Triggers on: Pull request review submitted

<img width="1425" alt="image" src="https://github.com/user-attachments/assets/000ea27f-6353-4e44-b1fd-d7df42d64857" />


5. **Merged Label** (`addMergedLabel`)

    - Adds "merged" label when PR is merged
    - Removes review-related labels
    - Triggers on: Pull request closed (merged)

  
 <img width="1403" alt="image" src="https://github.com/user-attachments/assets/94707a0e-b2a4-48ac-93d1-abaf6741ef44" />


6. **Welcome Messages** (`welcomeContributor`, `welcomeIssue`)
    - Welcomes first-time contributors
    - Provides helpful onboarding information
    - Triggers on: First PR or issue

<img width="930" alt="image" src="https://github.com/user-attachments/assets/e68f4114-d8f7-4dae-9ef1-055b954e84e5" />



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
