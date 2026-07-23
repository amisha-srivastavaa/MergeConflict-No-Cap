from github.fetcher import (
    fetch_readme,
    fetch_repository_code
)

url = "https://github.com/psf/requests"

readme = fetch_readme(url)

code = fetch_repository_code(url)

print("README length:", len(readme))
print("CODE length:", len(code))
print(code[:1000])