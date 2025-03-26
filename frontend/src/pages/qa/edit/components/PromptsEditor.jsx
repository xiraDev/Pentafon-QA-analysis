import React, { useState, useEffect } from 'react';

import { DataGrid } from '@mui/x-data-grid';
import {
  Tab,
  Box,
  Tabs,
  Card,
  Stack,
  Button,
  Select,
  Switch, 
  MenuItem,
  Container,
  TextField,
  Typography,
  InputLabel,
  CardContent,
  FormControl,
  FormControlLabel,
} from '@mui/material';

import axios from 'src/utils/axios';

import { toast } from 'src/components/snackbar';

import ExcelButtons from './ExcelButtons'

const PromptEditor = () => {
  const [prompts, setPrompts] = useState([]);
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [errorFetching, setErrorFetching] = useState(false);
  const [mustUpdate, setMustUpdate] = useState(false);
  const [isBinary, setIsBinary] = useState(null);
  const [formData, setFormData] = useState({
    promptName: '',
    specialCases: [],
    evaluationFormat: [],
    criticalErrors: [],
  });
  const [originalData, setOriginalData] = useState({});
  const [activeTab, setActiveTab] = useState(0);

  const handleSwitchChange = (event) => {
    setIsBinary(event.target.checked);
  };

  const handleSave = async () => {
    try {

      const hasCategories = formData?.evaluationFormat?.length > 0
      if(!hasCategories && !formData?.evaluationFormat[0]?.title?.length > 0){
        toast.error('Se debe incluir al menos una categoría para evaluar.');
        return;
      }
      // Validación: Verificar si la suma de puntos es 100
      const totalPoints = formData.evaluationFormat.reduce((sum, item) => sum + item.points, 0);
      if (totalPoints !== 100) {
        toast.error('La suma de los puntos debe ser exactamente 100.');
        return;
      }

      const updatedPrompt = {
        id: selectedPrompt.id,
        promptName: formData.promptName,
        specialCasesPrompt: formData.specialCases.map((item) => `${item.title}: ${item.content}`).join('- '),
        evaluationFormatPrompt: formData.evaluationFormat
          .map((item) => !isBinary ? `> ${item.title} (${item.points})\n${item.content.join('\n')}` : `> ${item.title}\n${item.content.join('\n')}`)
          .join('\n'),
        criticalErrors: formData.criticalErrors?.length ? formData.criticalErrors.map((item) => `- ${item.content}.`).join(' ') : "",
        isBinary
      };
  
      const response = await axios.patch('/api/v1/prompts/update ', updatedPrompt);
  
      if (response.status === 201) {
        // Mostrar mensaje de éxito si la actualización fue exitosa
        toast.success('Prompt actualizado exitosamente');
        // Puedes agregar aquí un mensaje o redirección si es necesario
      }
    } catch (error) {
      toast.error('Error al guardar la evaluación:', error);
      // Puedes agregar manejo de errores (p. ej., mostrar un mensaje en la UI)
    }
  };

  const handleCreate = async () => {

    const hasCategories = formData?.evaluationFormat?.length > 0
    if(!hasCategories && !formData?.evaluationFormat[0]?.title?.length > 0){
      toast.error('Se debe incluir al menos una categoría para evaluar.');
      return;
    }
    // Validación: Verificar si la suma de puntos es 100
    const totalPoints = formData.evaluationFormat.reduce((sum, item) => sum + item.points, 0);
    if (totalPoints !== 100) {
      toast.error('La suma de los puntos debe ser exactamente 100.');
      return;
    }

    if (formData?.title?.length < 5) {
      toast.error('El título de la cédula debe ser mínimo de 5 caracteres.');
      return;
    }
  
    // Validación: Verificar que cada título tenga un contenido
    const invalidEvaluation = formData.evaluationFormat.some((item) => !item.content && !item.content.trim());
    if (invalidEvaluation) {
      toast.error('Cada categoría de evaluación debe tener un contenido.');
      return;
    }
    if(formData?.promptName?.length < 4){
      toast.error('Se debe incluir un título de más de 4 caracteres para la creación de la cédula.');
      return;
    }

    // Validación: Verificar que cada título en los casos especiales tenga un contenido
    const invalidSpecialCases = formData.specialCases.some((item) => item.title && !item.content.trim());
    if (invalidSpecialCases) {
      toast.error('Cada caso especial con un título debe tener un contenido.');
      return;
    }
  
    try {
      const updatedPrompt = {
        promptName: formData.promptName,
        specialCasesPrompt: formData.specialCases.map((item) => `${item.title}: ${item.content}`).join('- '),
        evaluationFormatPrompt: formData.evaluationFormat
          .map((item) => !isBinary ? `> ${item.title} (${item.points})\n${item.content}` : `> ${item.title}\n${item.content}`)
          .join('\n'),
        criticalErrors: formData.criticalErrors?.length ? formData.criticalErrors.map((item) => `${item.title}: ${item.content}`).join('- ') : "",
        isBinary,
      };
      // console.log("uploading:", updatedPrompt)
      toast("Subiendo Cédula")
      const response = await axios.post('/api/v1/prompts/create', updatedPrompt);
      if (response.status === 201) {
        // Mostrar mensaje de éxito si la creación fue exitosa
        toast.success('Cédula creada exitosamente');
        // Puedes agregar aquí un mensaje o redirección si es necesario
        setMustUpdate(!mustUpdate)
      } else {
        toast.error("No se pudo guardar la Cédula, favor de intentar en un par de minutos")
      }
    } catch (error) {
      toast.error("No se pudo guardar la Cédula, favor de intentar en un par de minutos")
      console.error('Error al crear la evaluación:', error);
      // Puedes agregar manejo de errores (p. ej., mostrar un mensaje en la UI)
    }
  };
  
  const handleActivatePrompt = () => {
    axios.patch("/api/v1/prompts/activate", {
      id: selectedPrompt.id
    }).then(r=> { 
      const {message} = r.data 
      if(message === "Prompt activado"){
        toast.success("Evaluación activada")
      } else {
        toast.error("Error al momento de activar la evaluación")
      }
    })
  }

  const createNewPrompt = () => {
    // Activar la pestaña de "Formato de Evaluación"
    setActiveTab(0);
  
    // Añadir cinco categorías vacías al formato de evaluación
    const emptyCategories = Array(5).fill({ title: '', points: 0, content: '' });
    setOriginalData({})
    setSelectedPrompt(null)
    setFormData(() => ({
      promptName: '',
      specialCases: [],
      evaluationFormat: [...emptyCategories], 
      criticalErrors: [],
    }));
  };

  const handleDeleteRow = (field, id) => {
    // Eliminar la fila correspondiente en la categoría (field) indicada
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, index) => index !== id), // Eliminar el item por su índice
    }));
  };

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const response = await axios.get('/api/v1/prompts');
        if (response.data.status === 'error') throw new Error(response.data.message);
        setPrompts(response.data.meta);
      } catch (error) {
        console.error('Error fetching evaluations:', error);
        setErrorFetching(true);
      }
    };
    fetchPrompts();
  }, [mustUpdate]);

  // useEffect(() => {
  //   console.log("formData:", formData); // Verifica que los datos estén cargados
  // }, [formData]);

  const parseSections = (text) =>
    text
      .split('- ')
      .slice(1)
      .map((section) => {
        const parts = section.split(':');
        return { title: parts[0].trim(), content: parts.slice(1).join(':').trim() };
      });

  const parseEvaluationFormat = (text) =>
    text
      .split('>')
      .slice(1)
      .map((section) => {
        const lines = section
          .trim()
          .split('\n')
          .map((line) => line.trim())
          .filter((line) => line);
        const titleParts = lines[0].match(/^(.+?)\s*\((\d+)/);
        const title = titleParts ? titleParts[1].trim() : lines[0];
        const points = titleParts ? parseInt(titleParts[2], 10) : 0;
        const content = lines.slice(1);
        return { title, points, content };
      });
  
    const parseErrors = (text) =>
      text ? text
          .split('- ')
          .filter((section) => section.trim() !== '') // Filtra elementos vacíos
          .map((section) => ({ content: section.trim()}))
      : [];
  
  const handleSelectChange = (event) => {
    const prompt = prompts.find((p) => p.id === event.target.value);
    setSelectedPrompt(prompt);
    setIsBinary(prompt.isBinary)
    setFormData({
      promptName: prompt.promptName,
      specialCases: parseSections(prompt.specialCasesPrompt),
      evaluationFormat: parseEvaluationFormat(prompt.evaluationFormatPrompt),
      criticalErrors: parseErrors(prompt.criticalErrors),
    });
    setOriginalData({
      promptName: prompt.promptName,
      specialCases: parseSections(prompt.specialCasesPrompt),
      evaluationFormat: parseEvaluationFormat(prompt.evaluationFormatPrompt),
      criticalErrors: parseErrors(prompt.criticalErrors),
    });
  };

  const handleSelectPromptFromFile = (prompt) => {
    setSelectedPrompt(prompt);
    setFormData({
      promptName: "",
      specialCases: parseSections(prompt.specialCasesPrompt),
      evaluationFormat: parseEvaluationFormat(prompt.evaluationFormatPrompt),
      criticalErrors: parseErrors(prompt.criticalErrors)
    });
    setOriginalData({
      promptName: "",
      specialCases: parseSections(prompt.specialCasesPrompt),
      evaluationFormat: parseEvaluationFormat(prompt.evaluationFormatPrompt),
      criticalErrors: parseErrors(prompt.criticalErrors)
    });
  }


  const handleRowUpdateEvaluationFormat = (newRow, oldRow) => {
  
    // Actualizamos la fila dentro del estado formData.evaluationFormat
    const updatedEvaluationFormat = formData.evaluationFormat.map((item, index) => {
      if (index === newRow.id) {
        return { ...item, ...newRow }; // Aplicamos los cambios en la fila correspondiente
      }
      return item; // Dejamos el resto de los elementos sin cambios
    });
  
    // Actualizamos el estado con la nueva lista
    setFormData((prev) => ({
      ...prev,
      evaluationFormat: updatedEvaluationFormat,
    }));
  
    return newRow; // Retornamos la nueva fila para confirmar la actualización
  };

  const handleRowUpdateSpecialCases = (newRow, oldRow) => {
    // Validación del nuevo valor de la fila antes de actualizar el estado
    if (newRow.points < 0) {
      // Si los puntos son negativos, se lanza un error
      throw new Error('Los puntos no pueden ser negativos');
    }
  
    const updatedField = formData.specialCases.map((item, index) => {
      if (index === newRow.id) {
        return { ...item, ...newRow };
      }
      return item;
    });
  
    setFormData((prev) => ({
      ...prev,
      specialCases: updatedField,
    }));
  
    return newRow; // Retorna el nuevo valor para confirmar el cambio
  };

  const handleRowUpdatecriticalErrors = (newRow, oldRow) => {
    const updatedField = formData.criticalErrors.map((item, index) => {
      if (index === newRow.id) {
        return { ...item, ...newRow };
      }
      return item;
    });
  
    setFormData((prev) => ({
      ...prev,
      criticalErrors: updatedField,
    }));
  
    return newRow;
  };
  

  const handleProcessRowUpdateError = (error) => {
    // Aquí puedes manejar el error
    console.error('Error al procesar la actualización de la fila:', error);
    // Mostrar un mensaje o alguna acción cuando haya un error
    toast('Hubo un error al actualizar la fila. Verifica los valores.');
  };

  const addNewRow = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], { title: '', content: '', points: 0 }],
    }));
  };

  const columns = {
    specialCases: [
      { field: 'title', headerName: 'Título', flex: 1, editable: true },
      { field: 'content', headerName: 'Descripción', flex: 1, editable: true, renderCell: (params) => (
        <div
          style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            width: '100%',
          }}
          title={params.value} // Muestra el texto completo al pasar el cursor
        >
          {params.value}
        </div>
      ),
     },
    ],
    evaluationFormat: [
      { field: 'title', headerName: 'Título', flex: 1, editable: true },
      { field: 'points', headerName: 'Puntos', type: 'number', flex: 0.5, editable: true },
      { field: 'content', headerName: 'Detalles', flex: 2, editable: true },
    ],
    criticalErrors: [
      { field: 'content', headerName: 'Descripción del Error', flex: 1, editable: true },
    ]
  };

  return (
    <Container maxWidth="md">
      <Card>
        <CardContent>
          <Stack spacing={2}>
            <FormControl fullWidth>
              <InputLabel>Seleccionar evaluación</InputLabel>
              <Select value={selectedPrompt?.id || ''} onChange={handleSelectChange}>
                {prompts?.length &&
                  prompts.map((prompt) => (
                    <MenuItem key={prompt.id} value={prompt.id}>
                      {prompt.promptName}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>

            <TextField
              label="Nombre de la evaluación"
              name="promptName"
              value={formData.promptName}
              onChange={(e) => setFormData({ ...formData, promptName: e.target.value })}
              fullWidth
              multiline 
            />

            <FormControlLabel
              control={<Switch checked={!!isBinary} onChange={handleSwitchChange} />}
              label="Es evaluación binaria"
            />

            <Typography variant="h6">Editor de evaluaciones</Typography>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={activeTab} onChange={(_, newTab) => setActiveTab(newTab)}>
                <Tab label="Formato de Evaluación" />
                <Tab label="Casos Específicos" />
                <Tab label="Errores Críticos" />
                <Tab label="Excel" />
              </Tabs>
            </Box>
            
            {activeTab === 0 && (
              <Box>
                <DataGrid
                  rows={formData.evaluationFormat.map((row, index) => ({ id: index, ...row }))}
                  columns={columns.evaluationFormat.concat({
                    field: 'delete',
                    headerName: 'Eliminar',
                    renderCell: (params) => (
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleDeleteRow('evaluationFormat', params.id)}
                        sx={{marginRight: "10px"}}
                      >
                        Eliminar
                      </Button>
                    ),
                    width: 100,
                  })}
                  hideFooterPagination
                  processRowUpdate={handleRowUpdateEvaluationFormat}
                  onProcessRowUpdateError={handleProcessRowUpdateError}
                />
                <Button variant="outlined" onClick={() => addNewRow('evaluationFormat')}>
                  Añadir Categoría
                </Button>
              </Box>
            )}

            {activeTab === 1 && (
              <Box>
                <DataGrid
                  rows={formData.specialCases.map((row, index) => ({ id: index, ...row }))}
                  columns={columns.specialCases.concat({
                    field: 'delete',
                    headerName: 'Eliminar',
                    renderCell: (params) => (
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleDeleteRow('specialCases', params.id)}
                      >
                        Eliminar
                      </Button>
                    ),
                    width: 100,
                  })}
                  hideFooterPagination
                  processRowUpdate={handleRowUpdateSpecialCases}
                  onProcessRowUpdateError={handleProcessRowUpdateError}
                />
                <Button variant="outlined" onClick={() => addNewRow('specialCases')}>
                  Añadir Categoría
                </Button>
              </Box>
            )}

            {activeTab === 2 && (
              <Box>
                <DataGrid
                  rows={formData.criticalErrors.map((row, index) => ({ id: index, ...row }))}
                  columns={columns.criticalErrors.concat({
                    field: 'delete',
                    headerName: 'Eliminar',
                    renderCell: (params) => (
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleDeleteRow('criticalErrors', params.id)}
                      >
                        Eliminar
                      </Button>
                    ),
                    width: 100,
                  })}
                  hideFooterPagination
                  processRowUpdate={handleRowUpdatecriticalErrors}
                  onProcessRowUpdateError={handleProcessRowUpdateError}
                />
                <Button variant="outlined" onClick={() => addNewRow('criticalErrors')}>
                  Añadir Categoría
                </Button>
              </Box>
            )}

            {
              activeTab === 3 && (
                <Box>
                  <ExcelButtons 
                    promptObject={selectedPrompt} 
                    setSelectedPrompt={handleSelectPromptFromFile}
                    setSelectedTab={setActiveTab} 
                  />
                </Box>
              )
            }
            
            <Stack direction="row" spacing={2} justifyContent="space-between">
            <Button variant="contained" color="primary" onClick={handleActivatePrompt} disabled={!selectedPrompt?.id}>
                  Activar evaluación seleccionada
              </Button>
              <Stack direction="row" spacing={3} justifyContent="flex-end">
                <Button variant="contained" color="primary" onClick={createNewPrompt}>
                  Crear nuevo
                </Button>
                {
                  selectedPrompt?.id ?
                  <>
                    <Button variant="contained" color="primary" onClick={handleSave}>
                    Guardar
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={() => {setFormData({ ...originalData })}}>
                      Cancelar
                    </Button>
                  </> 
                  :
                  <Button variant="contained" color="primary" onClick={handleCreate}>
                    Guardar
                  </Button>
                }
                
              </Stack>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
};

export default PromptEditor;
