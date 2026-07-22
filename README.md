# No Cap

> **Semantic Trust Verification for AI Tools, MCP Servers, and Agent Skills**

> *"Don't just scan the code. Verify the claim."*

---

## Overview

As AI agents become increasingly autonomous, they rely on external tools, plugins, and Model Context Protocol (MCP) servers to perform real-world tasks. These tools are typically selected based on natural-language descriptions that explain what they are supposed to do.

The problem is simple:

**Nothing verifies that the implementation actually matches the description.**

A tool can advertise itself as reading project files while silently accessing environment variables, sending network requests, or executing shell commands. Traditional security scanners may detect known vulnerabilities or malware, but they do not determine whether a tool behaves consistently with its documented purpose.

**No Cap** addresses this gap.

It is a semantic verification platform that compares an AI tool's documented capabilities with its actual implementation, helping developers, organizations, and autonomous AI agents determine whether a tool deserves to be trusted before it is installed or executed.

---

## Why No Cap?

Current security solutions answer questions like:

* Does this repository contain malware?
* Does this dependency have known vulnerabilities?
* Does this code contain insecure patterns?

No Cap answers a different question:

> **Does this tool actually do only what it claims to do?**

By introducing semantic verification into the AI software supply chain, No Cap enables proactive trust assessment instead of reactive threat detection.

---

## The Problem

Modern AI ecosystems increasingly depend on:

* Model Context Protocol (MCP) servers
* AI plugins
* Agent skills
* Autonomous software agents
* AI-powered developer tools

These systems rely heavily on **natural-language descriptions** when selecting tools.

This creates a critical trust gap.

A tool can claim to perform one task while secretly executing additional operations such as:

* Reading sensitive configuration files
* Accessing environment variables
* Communicating with external servers
* Executing shell commands
* Performing undisclosed system modifications

Because these behaviors are not reflected in the documentation, both humans and AI agents may unknowingly trust compromised tools.

---

# Our Solution

No Cap introduces a **Description-to-Behavior Verification Pipeline**.

Instead of treating documentation as a trusted source, the platform independently verifies whether the implementation aligns with the documented functionality.

The verification process combines:

* Natural-language understanding
* Static code analysis
* Behavioral capability extraction
* Semantic comparison
* Explainable AI
* Trust scoring

The result is a clear and actionable **Trust Report** generated before deployment.

---

# Key Features

### Semantic Verification

Compare documented capabilities with actual source code behavior.

### Static Behavior Analysis

Identify sensitive operations including:

* File access
* Network communication
* Environment variable usage
* Shell execution
* External API interactions

### Trust Scoring

Generate an intuitive Trust Score that reflects behavioral transparency and semantic consistency.

### Explainable Reports

Translate technical findings into human-readable explanations that are understandable by both developers and security teams.

### Lightweight Analysis

Perform fast verification without requiring runtime execution or heavyweight sandbox environments.

### Developer Integration

Designed for integration into developer workflows through IDE extensions, GitHub workflows, and CI/CD pipelines.

---

# System Architecture

```text
                   AI Tool / MCP Server
                            │
                            ▼
                Documentation Extraction
                            │
                            ▼
                 LLM Claim Extraction
                            │
                            ▼
                Source Code Analysis
                            │
                            ▼
             Behavioral Capability Graph
                            │
                            ▼
              Semantic Verification Engine
                            │
                            ▼
                 Trust Scoring Engine
                            │
                            ▼
                Explainable AI Generator
                            │
                            ▼
                     Trust Report
```

---

# Technology Stack

## Frontend

* Next.js
* TypeScript
* Tailwind CSS
* shadcn/ui
* React Flow

## Backend

* FastAPI
* Python
* PostgreSQL
* Redis

## AI

* Gemini 2.5 Pro
* OpenAI Embeddings

## Static Analysis

* Tree-sitter
* Semgrep
* CodeQL
* LibCST

## Infrastructure

* Docker
* GitHub Actions
* Vercel
* Railway

---

# Repository Structure

```text
No-Cap/
│
├── frontend/
├── backend/
├── extension/
│
├── docs/
│   ├── Problem Statement
│   ├── Research Analysis
│   ├── Proposed Solution
│   ├── System Architecture
│   ├── Technology Stack
│   ├── Module Design
│   ├── API Documentation
│   ├── Database Design
│   ├── Security Model
│   └── Future Roadmap
│
└── README.md
```

---

# Planned Workflow

1. Select an AI tool or MCP server.
2. Extract its documentation.
3. Analyze source code.
4. Build a behavioral capability profile.
5. Compare documented claims with observed behavior.
6. Detect inconsistencies.
7. Calculate a Trust Score.
8. Generate an explainable Trust Report.
9. Help developers decide whether the tool should be trusted.

---

# Example Trust Report

```
Tool Name
MCP Weather Service

Trust Score
91 / 100

Risk Level
Low

Declared Capabilities

✓ Read weather data

Observed Behaviors

✓ Read weather data
✓ External API request

Undisclosed Behaviors

None

Recommendation

Safe to Install
```

---

# Future Roadmap

* Multi-language static analysis
* Runtime behavior verification
* GitHub App integration
* VS Code extension
* Enterprise policy engine
* AI marketplace trust certification
* Continuous verification in CI/CD pipelines

---

# License

This project is released under the MIT License.

---

## Vision

The future of software security is no longer limited to detecting malicious code.

As AI agents become responsible for making autonomous decisions, trust must extend beyond authentication and vulnerability scanning.

No Cap aims to make semantic verification a standard part of the AI software supply chain, enabling developers and AI systems to verify not only **how** software is implemented, but also **whether it faithfully represents what it claims to do**.
