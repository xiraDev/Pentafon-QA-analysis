import React, { useState, useEffect } from 'react';

import { Delete } from '@mui/icons-material';
import { Stack, Button, Container, Typography, IconButton, LinearProgress } from '@mui/material';

import axios from 'src/utils/axios';

import { toast } from 'src/components/snackbar';

import { useTranslate as useLocales } from '../../../locales/use-locales';

const ALLOWED_TYPES = [
  'audio/mpeg', 'audio/mp4', 'audio/mp2', 'audio/aac', 'audio/wav',
  'audio/flac', 'audio/pcm', 'audio/m4a', 'audio/ogg', 'audio/opus', 'audio/webm'
];

const AudioUpload = () => {
  const { t: translate } = useLocales();
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [fileStatus, setFileStatus] = useState([]);
  const [isFinished, setIsFinished] = useState(false)
  const [buttonMessage, setButtonMessage] = useState("Enviar audios a procesar")

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length === 0) return;

    const validFiles = selectedFiles.filter(file => ALLOWED_TYPES.includes(file.type));
    if (validFiles.length === 0) {
      toast.error('Tipos de archivo no permitidos');
      return;
    }

    setFiles(validFiles);
    setFileStatus(validFiles.map((file) => ({ fileName: file.name, status: 'pendiente', progress: 0 })));
    setIsFinished(false)
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
    setFileStatus(fileStatus.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    setUploading(true);
    const campaign = 'template-business';
    const formData = new FormData();
    let retry = false
    if(buttonMessage === "Procesar los audios fallidos"){retry = true}
    formData.append('campaign', campaign);
    formData.append('amount', files.length);
    let tempfiles
    if(retry){
      tempfiles = files.filter((file, idx) => fileStatus[idx]?.status === 'fallido')
    }
    else {
      tempfiles = [...files]
    }
    tempfiles.forEach((file, idx) => {
      formData.append(`file_${idx}`, file);
    });

    try {
      setFileStatus((prevStatus) => prevStatus.map((file) => ({...file, status: 'cargando', progress: 0 })));
      const res = await axios.post('/api/v1/audios/', formData);
      setFileStatus((prev) => prev.map((file) => {
        const match = res.data.meta.results.find((result) => result.audioName === file.fileName);
        const matchResult = match.result === "Error" && match.errorMessage === "El archivo ya existe" ? "Success" : match.result
        return match ? { ...file, status: matchResult, progress: 100 } : file;
      }));

      
    } catch (error) {
      console.error('Error al subir los archivos:', error);
      setFileStatus((prevStatus) => prevStatus.map(() => ({ status: 'fallido', progress: 0 })));
    } finally{
      setUploading(false);
      setIsFinished(true)
    }
  };

  useEffect(()=>{
    if(uploading){
      setButtonMessage("Procesando...")
      return
    } 
    
    if(isFinished && !fileStatus.some(fs=>fs === "fallido")){
      setButtonMessage("Pocesar los audios fallidos")
      return
    }

    setButtonMessage("Enviar audios a procesar")
  },[uploading, isFinished, fileStatus])

  return (
    <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', paddingTop: 4 }}>
      <Stack spacing={2} direction="column" sx={{ width: '100%', maxWidth: 800 }}>
        <Typography variant="h6" textAlign="center">{translate('Subir audios')}</Typography>
          <Button 
            variant="contained" 
            component="label" 
            disabled={uploading}
            sx={{
              backgroundColor: '#1c252e',
              color: '#FFF',
              padding: '12px 24px',
              borderRadius: '8px',
              '&:hover': { backgroundColor: '#454f5b' }
            }} 
          >
            {files.length === 0 ? translate('Subir archivos de audio') : translate('Subir otros archivos de audio')}
            <input type="file" multiple accept="audio/*" hidden onChange={handleFileChange} />
          </Button>

        <Stack spacing={1} sx={{ maxHeight: '60vh', overflowY: 'auto', width: '100%' }}>
          {files.map((file, index) => (
            <Stack key={index} direction="row" alignItems="center" justifyContent="space-around" spacing={3}>
              <Typography variant="body2">{file.name}</Typography>
              <Typography variant="body2">({(file.size / 1024).toFixed(2)} KB)</Typography>
              {fileStatus[index]?.status === 'cargando' && (
                <LinearProgress variant="determinate" value={fileStatus[index]?.progress || 0} sx={{ flex: 1 }} />
              )}
              {fileStatus[index]?.status === 'Success' && <Typography color="green">{translate('completado')}</Typography>}
              {fileStatus[index]?.status === 'Error' && <Typography color="error">{translate('fallido')}</Typography>}
              <IconButton onClick={() => removeFile(index)} disabled={uploading}>
                <Delete color="error" />
              </IconButton>
            </Stack>
          ))}
        </Stack>

        {files.length > 0 && (
          <Button 
            variant="contained" 
            color="primary"
            onClick={uploadFiles} disabled={uploading || files.length === 0 || isFinished && !fileStatus.some(fs=>fs.status === "Error")}
            sx={{
              padding: '12px 24px',
            }}
            
          >
            {translate(buttonMessage)}
          </Button>
        )}
      </Stack>
    </Container>
  );
};

export default AudioUpload;
