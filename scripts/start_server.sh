#!/bin/bash

sudo -u ec2-user bash << EOF
cd /home/ec2-user/pentafon-qa-analysis
pm2 restart ecosystem.config.js

EOF