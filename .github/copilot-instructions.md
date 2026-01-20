<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# VS Code Virtual File System Extension

Always use get_vscode_api for VS Code API details (this project relies on core and proposed APIs).

## Big picture
- Implements an in-memory `vfs:/` file system plus search providers for Quick Open and Search.
- `src/extension.ts` wires everything: registers the FileSystemProvider and the File/Text search providers.
- `src/virtualFileSystemProvider.ts` owns the data model (in-memory Maps/Sets) and fires change events.
- `src/fileSearchProvider.ts` and `src/textSearchProvider.ts` read from the provider’s public data structures.
- Proposed APIs are enabled in `package.json` via `enabledApiProposals` (file/text search).

## Key workflows
- Build: `pnpm run compile` (TypeScript compile).
- Watch: `pnpm run watch`.
- Lint: `pnpm run lint`.
- Debug: press F5 to launch Extension Development Host (see DEBUG-GUIDE.md).
- After launch, run the command “Mount Virtual File System” to mount `vfs:/`.

## Project-specific patterns
- Use `FileSystemError` for FS failures and fire file-change events after mutations.
- The `vfs:` scheme is the single integration point for providers and URIs.
- Search providers must honor include/exclude patterns, `maxResults`, and cancellation tokens.
- Keep `virtualFileSystemProvider.ts` as the source of truth for file/directory state; providers read from it.

## Useful references
- Architecture and provider details: README.md, IMPLEMENTATION.md.
- Manual test steps: TESTING.md (Quick Open + Search behaviors).
- Provider entry points: src/extension.ts, src/virtualFileSystemProvider.ts, src/fileSearchProvider.ts, src/textSearchProvider.ts.
