# planeso-backup

This is a small tool for backing up data from [Plane.so](https://plane.so). Is in no way affiliated with or endorsed by [Plane.so](https://plane.so).

It creates a zip file containing JSON of entire workspaces.

## Data

### Supported

- Initiatives
  - Labels
  - Projects
  - Epics
- Projects
  - States
  - Labels
  - Cycles
  - Modules
  - Epics
  - Members
  - Work Items
    - Links
    - Activities
    - Comments
    - Attachments (meta data only)
  - Work Item Types
    - Properties
- Teamspaces
  - Members
  - Projects
- Customer
  - Requests
- Customer Properties
- Stickies
- Members

### Not Supported

- Intake
- Pages (lack of api support for listing resources)
- Time Tracking (lack of api support for listing resources)
- User

## Installation

```sh
npm install -g planeso-backup
```

## Usage

Create a `config.yml` file to pass to the command:

```yaml
api:
  baseUrl: https://api.plane.so/api
  accessToken: my-access-token
backup:
  outputDir: ./backups
  workspaces:
    - my-workspace
```

```sh
planeso-backup config.yml
```
