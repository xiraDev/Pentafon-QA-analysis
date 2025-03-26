import DOMPurify from 'dompurify';

import { Dialog, Typography, DialogTitle, DialogContent, } from '@mui/material';

const AnalysisDialog = ({ open, onClose, analysisResults, extraData }) => {
  const cleanData = (data) => {
    if (!data || !data.length > 2 || !typeof data === 'string') {
      return '-';
    }
    data = data.replaceAll(/\\n/g, '');
    // data = data.replaceAll(/[\\]{0,}/g,"")
    data = data.replaceAll(/\\/g, '');
    data = data.replaceAll(/\\"/g, '"');
    data = data.replaceAll(/^"|"$/g, '');
    // while(data.includes('\\"')){
    //   data = data.replaceAll(/\\"/g, '"');
    // }

    return data;
  };

  const jsonToHtmlTable = (data) => {
    data = cleanData(data);
    if (data.length > 2) {
      data = JSON.parse(data);
    }
    if (!data?.categories?.length) {
      return '-';
    }
    let html = `<table border="1" style="border-collapse: collapse; width: 100%; text-align: left;">
        <thead>
            <tr>
                <th style="background-color:black; color: white; border-left: white 1px solid">Categoría</th>
                <th style="background-color:black; color: white; border-left: white 1px solid">Calificación</th>
                <th style="background-color:black; color: white; border-left: white 1px solid">Pregunta</th>
                <th style="background-color:black; color: white; border-left: white 1px solid">Calificación Pregunta</th>
            </tr>
        </thead>
        <tbody>`;

    data.categories.forEach((category) => {
      let firstRow = true;
      category.questions.forEach((question) => {
        html += `<tr>
                ${firstRow ? `<td rowspan="${category.questions.length}" style="border:Gainsboro 1px solid; padding-inline:10px">${category.categoryTitle}</td><td rowspan="${category.questions.length}" style="border:Gainsboro 1px solid; text-align:center">${category.obtainedGrade}</td>` : ''}
                <td style="border:Gainsboro 1px solid">${question.questionTitle}</td>
                <td style="border:Gainsboro 1px solid; text-align:center">${question.obtainedGrade}</td>
            </tr>`;
        firstRow = false;
      });
    });

    html += `</tbody>
        <tfoot>
            <tr>
                <td colspan="4"><strong>Observaciones:</strong> ${data.summary.observations}</td>
            </tr>
            <tr>
                <td colspan="4" style="padding-bottom: 20px"><strong>Calificación Total:</strong> ${data.summary.totalGrade}</td>
            </tr>
        </tfoot>
    </table>`;

    return html;
  };

  const sanitizedResults = DOMPurify.sanitize(jsonToHtmlTable(analysisResults));
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Resultados del Análisis</DialogTitle>
      <Typography variant="body1" sx={{ pl: 3 }}>
          <b>Campaña:</b> {extraData.campaign}
      </Typography>
      <Typography variant="body1" sx={{ pl: 3 }}>
          <b>Nombre del Agente:</b> {extraData.agentName}
      </Typography>
      <Typography variant="body1" sx={{ pl: 3, mb: 2 }}>
          <b>Evaluación usada:</b> {extraData.evaluationPromptName}
      </Typography>
      <DialogContent>
        {analysisResults ? (
          <table style={{ borderCollapse: 'collapse' }}>
            {/* eslint-disable-next-line react/no-danger */}
            <tbody dangerouslySetInnerHTML={{ __html: sanitizedResults }} />
          </table>
        ) : (
          <p>No hay resultados disponibles.</p>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AnalysisDialog;
