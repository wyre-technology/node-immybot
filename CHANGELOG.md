## [1.0.3](https://github.com/wyre-technology/node-immybot/compare/v1.0.2...v1.0.3) (2026-07-22)


### Bug Fixes

* **deps:** re-pin typescript to ^6.0.3, TS7 native compiler breaks rollup-plugin-dts ([#29](https://github.com/wyre-technology/node-immybot/issues/29)) ([fcd2a64](https://github.com/wyre-technology/node-immybot/commit/fcd2a64e6fe3e0be121c1b0678d0bfd5d7187cd5)), closes [wyre-technology/blackpoint-mcp#44](https://github.com/wyre-technology/blackpoint-mcp/issues/44)

## [1.0.2](https://github.com/wyre-technology/node-immybot/compare/v1.0.1...v1.0.2) (2026-07-06)


### Bug Fixes

* **ci:** silence TS6 baseUrl deprecation so tsup DTS build passes ([#24](https://github.com/wyre-technology/node-immybot/issues/24)) ([59d6af6](https://github.com/wyre-technology/node-immybot/commit/59d6af686a30cd4767323638ea41bdbd7223b8b6)), closes [#7](https://github.com/wyre-technology/node-immybot/issues/7)

## [1.0.1](https://github.com/wyre-technology/node-immybot/compare/v1.0.0...v1.0.1) (2026-06-08)


### Bug Fixes

* **security:** bump vitest + @vitest/coverage-v8 1.x -> 3.2.6 ([#16](https://github.com/wyre-technology/node-immybot/issues/16)) ([5f8b8e4](https://github.com/wyre-technology/node-immybot/commit/5f8b8e4b41a51e60c3b2ea8d07a676d2662feba1))

# 1.0.0 (2026-05-26)


### Features

* initial scaffold for @wyre-technology/node-immybot ([125737f](https://github.com/wyre-technology/node-immybot/commit/125737fe954127fd65bd5c9b952492265a126103))

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial release of ImmyBot API client library
- OAuth 2.0 authentication with Microsoft Entra ID
- Full TypeScript support with comprehensive type definitions
- Zero runtime dependencies (uses native fetch)
- Rate limiting with token bucket algorithm
- Comprehensive error handling with structured error types
- Support for all major ImmyBot API resources:
  - Computers (devices/endpoints)
  - Software (applications and packages) 
  - Deployments (desired state configuration)
  - Scripts (PowerShell execution)
  - Tenants (client organizations)
  - Maintenance Sessions (state reconciliation)
  - Tasks (background operations)
- Dual module support (ESM + CommonJS)
- MSW-based testing infrastructure
- Complete API documentation and examples

### Security
- OAuth 2.0 client credentials flow for secure authentication
- Token caching with automatic refresh
- Rate limiting to prevent API abuse
- Input validation and sanitization
