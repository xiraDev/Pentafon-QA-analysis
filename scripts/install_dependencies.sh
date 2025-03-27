#!/bin/bash
sudo chown -R ubuntu:ubuntu /home/ubuntu/pentafon-qa-analysis #Ruta de la carpeta
sudo chmod 775 /home/ubuntu/pentafon-qa-analysis

#1Instalamos el Back 2Instalamos y corremos el Front 3Revisar la ruta que coincida con la parte izquierda
sudo -u ubuntu bash << EOF
echo "Entro a Backend"
cd /home/ubuntu/pentafon-qa-analysis/backend/
npm install 

echo "Entro a Frontend"
cd /home/ubuntu/pentafon-qa-analysis/frontend/
npm install
# npm run build

EOF