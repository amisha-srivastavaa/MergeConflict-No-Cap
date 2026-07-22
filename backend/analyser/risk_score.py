RISK_MESSAGES = {
    "SAFE": "No hidden capabilities detected.",
    "MEDIUM": "Some behaviors are not mentioned in the description.",
    "HIGH": "Potentially malicious hidden behaviors detected."
}


def calculate_risk(hidden_behaviors):

    count = len(hidden_behaviors)

    if count == 0:
        return (
            10,
            "SAFE",
            RISK_MESSAGES["SAFE"]
        )

    if count == 1:
        return (
            55,
            "MEDIUM",
            RISK_MESSAGES["MEDIUM"]
        )

    score = min(100, 55 + count * 15)

    return (
        score,
        "HIGH",
        RISK_MESSAGES["HIGH"]
    )