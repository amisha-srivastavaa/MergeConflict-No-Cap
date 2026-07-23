from urllib.parse import urlparse


def parse_github_url(url: str):
    parsed = urlparse(url)

    parts = parsed.path.strip("/").split("/")

    if len(parts) < 2:
        raise ValueError("Invalid GitHub repository URL")

    owner = parts[0]
    repo = parts[1].replace(".git", "")

    return owner, repo