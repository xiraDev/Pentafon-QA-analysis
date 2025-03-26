#!/bin/bash
sudo chown -R ec2-user:ec2-user /home/ec2-user/template-analyze-qa #Ruta de la carpeta
sudo chmod 775 /home/ec2-user/template-analyze-qa

#1Instalamos el Back 2Instalamos y corremos el Front 3Revisar la ruta que coincida con la parte izquierda
sudo -u ec2-user bash << EOF
echo "Entro a Backend"
cd /home/ec2-user/template-analyze-qa/backend/
npm install 

echo "Entro a Frontend"
cd /home/ec2-user/template-analyze-qa/frontend/
npm install
npm run build

EOF