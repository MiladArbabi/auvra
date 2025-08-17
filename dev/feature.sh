#!/usr/bin/env bash
set -euo pipefail

# --- config -------------------------------------------------------------
DEFAULT_BASE_BRANCH="${BASE_BRANCH:-main}"
CONVENTIONAL_TYPE_DEFAULT="${CONVENTIONAL_TYPE:-feat}"
SCOPE_DEFAULT="${SCOPE:-}"             # e.g., analytics, seo, frontend
REPO_ENV="${REPO:-}"                   # override owner/name if you prefer
# -----------------------------------------------------------------------

assert_cmd() { command -v "$1" >/dev/null 2>&1 || { echo "Missing: $1"; exit 1; }; }
assert_cmd git
assert_cmd gh

get_repo_slug() {
  if [[ -n "$REPO_ENV" ]]; then echo "$REPO_ENV"; return; fi
  local url
  url="$(git remote get-url origin 2>/dev/null || true)"
  if [[ "$url" == git@github.com:* ]]; then
    echo "${url#git@github.com:}" | sed 's/\.git$//'
  elif [[ "$url" == https://github.com/* ]]; then
    echo "${url#https://github.com/}" | sed 's/\.git$//'
  else
    echo "Could not determine repo from origin. Set REPO=owner/name." >&2
    exit 1
  fi
}

slugify() { tr '[:upper:]' '[:lower:]' <<<"$1" | sed -E 's/[^a-z0-9]+/-/g; s/^-+|-+$//g' | cut -c1-60; }

current_branch() { git rev-parse --abbrev-ref HEAD; }

create_issue() {
  local title="$1" labels="${2:-}" milestone="${3:-}" body="${4:-}"
  local args=(issue create -R "$(get_repo_slug)" --title "$title")
  [[ -n "$labels"    ]] && args+=(--label "$labels")
  [[ -n "$milestone" ]] && args+=(--milestone "$milestone")
  # Always pass a body to avoid editor prompts on older gh
  args+=(--body "${body:- }")

  local out
  out="$(gh "${args[@]}")" || { echo "gh issue create failed" >&2; exit 1; }

  # Parse plain URL, then take the last path segment as the number
  local url num
  url="$(echo "$out" | grep -Eo 'https://github\.com/[^ ]+/issues/[0-9]+' | tail -n1)"
  num="${url##*/}"
  [[ -n "$num" ]] || { echo "Could not parse issue number from gh output:" >&2; echo "$out" >&2; exit 1; }
  printf '%s %s\n' "$num" "$url"
}

ensure_base_up_to_date() { git fetch origin "$DEFAULT_BASE_BRANCH" >/dev/null 2>&1 || true; }

start_feature() {
  local title="$1"; shift || true
  OPTIND=1
  local labels="" milestone="" body=""

  while getopts "l:m:b:" opt; do
    case $opt in
      l) labels="$OPTARG" ;;
      m) milestone="$OPTARG" ;;
      b) body="$(cat "$OPTARG")" ;;
    esac
  done

  echo "Creating issue in $(get_repo_slug)…"
  local out; out="$(create_issue "$title" "$labels" "$milestone" "$body")"
  local num url
  num="$(awk '{print $1}' <<<"$out")"
  url="$(awk '{print $2}' <<<"$out")"
  echo "Issue #$num → $url"

  ensure_base_up_to_date
  local branch="feat/$(slugify "$title")-$num"
  git checkout -b "$branch" "origin/$DEFAULT_BASE_BRANCH" 2>/dev/null || git checkout -b "$branch"
  echo "Switched to branch $branch"
  echo "$num" > .issue-number
}

conventionalize_msg() {
  local msg="$1"
  case "$msg" in
    feat:\ *|feat\(*\):\ *|fix:\ *|fix\(*\):\ *|chore:\ *|chore\(*\):\ *|docs:\ *|docs\(*\):\ *|refactor:\ *|refactor\(*\):\ *|perf:\ *|perf\(*\):\ *|test:\ *|test\(*\):\ *)
      echo "$msg";;
    *)
      local type="$CONVENTIONAL_TYPE_DEFAULT"
      local scope=""
      [[ -n "$SCOPE_DEFAULT" ]] && scope="($SCOPE_DEFAULT)"
      echo "$type$scope: $msg";;
  esac
}

ship_feature() {
  [[ -f .issue-number ]] || { echo "No .issue-number in repo root. Run: dev/feature start \"Title\""; exit 1; }
  local issue; issue="$(tr -d '[:space:]' < .issue-number)"
  local msg_raw="${1:-}"; [[ -n "$msg_raw" ]] || { echo "Usage: dev/feature ship \"commit message\""; exit 1; }

  assert_cmd npm
  echo "Running lint/build locally…"
  npm run lint --if-present
  npm run build

  git add -A
  local msg; msg="$(conventionalize_msg "$msg_raw")"
  if git diff --cached --quiet; then
    echo "No staged changes. Creating an empty commit so a PR can open…"
    git commit --allow-empty -m "$msg

Refs #$issue"
  else
    git commit -m "$msg

Closes #$issue"
  fi
  local branch; branch="$(current_branch)"
  git push -u origin "$branch"

  echo "Opening PR and setting auto-merge (squash)…"
  local body="Auto-created for feature #$issue

- [x] Local lint/build passed
- [ ] CI green

Closes #$issue"
  local out pr_url pr_num
  out="$(gh pr create -R "$(get_repo_slug)" --title "$msg" --body "$body" --base "$DEFAULT_BASE_BRANCH" --head "$branch" || true)"
  pr_url="$(echo "$out" | grep -Eo 'https://github\.com/[^ ]+/pull/[0-9]+' | tail -n1)"
  if [[ -z "$pr_url" ]]; then
    pr_num="$(gh pr list --head "$branch" --limit 1 | sed -n 's/^#\([0-9]\+\).*/\1/p' | head -n1 || true)"
    if [[ -n "$pr_num" ]]; then
      pr_url="https://github.com/$(get_repo_slug)/pull/$pr_num"
    fi
  fi
  [[ -n "$pr_url" ]] || { echo "Could not determine PR URL. gh output was:"; echo "$out"; exit 1; }
  echo "PR: $pr_url"

  gh pr merge --squash --auto "$pr_url"
  echo "Set to auto-merge when CI passes. Once merged, the issue will close automatically."
  echo "Tip: watch checks:"
  echo "  gh pr checks $pr_url --watch"
}

case "${1-}" in
  start) shift; [[ $# -ge 1 ]] || { echo "Usage: dev/feature start \"Title\" [-l \"labels\"] [-m \"Milestone\"] [-b body.md]"; exit 1; }; start_feature "$@";;
  ship)  shift; ship_feature "$@";;
  *)     cat <<'USAGE'
Usage:
  dev/feature start "My feature title" [-l "frontend,analytics"] [-m "Sprint 1 – Commerce wiring"] [-b body.md]
  dev/feature ship  "feat(scope): implement my feature"

Env (optional):
  REPO=owner/name   BASE_BRANCH=main   CONVENTIONAL_TYPE=feat   SCOPE=analytics
USAGE
  ;;
esac
