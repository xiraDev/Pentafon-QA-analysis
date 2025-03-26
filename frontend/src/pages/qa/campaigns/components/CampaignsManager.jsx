import React, { useState, useEffect  } from "react";
import {MaterialReactTable} from "material-react-table";

import { Edit, Delete } from "@mui/icons-material";
import { 
    Box, 
    Card, 
    Button, 
    Container, 
    TextField,  
    IconButton, 
    Typography,  
    CardContent 
} from "@mui/material";

import axios from "src/utils/axios";

const CampaignTable = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [newCampaign, setNewCampaign] = useState({ campaignName: "", slug: "" });
    const [isAdding, setIsAdding] = useState(false);
  
    // Función para obtener las campañas desde la API
    const fetchCampaigns = async () => {
      try {
        const response = await axios.get("/api/v1/campaigns");
        setCampaigns(response.data.meta);
      } catch (error) {
        console.error("Error fetching campaigns", error);
      }
    };
  
    useEffect(() => {
      fetchCampaigns();
    }, []);
  
    // Crear una campaña nueva
    const handleCreate = async () => {
      try {
        await axios.post("/api/v1/campaigns/create", newCampaign);
        fetchCampaigns();
        setNewCampaign({ campaignName: "", slug: "" });
        setIsAdding(false);
      } catch (error) {
        console.error("Error creating campaign", error);
      }
    };
  
    // Editar una campaña existente
    const handleEdit = async (uuid, updatedCampaign) => {
      try {
        await axios.patch(`/api/v1/campaigns/${uuid}`, updatedCampaign);
        fetchCampaigns();
      } catch (error) {
        console.error("Error updating campaign", error);
      }
    };
  
    // Eliminar una campaña
    const handleDelete = async (uuid) => {
      try {
        await axios.delete(`/api/v1/campaigns/${uuid}`);
        fetchCampaigns();
      } catch (error) {
        console.error("Error deleting campaign", error);
      }
    };
  
    // Definición de columnas usando la sintaxis de MaterialReactTable
    const columns = [
      {
        accessorKey: "campaignName",
        header: "Nombre de campaña",
      },
      {
        accessorKey: "slug",
        header: "Nombre corto",
      },
    ];
 
    const handleEditingRowSave = async ( {exitEditingMode, row, values} ) => {
        handleEdit(row.original.id,values)
        exitEditingMode()
    }    
  
    return (
      <Container maxWidth="md">
        <Card>
          <CardContent>
            <Typography variant="h4">
                Administrar campañas
            </Typography>
            <br/>
            {isAdding && (
              <Box display="flex" gap={2} mt={2}>
                <TextField
                label="Nombre de la campaña"
                value={newCampaign.campaignName}
                onChange={(e) =>
                    setNewCampaign({ ...newCampaign, campaignName: e.target.value })
                }
                />
                <TextField
                label="Nombre corto"
                value={newCampaign.slug}
                onChange={(e) =>
                    setNewCampaign({ ...newCampaign, slug: e.target.value })
                }
                />
                <Button variant="contained" onClick={handleCreate}>
                Save
                </Button>
              </Box>
            )}
            <MaterialReactTable
              columns={columns}
              data={campaigns}
              enableEditing
              editDisplayMode="row"
              onEditingRowSave={handleEditingRowSave}
              positionActionsColumn="last"
              renderRowActions={({ row, table }) => (
                <Box>
                    <IconButton onClick={() => table.setEditingRow(row)}><Edit/></IconButton>
                    <IconButton onClick={() => handleDelete(row.original.id)}>
                <Delete />
                </IconButton>
                </Box>
              )}
            />
            <Box mt={2}>
              <Button variant="contained" onClick={() => setIsAdding(true)}>
                Añadir campaña
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    );
  };
  
  export default CampaignTable;
    
