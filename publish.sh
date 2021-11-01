#!/bin/bash
tsc index.tsx src/Chat/*.tsx --jsx react-jsx --esModuleInterop --lib "dom,dom.iterable,esnext"
npm publish
bash clean.sh
