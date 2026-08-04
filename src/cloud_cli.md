# D_D Cloud CLI 

The Cloud CLI lets you manage API keys, track service usage, and view account
balances all from your terminal.

## Prerequisites

* A D_D Cloud account
  ([sign up is free!](https://cloud.developerdao.com/register))
* The *email address* and *password* you used to sign up for D_D Cloud.

## Installing the Cloud CLI

Choose your operating system and run the install command.

> [!NOTE]
> You can find the current version of the Cloud CLI and the supported
> architectures [on GitHub](https://github.com/Developer-DAO/cloud-cli/releases).

### Linux and MacOS

```bash
curl --proto '=https' --tlsv1.2 -LsSf https://github.com/Developer-DAO/cloud-cli/releases/download/v0.1.1/dd-cloud-installer.sh | sh
```

### Windows

```powershell
powershell -ExecutionPolicy Bypass -c "irm https://github.com/Developer-DAO/cloud-cli/releases/download/v0.1.1/dd-cloud-installer.ps1 | iex"
```

## Updating the Cloud CLI

You can update the Cloud CLI with the following command.

```bash
dd-cloud-update
```

## Using the Cloud CLI

The Cloud CLI commands have the following structure.

```bash
dd-cloud <COMMAND> <FLAGS>
```

### Retrieving an API key

This command copies an API endpoint URL with a specific API key into your
clipboard.

```bash
dd-cloud get-api-key
```

#### Flags

* `--unsafe-print` flushes `stdout` before printing the API key, so you can pipe
  it into other commands.
* `--help` explains the command and its flags.

### Deleting an API key

This command deletes a specific API key.

```bash
dd-cloud delete-api-key
```

#### Flags

* `--help` explains the command and its flags.

### Generating an API key

This command generates a new API key and will copy it into your clipboard.

```bash
dd-cloud new-api-key
```

#### Flags

* `--help` explains the command and its flags. 

### Viewing your RPC usage

This command displays the number of calls you made.

```bash
dd-cloud track-usage
```

#### Flags

* `--help` explains the command and its flags. 

### Viewing your account balance

This command displays the remaining funds in your account.

```bash
dd-cloud balance
```

#### Flags

* `--help` explains the command and its flags. 

### Viewing the CLI help

This command explains available commands.

```bash
dd-cloud help
```
