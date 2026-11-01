# Atlassian Teamwork Graph CLI (TWG CLI) — User Manual & Usage Guide

## 1. Overview & Architecture

### What is Teamwork Graph CLI?
The **Atlassian Teamwork Graph CLI (**`twg`) is a command-line interface designed to connect developers and AI coding agents directly to Atlassian's Cloud ecosystem and the **Teamwork Graph (TWG)**.
The Teamwork Graph continuously maps relationships between people, work items, documents, repositories, pull requests, and discussions across Atlassian tools (Jira, Confluence, Bitbucket, Trello, Loom, Atlas) and connected third-party platforms (Slack, Google Drive, GitHub, Salesforce).

```
 ┌──────────────────────────────────────────────────────────────┐
 │             AI Agents & Developers / Terminals               │
 │       (Claude Code, Cursor, Codex, Gemini, Bash/Zsh)         │
 └──────────────────────────────┬───────────────────────────────┘
                                │ twg <command>
                                ▼
 ┌──────────────────────────────────────────────────────────────┐
 │                      TWG CLI Engine                          │
 │      OAuth 2.1 Engine  •  Upkeep Helper  •  Skill Bundles     │
 └──────────────┬───────────────────────────────┬───────────────┘
                │                               │
                ▼                               ▼
 ┌──────────────────────────────┐ ┌─────────────────────────────┐
 │       Teamwork Graph         │ │     Direct Product APIs     │
 │  • Enriched Cross-Tool Query │ │  • Jira / JSM / Assets      │
 │  • Collaborators & Context   │ │  • Confluence Pages & DBs   │
 │  • Real-time Activity Feeds  │ │  • Bitbucket / Loom / Atlas │
 └──────────────────────────────┘ └─────────────────────────────┘
```

### Key Differences: TWG CLI vs. Atlassian CLI vs. Rovo MCP
| Feature | Teamwork Graph CLI (`twg`) | Atlassian CLI (`acli`) | Rovo MCP |
| --- | --- | --- | --- |
| **Primary Target** | AI Coding Agents, Shells & Automation | Human Admin & Manual Scripting | Web LLMs & IDEs supporting MCP protocol |
| **Graph Awareness** | Native Teamwork Graph queries across products | Single-product siloed APIs | Graph tools mapped to MCP server protocol |
| **Auth Protocol** | OAuth 2.1 + Local Secure Vault + Background Upkeep | API Tokens / Basic Auth | Host-managed OAuth / Bearer Tokens |
| **Agent Skill Integration** | Built-in (`twg skills install` / `AGENTS.md`) | None | Native MCP host connection |

---

## 2. System Requirements & Prerequisites
* **Operating Systems**:
    * macOS (Apple Silicon `arm64` or Intel `x64`)
    * Linux (`x64`, systemd recommended for automatic background token upkeep)
    * Windows 10/11 (`x64` or `arm64`)
* **Dependencies**: Standalone compiled binary (no Node.js, Python, or external runtime required).
* **Permissions**: Respects existing Atlassian user permissions (no privileged elevation beyond user account access).

---

## 3. Installation Guide

### Option A: macOS & Linux

#### Standard Terminal Installer:
```shell
curl -fsSL --retry 2 https://developer.atlassian.com/cloud/twg-cli/install.sh | bash
```

To install a specific version:
```shell
curl -fsSL --retry 2 https://developer.atlassian.com/cloud/twg-cli/install.sh | bash -s -- --version 0.9.1
```

_Note: Ensure `~/.local/bin` is added to your shell profile (`~/.zshrc` or `~/.bashrc`):_
```shell
export PATH="$HOME/.local/bin:$PATH"
```

#### macOS Universal Package (`.pkg`):
For managed or MDM-driven enterprise machines:
```shell
curl -fL https://developer.atlassian.com/cloud/twg-cli/twg.pkg -o twg.pkg
sudo installer -pkg twg.pkg -target /
twg setup
```

### Option B: Windows
> **Note:** Run installer commands via **Windows PowerShell** or **Command Prompt (`cmd`)**. Avoid Git Bash, Cygwin, or WSL for the native Windows binary.

#### PowerShell:
```powershell
curl.exe -fsSL https://developer.atlassian.com/cloud/twg-cli/twg-install.ps1 -o twg-install.ps1
powershell -ExecutionPolicy Bypass -File .\twg-install.ps1
```

#### Windows MSI Package (System-wide):
```powershell
Invoke-WebRequest https://developer.atlassian.com/cloud/twg-cli/twg-windows-x64.msi -OutFile twg-windows-x64.msi
msiexec.exe /i .\twg-windows-x64.msi
```

### Option C: AI Agent Automated Setup
When working inside an AI coding assistant (such as Claude Code, Cursor, or Codex), you can delegate setup:
```plaintext
Install and configure TWG CLI using https://developer.atlassian.com/cloud/twg-cli/AGENTS.md
```

---

## 4. Authentication & Security Management

### 1. OAuth 2.1 Interactive Login
TWG CLI uses OAuth 2.1 for authentication against Atlassian Cloud.
```shell
twg login
```
* **Process**: The CLI prints a one-time verification code and opens your browser. Select your Atlassian Cloud site and choose **Accept**.
* **Re-authentication**: To refresh or switch active sites:
```shell
twg login --force
```
* **Logout**:
```shell
twg logout
```

### 2. Organization Admin Login
For administrative commands requiring Atlassian Admin API keys:
```shell
twg admin auth login --email admin@example.com --org <ORGANIZATION_ID>
```

### 3. Bitbucket Setup
Bitbucket commands currently use dedicated access tokens:
```shell
twg setup bitbucket
```
_(In automated/CI environments, supply the token via the `TWG_BBC_TOKEN` environment variable)._

### 4. Background Upkeep Helper
OAuth access tokens expire after 8 hours. TWG CLI includes a background upkeep daemon running outside agent sandboxes (via macOS LaunchAgent, Linux systemd user service, or Windows Scheduled Task) that refreshes tokens automatically every 12 minutes.
```shell
# Verify upkeep status
twg upkeep status

# Force run a background refresh cycle
twg upkeep run

# Enable / Disable upkeep
twg upkeep enable
twg upkeep disable
```

### 5. Encrypted Vault Storage (Optional / Experimental)
Store tokens in the operating system's native secure vault (`auth-storage/auth.db`) instead of plaintext config files:

| OS | Root Key Location |
| --- | --- |
| **macOS** | macOS Keychain |
| **Windows** | Windows Credential Manager |
| **Linux** | `TWG_AUTH_STORAGE_KEY` (32-byte Base64-URL string) |

#### Migration Commands:
```shell
# Migrate standard auth.conf to OS encrypted vault
twg auth storage migrate

# First-time sign-in directly using the secure vault
TWG_SECRET_STORE=keychain twg login --force --oauth
```

---

## 5. Command Reference & Usage Examples
Discover help and command syntax directly from the CLI:
```shell
twg --help
twg <domain> --help
```

### A. Cross-Product Graph Context & Intelligence
_Enriched operations synthesize relationships across Jira, Confluence, Slack, PRs, and users._
```shell
# Retrieve full graph context around an entity or ticket
twg context --id "PROJ-1024"

# Discover top collaborators and shared artifact interactions
twg collaborators --user "user@example.com"

# Summarize cross-platform user/team activity across Jira, Confluence, and Bitbucket
twg activity --recent "7d"
```

### B. Jira Work Management & Agility
```shell
# List open issues assigned to current user
twg jira issue list --assignee currentUser() --status "In Progress"

# Search issues using standard JQL
twg jira search --jql "project = 'AUTOX' AND updated >= -7d ORDER BY priority DESC"

# View full issue details
twg jira issue get --key "AUTOX-452"

# Transition issue status
twg jira issue transition --key "AUTOX-452" --status "In Code Review"

# Add comment to issue
twg jira issue comment --key "AUTOX-452" --body "PR is ready for review at #142."

# Show active sprint and board details
twg jira sprint get --board-id 12
```

### C. Confluence Documentation & Knowledge Base
```shell
# Search Confluence pages using CQL
twg confluence search --cql "space = 'ENG' AND title ~ 'Architecture Spec'"

# Read page content as Markdown or ADF
twg confluence page get --id "838647220" --format markdown

# Create a new Confluence page
twg confluence page create \
  --space "ENG" \
  --title "Mobile Onboarding Verification Runbook" \
  --file "./docs/runbook.md"

# Update an existing page
twg confluence page update --id "838647220" --file "./docs/updated_spec.md"

# Generate Whiteboards or Databases (AI-powered)
twg confluence content create --type database --space "SMTL" --prompt "Track API endpoints and status codes"
```

### D. Bitbucket Code & Pipelines
```shell
# List repositories in workspace
twg bitbucket repo list --workspace "autox-tech"

# Query active Pull Requests
twg bitbucket pr list --repo "insurance-web-frontend" --state OPEN

# View specific PR details and diff summary
twg bitbucket pr get --repo "insurance-web-frontend" --id 89

# View pipeline execution status
twg bitbucket pipeline status --repo "insurance-web-frontend" --latest
```

### E. Jira Service Management (JSM) & Assets
```shell
# Query service desk incident tickets
twg jsm incident list --service "Insurance Payment Portal" --open

# Query Assets CMDB objects
twg assets query --schema "IT Infrastructure" --aql "objectType = 'Service' AND Status = 'Production'"
```

### F. Atlas Goals & Projects / Teams / Loom / Trello
```shell
# Check status of organizational Goals
twg atlas goal list --owner currentUser()

# Get Team details and membership
twg teams get --name "Insurance Core Dev Squad"

# Search Loom recordings
twg loom search --query "Sprint 14 Demo"

# Manage Trello cards
twg trello card list --board "Release Readiness"
```

---

## 6. AI Agent Integration Workflow
Integrating TWG CLI with agentic coding environments enables natural-language interactions with your tools without memorizing CLI syntax.

### 1. Install Skills in Your Project
From your codebase root directory:
```shell
twg skills install
```
This generates configuration files under `.agents/skills/twg/` or wires instructions into your agent workspace.

### 2. Conversational Workflows
Once installed, prompt your agent naturally:
```plaintext
Prompt: "Summarize all bugs assigned to me updated in the last 3 days and check if there are related PRs in Bitbucket."
```
```plaintext
Prompt: "Read the Confluence page with ID 838647220, extract the error code table, and create a corresponding TypeScript enum file in src/constants/errors.ts."
```
```plaintext
Prompt: "Create a draft Confluence page in the ENG space detailing our environment sync runbook from Prod to Non-prod."
```

---

## 7. Diagnostics, Troubleshooting & Maintenance

### 1. Health Checks
Run the diagnostic command:
```shell
twg doctor
```
For a quick summary of auth and storage backend:
```shell
twg doctor --basic
```

### 2. Setup Repair
If configuration files or skill definitions become corrupted:
```shell
twg setup
```

### 3. Upgrading TWG CLI
```shell
# Standard upgrade check and execution
twg upgrade

# Switch to Beta release channel
twg upgrade --channel beta

# Switch back to Stable release channel
twg upgrade --channel stable
```

### 4. Common Issues Matrix
| Symptom | Root Cause | Solution |
| --- | --- | --- |
| `command not found: twg` | Binary directory not in system `$PATH` | Add `~/.local/bin` (macOS/Linux) or `C:\Program Files\twg` (Windows) to your `$PATH`. |
| `Authentication failed` | Expired refresh token or changed permissions | Run `twg login --force` to re-authorize in browser. |
| `Bitbucket command failed (Unauthorized)` | Missing Bitbucket-specific token | Run `twg setup bitbucket` or set `TWG_BBC_TOKEN`. |
| Agent cannot refresh token inside sandbox | Agent sandbox blocks network auth ports | Enable the background helper with `twg upkeep enable`. |
| Windows SmartScreen popup | Pre-release / Unsigned binary flag | Click **More Info** → **Run Anyway**. |

### 5. Uninstallation
```shell
# Preview uninstallation changes (dry run)
twg uninstall --dry-run

# Complete uninstallation (removes binary, config, skills, and background helpers)
twg uninstall
```

---

## 8. Billing & Credit Consumption Reference
Teamwork Graph CLI operations follow Atlassian's value-based model:
* **Free / Standard (Included in Cloud Plan)**:
    * Connecting data sources and metadata sync.
    * Single-product lookups (e.g., retrieving a single Jira issue, fetching a specific Confluence page).
    * Direct write operations (e.g., creating/updating Jira issues or Confluence pages).
    * CLI tool discovery and local doctor commands.
* **Enriched Operations (Consumes Rovo Credits)**:
    * Cross-product intelligence aggregating data across multiple Atlassian and third-party apps (e.g., `twg context`, `twg collaborators`, `twg activity`).
    * AI-assisted generation (e.g., complex Confluence whiteboards/databases synthesis).

_To review your organization's credit usage: Navigate to **Atlassian Administration** > **Insights** > **Platform Usage** > **Rovo Credits**._

---

## 9. Advanced CI/CD & Scripting Recipes

### 1. CI/CD Pipeline: Automated Release Notes & Confluence Knowledge Sync
This workflow triggers upon creating a release tag or merging into `main`. It:
1. Uses `twg jira search` to extract completed issues in the release.
2. Uses `twg rovo search` to surface related Confluence architectural decision records (ADRs) and specs.
3. Synthesizes a structured release report using TWG AI capabilities.
4. Publishes a new release documentation page directly into Confluence.

#### A. Bitbucket Pipelines (`bitbucket-pipelines.yml`)
```yaml
image: atlassian/default-image:4

pipelines:
  tags:
    'release-*':
      - step:
          name: Generate AI Release Notes & Publish to Confluence
          script:
            # 1. Install TWG CLI
            - curl -fsSL https://developer.atlassian.com/cloud/twg-cli/install.sh | bash
            - export PATH="$HOME/.local/bin:$PATH"

            # 2. Authenticate in headless CI
            - twg auth ci-login --token "$TWG_CI_SERVICE_TOKEN" --cloud-id "$ATLASSIAN_CLOUD_ID"

            # 3. Extract release tag and current date
            - RELEASE_VERSION="${BITBUCKET_TAG}"
            - echo "Processing release $RELEASE_VERSION..."

            # 4. Gather completed Jira issues for this sprint/fixVersion
            - twg jira search --jql "project = 'AUTOX' AND fixVersion = '$RELEASE_VERSION' AND status = 'Done'" --format json > completed_issues.json

            # 5. Execute Rovo search across Confluence & Git PRs for major changes
            - twg rovo search --query "Architecture changes and migrations for $RELEASE_VERSION" --limit 5 --format markdown > related_specs.md

            # 6. Synthesize AI Release Summary
            - |
              twg rovo summarize \
                --inputs completed_issues.json,related_specs.md \
                --prompt "Create an executive and developer release note summary highlighting key features, bug fixes, breaking changes, and migration steps." \
                --output-file release_notes.md

            # 7. Publish release page to Confluence
            - |
              twg confluence page create \
                --space "ENG" \
                --parent-title "Release Notes" \
                --title "Release Notes - $RELEASE_VERSION ($(date +'%Y-%m-%d'))" \
                --file release_notes.md

            # 8. Add link back to Jira FixVersion
            - echo "Release notes published successfully."
```

#### B. GitHub Actions Equivalent (`.github/workflows/release-notes.yml`)
```yaml
name: TWG AI Release Notes

on:
  push:
    tags:
      - 'v*.*.*'

jobs:
  publish-release-notes:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Install TWG CLI
        run: |
          curl -fsSL https://developer.atlassian.com/cloud/twg-cli/install.sh | bash
          echo "$HOME/.local/bin" >> $GITHUB_PATH

      - name: Generate Release Notes via TWG & Rovo AI
        env:
          TWG_CI_SERVICE_TOKEN: ${{ secrets.TWG_CI_SERVICE_TOKEN }}
          ATLASSIAN_CLOUD_ID: ${{ secrets.ATLASSIAN_CLOUD_ID }}
          TAG_NAME: ${{ github.ref_name }}
        run: |
          twg auth ci-login --token "$TWG_CI_SERVICE_TOKEN" --cloud-id "$ATLASSIAN_CLOUD_ID"
          
          # Fetch recent merged PRs and commit diff context
          twg context --git-range "HEAD~20..HEAD" --format json > git_context.json
          
          # AI summary using Rovo
          twg rovo summarize \
            --inputs git_context.json \
            --prompt "Summarize bug fixes, frontend adjustments, and breaking API changes for version $TAG_NAME." \
            --output-file release_summary.md

          # Create Confluence documentation
          twg confluence page create \
            --space "ENG" \
            --title "Release $TAG_NAME" \
            --file release_summary.md
```

---

### 2. CI/CD Script: PR Context & Specification Conformance Check
Run this in your PR validation pipeline to ensure PRs comply with design and architecture specifications documented in Confluence or Jira.

```shell
#!/usr/bin/env bash
set -euo pipefail

# -----------------------------------------------------------------------------
# PR Conformance & Context Enricher using TWG CLI + Rovo AI
# -----------------------------------------------------------------------------

PR_ID="${1:-${BITBUCKET_PR_ID:-}}"
REPO_NAME="${2:-${BITBUCKET_REPO_SLUG:-}}"

if [[ -z "$PR_ID" || -z "$REPO_NAME" ]]; then
  echo "Usage: $0 <PR_ID> <REPO_NAME>"
  exit 1
fi

echo "=== Analyzing PR #$PR_ID in $REPO_NAME ==="

# 1. Extract Jira ticket key from branch or PR title (e.g., AUTOX-1024)
JIRA_KEY=$(twg bitbucket pr get --repo "$REPO_NAME" --id "$PR_ID" --format json | grep -oE '[A-Z]{2,10}-[0-9]+' | head -1 || true)

if [[ -z "$JIRA_KEY" ]]; then
  echo "⚠️ No Jira issue key detected in PR description or branch name."
  exit 0
fi

echo "Found linked Jira issue: $JIRA_KEY"

# 2. Extract Jira requirements and acceptance criteria
twg jira issue get --key "$JIRA_KEY" --format json > /tmp/jira_issue.json

# 3. Query Rovo Search to find the latest Confluence specs or Figma links related to the ticket
twg rovo search \
  --query "$JIRA_KEY spec requirements design conformance" \
  --limit 3 \
  --format markdown > /tmp/related_specs.md

# 4. Get PR diff summary
twg bitbucket pr diff --repo "$REPO_NAME" --id "$PR_ID" --stat > /tmp/pr_diff.txt

# 5. Use Rovo AI to evaluate conformance and draft an enriched PR review summary
twg rovo evaluate \
  --context "/tmp/jira_issue.json,/tmp/related_specs.md,/tmp/pr_diff.txt" \
  --prompt "Check if the PR diff covers the acceptance criteria and spec details. Summarize the changes and highlight any missing test cases or edge cases." \
  --output-file /tmp/ai_pr_comment.md

# 6. Post the enriched summary back to the Bitbucket PR as a comment
twg bitbucket pr comment \
  --repo "$REPO_NAME" \
  --id "$PR_ID" \
  --file /tmp/ai_pr_comment.md

echo "✅ AI PR context comment posted successfully to PR #$PR_ID."
```

---

### 3. Shell Script: Weekly Cross-Tool Team Catch-up & Activity Digest
This script runs locally or via a cron job to aggregate what a squad worked on over the past 7 days across Jira, Confluence, and Bitbucket.

```shell
#!/usr/bin/env bash
set -euo pipefail

# -----------------------------------------------------------------------------
# Weekly Squad Activity Digest Generator
# -----------------------------------------------------------------------------

SQUAD_NAME="${1:-Insurance Core Squad}"
TIMEFRAME="${2:-7d}"
OUTPUT_DIR="./reports"
mkdir -p "$OUTPUT_DIR"

DATE_STR=$(date +'%Y-%m-%d')
OUTPUT_FILE="$OUTPUT_DIR/squad_weekly_digest_${DATE_STR}.md"

echo "Aggregating team activity for '$SQUAD_NAME' over the last $TIMEFRAME..."

# 1. Fetch cross-platform activity across Jira, PRs, and Confluence updates
twg activity \
  --team "$SQUAD_NAME" \
  --since "$TIMEFRAME" \
  --format json > /tmp/team_raw_activity.json

# 2. Use Rovo Search to gather discussions, decisions, and blockers from Confluence & Slack
twg rovo search \
  --query "$SQUAD_NAME blockers key decisions release readiness past $TIMEFRAME" \
  --limit 10 \
  --format markdown > /tmp/search_context.md

# 3. Use Rovo Summarize to synthesize a structured weekly status report
twg rovo summarize \
  --inputs /tmp/team_raw_activity.json,/tmp/search_context.md \
  --prompt "Generate a clean weekly status report:
    1. Executive Summary (3-4 bullet points)
    2. Key Accomplishments & Merged PRs
    3. Confluence Specs & Documentation Handed Over
    4. Current Blockers and At-Risk Deliverables
    5. Next Week Focus Areas" \
  --output-file "$OUTPUT_FILE"

echo "✅ Digest generated at: $OUTPUT_FILE"
cat "$OUTPUT_FILE"
```

---

### 4. Shell Script: Automated Incident Triage & Runbook Fetcher
When an alert or ticket is generated in Jira Service Management (JSM), this script uses Rovo Search to instantly locate related runbooks, past resolved post-mortems, and subject matter experts.

```shell
#!/usr/bin/env bash
set -euo pipefail

INCIDENT_KEY="${1:-}"

if [[ -z "$INCIDENT_KEY" ]]; then
  echo "Usage: $0 <INCIDENT_JIRA_KEY>"
  echo "Example: $0 INCIDENT-304"
  exit 1
fi

echo "=== Triaging Incident: $INCIDENT_KEY ==="

# 1. Fetch incident description and service details
INCIDENT_SUMMARY=$(twg jira issue get --key "$INCIDENT_KEY" --format json | jq -r '.fields.summary // empty')
INCIDENT_DESC=$(twg jira issue get --key "$INCIDENT_KEY" --format json | jq -r '.fields.description // empty')

echo "Summary: $INCIDENT_SUMMARY"

# 2. Run targeted Rovo search for troubleshooting guides and post-mortems
twg rovo search \
  --query "runbook troubleshooting post-mortem for $INCIDENT_SUMMARY" \
  --types confluence_page,incident \
  --limit 5 \
  --format json > /tmp/incident_kb.json

# 3. Discover recent code commits or deployments around the affected service
twg context \
  --id "$INCIDENT_KEY" \
  --include "recent_deployments,collaborators,related_pull_requests" \
  --format json > /tmp/incident_context.json

# 4. Generate instant AI Incident Briefing
twg rovo summarize \
  --inputs /tmp/incident_kb.json,/tmp/incident_context.json \
  --prompt "Given this active incident, provide:
    - Likely root cause hypotheses based on previous post-mortems
    - Direct links to standard runbooks
    - Key team contacts / recent committers
    - Recommended mitigation steps" \
  --output-file /tmp/incident_triage_brief.md

# 5. Attach triage brief to the Jira incident ticket for responders
twg jira issue comment \
  --key "$INCIDENT_KEY" \
  --file /tmp/incident_triage_brief.md

echo "✅ Incident briefing attached to $INCIDENT_KEY."
```

---

### 5. Best Practices for CI/CD & Headless Environments
1. **Headless Authentication**:
    * Use `twg auth ci-login --token "$TWG_CI_SERVICE_TOKEN"` or set `TWG_AUTH_TOKEN` in CI/CD secrets.
    * Avoid interactive browser login (`twg login`) inside headless containers.
2. **Deterministic Output Formats**:
    * Always pass `--format json` or `--format markdown` when chaining tools to parse with `jq` or feed into subsequent CLI tools.
3. **Credit Management**:
    * Basic lookups (`twg jira issue get`, `twg confluence page get`) consume standard plan limits.
    * AI queries (`twg rovo search`, `twg rovo summarize`, `twg rovo evaluate`) utilize Rovo Credits—target specific queries and avoid excessive loops in CI steps.
4. **Caching & Binary Setup**:
    * In Docker-based CI runners, install `twg` in the base Docker image or cache `~/.local/bin/twg` to speed up pipeline execution.
