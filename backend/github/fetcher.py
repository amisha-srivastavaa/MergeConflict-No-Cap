import requests

from .parser import parse_github_url
SUPPORTED_EXTENSIONS = {
    ".py",
    ".js",
    ".ts",
    ".tsx",
    ".java",
    ".cpp",
    ".c",
    ".go",
    ".rs",
}

GITHUB_API = "https://api.github.com"


def fetch_readme(url: str):

    owner, repo = parse_github_url(url)

    endpoint = f"{GITHUB_API}/repos/{owner}/{repo}/readme"

    response = requests.get(
        endpoint,
        headers={
            "Accept": "application/vnd.github.raw"
        }
    )

    if response.status_code != 200:
        raise Exception(
            f"Unable to fetch README. Status: {response.status_code}"
        )

    return response.text


from pathlib import Path


def fetch_repository_code(url: str):

    owner, repo = parse_github_url(url)

    collected = []

    def walk(path=""):

        endpoint = f"{GITHUB_API}/repos/{owner}/{repo}/contents/{path}"

        response = requests.get(endpoint)

        if response.status_code != 200:
            return

        items = response.json()

        if isinstance(items, dict):
            items = [items]

        for item in items:

            if item["type"] == "dir":

                walk(item["path"])

            elif item["type"] == "file":

                ext = Path(item["name"]).suffix.lower()

                if ext not in SUPPORTED_EXTENSIONS:
                    continue

                raw = requests.get(item["download_url"])

                if raw.status_code == 200:

                    collected.append(
                        f"\n\n===== {item['path']} =====\n"
                    )

                    collected.append(raw.text)

    walk()

    return "\n".join(collected)