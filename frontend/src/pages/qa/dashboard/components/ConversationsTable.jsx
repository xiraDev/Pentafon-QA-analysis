import React, {  useMemo, useState} from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';

import { Card, Button, CardHeader } from '@mui/material';

import useAnalysis from 'src/routes/hooks/useAnalysis';
import useConversations from 'src/routes/hooks/useConversation';

import promptAdapter from 'src/adapters/promptAdapter.adapter';

import { useAuthContext } from 'src/auth/hooks';

import AnalysisDialog from './ConversationsTable/AnalysisDialog';
import ExcelExportButton from './ConversationsTable/ExcelExportButton';
import ConversationsDialog from './ConversationsTable/ConversationsDialog';

const ConversationsTable = () => {
  const {user: {campaigns}} = useAuthContext()
  console.log(campaigns)
  const { data, isLoading, error } = useConversations();
  const { analysisResults, isAnalysisDialogOpen, setIsAnalysisDialogOpen, setAnalysisResults } =
    useAnalysis(data);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [extraData, setExtraData] = useState({})
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const columns = useMemo(
    () => [
      { accessorKey: 'id', header: 'Id de interacción' },
      { accessorKey: 'fileName', header: 'Nombre del Archivo' },
      { accessorKey: 'campaign', header: 'campaign' },
      { accessorKey: 'agentName', header: 'Nombre del agente' },
      { accessorKey: 'customerName', header: 'Nombre del cliente' },
      {
        accessorKey: 'createdAt',
        header: 'Fecha de Creación',
        Cell: ({ cell }) => new Date(cell.getValue()).toLocaleString(),
      },
      {
        header: 'Ver Conversación',
        Cell: ({ row }) => (
          <Button
            variant="outlined"
            onClick={() => {
              setSelectedConversation(row.original);
              setIsDialogOpen(true);
            }}
          >
            Ver
          </Button>
        ),
      },
      {
        header: 'Resultado de Análisis',
        accessorKey: 'analysisResult',
        Cell: ({ row }) =>
          row.original.analysisResult ? (
            <Button
              variant="outlined"
              onClick={() => {
                setExtraData(row.original)
                setAnalysisResults(promptAdapter(row.original.analysisResult));
                setIsAnalysisDialogOpen(true);
              }}
            >
              Ver Análisis
            </Button>
          ) : (
            <span>-</span>
          ),
      },
      { header: 'Calificación', accessorKey: 'obtainedGrade', Cell: ({ row }) => row.original.obtainedGrade || '-' },
      { header: 'Duración', accessorKey: 'duration',
        Cell: ({ cell }) => {
          const totalSeconds = cell.getValue();
          let minutes = Math.floor(totalSeconds / 60); 
          let seconds = Math.round(totalSeconds % 60); 
          
          if (seconds === 60) {
              minutes += 1;
              seconds = 0;
          }
      
          return `${minutes}:${String(seconds).padStart(2, '0')} min`;
      }
      },
    ],
    [setAnalysisResults, setIsAnalysisDialogOpen]
  );

  // Usamos useMaterialReactTable() para obtener la instancia de la tabla
  const tableInstance = useMaterialReactTable({
    columns,
    data,
    state: { isLoading },
    getRowId: (row) => row.id, // Esto ayuda a que MaterialReactTable identifique cada fila
  });

  return (
    <Card>
      <CardHeader title="Lista de Conversaciones" sx={{ mb: 3 }} />
      <ExcelExportButton tableInstance={tableInstance} />
      <MaterialReactTable table={tableInstance} muiToolbarAlertBannerProps={error ? { color: 'error', children: error } : undefined} />
      <ConversationsDialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} conversation={selectedConversation} />
      <AnalysisDialog open={isAnalysisDialogOpen} onClose={() => setIsAnalysisDialogOpen(false)} analysisResults={analysisResults} extraData={extraData}/>
    </Card>
  );
};

export default ConversationsTable;
