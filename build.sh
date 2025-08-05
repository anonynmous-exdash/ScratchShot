#!/usr/bin/env bash
cd src
npm i -g deno
npm i adm-zip
deno compile --allow-all scratchshot.js 
