#!/bin/sh

# Open first terminal and run 'sudo nano csr_dash_start.sh'
xterm -e "npx local-ssl-proxy --source 3001 --target 3000" &

# Open second terminal and run 'npm start'
xterm -e "npm start" &



