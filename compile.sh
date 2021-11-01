#!/bin/bash
tsc index.tsx src/Chat/*.tsx --jsx react-jsx --esModuleInterop --lib "dom,dom.iterable,esnext"
sed -i 's/\"\@yokowasis\/firegun\"\: \"file\:\.\.\/firegun\"/\"\@yokowasis\/firegun\" : \"@latest\" /g' ./package.json
npm publish
sed -i 's/\"\@yokowasis\/firegun\" : \"@latest\"/\"\@yokowasis\/firegun\"\: \"file\:\.\.\/firegun\" /g' ./package.json
bash clean.sh
