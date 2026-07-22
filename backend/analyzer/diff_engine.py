def compare_claims_behavior(claims, behavior):
    """
    Returns behaviors present in code but absent in description.
    """

    claims_set = {c.lower() for c in claims}
    behavior_set = {b.lower() for b in behavior}

    hidden = behavior_set - claims_set

    return sorted(list(hidden))