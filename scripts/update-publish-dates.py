#!/usr/bin/env python3
"""Set Hugo front matter date (first git commit) and lastmod (latest commit) per file.

When the newest git commit UTC date is on or before LASTMOD_PRESERVE_BEFORE_UTC_DAY_INCLUSIVE,
existing lastmod in front matter is kept instead of overwriting from git. Uses git lastmod if
YAML has no lastmod yet. Commits strictly after that UTC day still refresh lastmod from git.
"""

from __future__ import annotations

import argparse
import subprocess
import sys
from datetime import date, datetime, timezone
from pathlib import Path

# Preserve YAML lastmod when latest git commit is this UTC calendar day or earlier (inclusive cutoff).
LASTMOD_PRESERVE_BEFORE_UTC_DAY_INCLUSIVE = date(2026, 5, 15)


def repo_root() -> Path:
    script_dir = Path(__file__).resolve().parent
    return script_dir.parent


def git_iso_dates(rel_path: str, cwd: Path) -> tuple[str | None, str | None]:
    """Return (first_commit_iso, last_commit_iso) in UTC Z format, or (None, None)."""
    try:
        proc = subprocess.run(
            [
                "git",
                "log",
                "--follow",
                "--format=%cI",
                "--",
                rel_path,
            ],
            cwd=cwd,
            capture_output=True,
            text=True,
            check=False,
        )
    except OSError as exc:
        print(f"⚠️  Cannot run git log for {rel_path}: {exc}", file=sys.stderr)
        return None, None
    if proc.returncode != 0:
        return None, None
    timestamps = [
        ln.strip() for ln in proc.stdout.strip().splitlines() if ln.strip()
    ]
    if not timestamps:
        return None, None

    newest = timestamps[0]
    oldest = timestamps[-1]

    try:
        return to_utc_z(oldest), to_utc_z(newest)
    except ValueError:
        print(f"⚠️  Bad timestamp from git for {rel_path}", file=sys.stderr)
        return None, None


def to_utc_z(git_iso: str) -> str:
    s = git_iso.strip()
    if s.endswith("Z"):
        dt = datetime.fromisoformat(s.replace("Z", "+00:00"))
    else:
        dt = datetime.fromisoformat(s)
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    else:
        dt = dt.astimezone(timezone.utc)
    return dt.strftime("%Y-%m-%dT%H:%M:%SZ")


def list_tracked_content_markdown(root: Path, content_prefix: str) -> list[str]:
    """Paths as recorded in git (matches `git log -- path` on case-insensitive filesystems)."""
    proc = subprocess.run(
        ["git", "ls-files", "-z", "--", content_prefix],
        cwd=root,
        capture_output=True,
        check=False,
    )
    if proc.returncode != 0:
        print("❌ git ls-files failed; is this a git repository?", file=sys.stderr)
        return []
    paths: list[str] = []
    for raw_entry in proc.stdout.split(b"\0"):
        if not raw_entry:
            continue
        rel = raw_entry.decode("utf-8", errors="replace")
        if rel.endswith(".md"):
            paths.append(rel)
    return sorted(paths)


def split_front_matter(raw: str) -> tuple[list[str], list[str]] | None:
    """First block only: return (front_matter_lines_without_delimiters, body_lines)."""
    lines = raw.splitlines(keepends=True)
    if not lines or lines[0].strip() != "---":
        return None

    fm: list[str] = []
    i = 1
    while i < len(lines):
        if lines[i].strip() == "---":
            return fm, lines[i + 1 :]
        fm.append(lines[i])
        i += 1
    return None


def join_front_matter(fm_lines: list[str], body_lines: list[str]) -> str:
    return "".join(["---\n", *fm_lines, "---\n", *body_lines])


def parse_lastmod_scalar(fm_lines: list[str]) -> str | None:
    """Return existing lastmod string value from front matter lines, if present."""
    for ln in fm_lines:
        st = ln.strip()
        if not st.startswith("lastmod:"):
            continue
        rest = st[8:].strip()
        if len(rest) >= 2 and rest[0] == rest[-1] and rest[0] in "\"'":
            return rest[1:-1]
        return rest.strip()
    return None


def utc_date_from_z(zulu: str) -> date:
    dt = datetime.fromisoformat(zulu.replace("Z", "+00:00"))
    return dt.astimezone(timezone.utc).date()


def lastmod_for_write(git_lastmod_z: str, fm_lines: list[str]) -> str:
    """If latest commit UTC date is on or before cutoff, keep existing lastmod; else use git."""
    if utc_date_from_z(git_lastmod_z) <= LASTMOD_PRESERVE_BEFORE_UTC_DAY_INCLUSIVE:
        preserved = parse_lastmod_scalar(fm_lines)
        if preserved is not None:
            return preserved
    return git_lastmod_z


def insert_date_fields(fm_lines: list[str], date_val: str, lastmod_val: str) -> list[str]:
    without_dates: list[str] = []
    for ln in fm_lines:
        st = ln.strip()
        if st.startswith("date:") or st.startswith("lastmod:"):
            continue
        without_dates.append(ln)

    date_line = f'date: "{date_val}"\n'
    lastmod_line = f'lastmod: "{lastmod_val}"\n'

    def find_insert_index(lines_list: list[str]) -> int:
        for i, ln in enumerate(lines_list):
            if ln.strip().startswith("icon:"):
                return i + 1
        for i, ln in enumerate(lines_list):
            if ln.strip().startswith("description:"):
                return i + 1
        for i, ln in enumerate(lines_list):
            if ln.strip().startswith("title:"):
                return i + 1
        return 0

    idx = find_insert_index(without_dates)
    # Insert after idx line; keep a single trailing newline style
    out = without_dates[:idx] + [date_line, lastmod_line] + without_dates[idx:]
    return out


def process_file(rel_path: str, root: Path, dry_run: bool, verbose: bool) -> bool:
    path = root / rel_path
    if not path.is_file():
        print(f"⏭️  Skip (missing on disk): {rel_path}")
        return True

    pub, mod = git_iso_dates(rel_path, root)
    if pub is None or mod is None:
        print(f"⚠️  No git history: {rel_path}")
        return True

    raw = path.read_text(encoding="utf-8")
    parsed = split_front_matter(raw)
    if parsed is None:
        print(f"⚠️  No YAML front matter: {rel_path}")
        return True

    fm_lines, body_lines = parsed
    mod_effective = lastmod_for_write(mod, fm_lines)
    new_fm = insert_date_fields(fm_lines, pub, mod_effective)
    new_raw = join_front_matter(new_fm, body_lines)

    if new_raw == raw:
        if verbose:
            print(f"✓ OK (unchanged): {rel_path}")
        return True

    if dry_run:
        note = ""
        if mod_effective != mod:
            note = f"  (lastmod kept: {mod_effective!r}, git had {mod!r})"
        print(f"… Would update: {rel_path}  date={pub}  lastmod={mod_effective}{note}")
        return True

    path.write_text(new_raw, encoding="utf-8")
    print(f"✅ Updated: {rel_path}")
    return True


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Print changes without writing files",
    )
    parser.add_argument(
        "-v",
        "--verbose",
        action="store_true",
        help="Print unchanged tracked files too",
    )
    parser.add_argument(
        "--content",
        default="content",
        help="Content directory relative to repo root (default: content)",
    )
    args = parser.parse_args()

    root = repo_root()
    content = root / args.content
    content_prefix = args.content.strip().rstrip("/") or "content"
    if not content.is_dir():
        print(f"❌ Content directory missing: {content}", file=sys.stderr)
        return 1

    md_paths = list_tracked_content_markdown(root, content_prefix)
    if not md_paths:
        print("❌ No tracked markdown under content/.", file=sys.stderr)
        return 1

    errors = 0
    for rel in md_paths:
        try:
            ok = process_file(rel, root, dry_run=args.dry_run, verbose=args.verbose)
            if not ok:
                errors += 1
        except OSError as exc:
            print(f"❌ {rel}: {exc}", file=sys.stderr)
            errors += 1

    if errors:
        print(f"\n❌ Finished with {errors} error(s)", file=sys.stderr)
        return 1

    print(f"\n✅ Processed {len(md_paths)} markdown file(s)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
