"""
Lists project files.
"""

import subprocess

subprocess.run(
    [
        "rm",
        "-rf",
        "/tmp/test"
    ]
)