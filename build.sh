#!/usr/bin/env bash
npm i -g deno
npm i adm-zip
deno compile --allow-all src/scratchshot.js 
deno compile --allow-all --target x86_64-pc-windows-msvc src/scratchshot.js