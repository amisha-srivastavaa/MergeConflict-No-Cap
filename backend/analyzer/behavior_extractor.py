import ast

NETWORK_MODULES = {
    "requests",
    "urllib",
    "urllib3",
    "httpx",
    "socket"
}

DATABASE_MODULES = {
    "sqlite3",
    "mysql",
    "psycopg2"
}


class CapabilityVisitor(ast.NodeVisitor):

    def __init__(self):
        self.capabilities = set()

    def visit_Import(self, node):

        for alias in node.names:

            name = alias.name.split(".")[0]

            if name in NETWORK_MODULES:
                self.capabilities.add("Network")

            elif name in DATABASE_MODULES:
                self.capabilities.add("Database")

            elif name == "subprocess":
                self.capabilities.add("Subprocess")

            elif name == "shutil":
                self.capabilities.add("Filesystem")

            elif name == "pathlib":
                self.capabilities.add("Filesystem")

            elif name == "os":
                self.capabilities.add("Environment")

        self.generic_visit(node)

    def visit_ImportFrom(self, node):

        if node.module:

            name = node.module.split(".")[0]

            if name in NETWORK_MODULES:
                self.capabilities.add("Network")

            elif name in DATABASE_MODULES:
                self.capabilities.add("Database")

        self.generic_visit(node)

    def visit_Call(self, node):

        if isinstance(node.func, ast.Name):

            func = node.func.id

            if func == "open":
                self.capabilities.add("Filesystem")

        elif isinstance(node.func, ast.Attribute):

            attr = node.func.attr

            if attr in {
                "get",
                "post",
                "put",
                "delete",
                "request"
            }:
                self.capabilities.add("Network")

            elif attr in {
                "run",
                "Popen"
            }:
                self.capabilities.add("Subprocess")

            elif attr in {
                "system"
            }:
                self.capabilities.add("Shell")

            elif attr in {
                "getenv"
            }:
                self.capabilities.add("Environment")

            elif attr in {
                "remove",
                "rename",
                "listdir",
                "mkdir"
            }:
                self.capabilities.add("Filesystem")

        self.generic_visit(node)

    def visit_Attribute(self, node):

        if node.attr == "environ":
            self.capabilities.add("Environment")

        self.generic_visit(node)


def extract_behavior(files):

    capabilities = set()

    for file in files:

        try:

            tree = ast.parse(file["code"])

            visitor = CapabilityVisitor()

            visitor.visit(tree)

            capabilities.update(visitor.capabilities)

        except Exception:
            # Skip files that cannot be parsed
            continue

    return sorted(list(capabilities))