#!/bin/bash

sudo -u ec2-user bash << EOF
cd /home/ec2-user/template-analyze-qa
pm2 restart ecosystem.config.js

EOF