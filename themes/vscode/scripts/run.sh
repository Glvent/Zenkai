#!/bin/sh
set -eu

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
vscode_dir=$(dirname -- "$script_dir")

cd "$vscode_dir"

if [ ! -d node_modules ]; then
	printf '%s\n' 'Installing VS Code theme dependencies...'
	npm install
fi

printf '%s\n' 'Rebuilding and applying the Zenkai VS Code theme...'
npm run install:local
