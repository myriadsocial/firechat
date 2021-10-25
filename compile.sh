#!/bin/bash
bash clean.sh
tsc index.tsx src/Chat/*.tsx --jsx react-jsx --esModuleInterop --lib "dom,dom.iterable,esnext"
