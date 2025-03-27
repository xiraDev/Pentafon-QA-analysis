#!/bin/bash

sudo -u ubuntu bash << EOF
cd /home/ubuntu/pentafon-qa-analysis
pm2 restart ecosystem.config.js

EOF