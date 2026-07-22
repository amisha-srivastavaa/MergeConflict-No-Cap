import ast

CAPABILITIES = {
    "open": "Filesystem",

    "getenv": "Environment",
    "environ": "Environment",

    "system": "Shell",
    "popen": "Subprocess",
    "run": "Subprocess",

    "get": "Network",
    "post": "Network",
    "put": "Network",
    "delete": "Network",

    "connect": "Network",

    "sqlite3": "Database",

    "connect_db": "Database"
}


class CapabilityVisitor(ast.NodeVisitor):

    def __init__(self):
        self.capabilities = set()

    def visit_Call(self, node):

        name = ""

        if isinstance(node.func, ast.Name):
            name = node.func.id

        elif isinstance(node.func, ast.Attribute):
            name = node.func.attr

        capability = CAPABILITIES.get(name)

        if capability:
            self.capabilities.add(capability)

        self.generic_visit(node)

    def visit_Attribute(self, node):

        if node.attr == "environ":
            self.capabilities.add("Environment")

        self.generic_visit(node)


def extract_behavior(code: str):

    try:

        tree = ast.parse(code)

        visitor = CapabilityVisitor()

        visitor.visit(tree)

        return sorted(list(visitor.capabilities))

    except Exception:

        return ["Parse Error"]