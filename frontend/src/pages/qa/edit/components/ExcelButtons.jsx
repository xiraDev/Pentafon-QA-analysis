import React from "react";
import ExcelJS from 'exceljs';
import { saveAs } from "file-saver";

import { Box, Grid, Card, Typography, CardContent, CardActionArea } from "@mui/material";

import { Iconify } from "src/components/iconify";

import { convertObjectToXlsx, convertXlsxToObject } from "../../../../utils/xlsxUtils";

const ExcelButtons = ({ promptObject, setSelectedPrompt, setSelectedTab }) => {

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        
        reader.onload = async (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(data);            
            const result = await convertXlsxToObject(workbook);
            setSelectedPrompt(result)
            setSelectedTab(0)
        };
        
        reader.readAsArrayBuffer(file);
    };

    const handleDownloadFile = () => {
        const fileUrl = "/template/Evaluations_template.xlsx";
        const link = document.createElement("a");
        link.href = fileUrl;
        link.download = "Evaluations_template.xlsx";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleConvertAndDownload = async () => {
        if (!promptObject) return;
        const buffer = await convertObjectToXlsx(promptObject);
        const data = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        saveAs(data, "converted_object.xlsx");
    };

    return (
        <Grid container spacing={2} justifyContent="center">
            <Grid item xs={6} sm={6} md={6}>
                <Card sx={{ height: "100%", boxShadow: "1px 1px 4px slategrey" }}>
                    <CardActionArea component="label">
                        <input
                            type="file"
                            accept=".xlsx"
                            style={{ display: "none" }}
                            onChange={handleFileUpload}
                        />
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Box mb={2}>
                                <Iconify icon="mdi:cloud-upload-outline" width={48} height={48} />
                            </Box>
                            <Typography variant="h6">Subir evaluación desde Excel</Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>

            <Grid item xs={6} sm={6} md={6}>
                <Card sx={{ height: "100%", boxShadow: "1px 1px 4px slategrey" }} onClick={handleConvertAndDownload}>
                    <CardActionArea>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Box mb={2}>
                                <Iconify icon="mdi:cloud-download-outline" width={48} height={48} />
                            </Box>
                            <Typography variant="h6">Convertir evaluación actual a Excel</Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>

            <Grid item xs={6} sm={6} md={6}>
                <Card sx={{ height: "100%", boxShadow: "1px 1px 4px slategrey" }} onClick={handleDownloadFile}>
                    <CardActionArea>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Box mb={2}>
                                <Iconify icon="mdi:microsoft-excel" width={48} height={48} />
                            </Box>
                            <Typography variant="h6">Descargar ejemplo de evaluación</Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>

            <Grid item xs={6} sm={6} md={6}>
                <Card sx={{ height: "100%"}}>
                    <CardContent>
                        <span> </span>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default ExcelButtons;
