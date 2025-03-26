import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

import { Button } from '@mui/material';

const cleanData = (data) => {
  if (!data || typeof data !== 'string' || data.length <= 2) {
    return '-';
  }
  return data.replaceAll(/\\n/g, '').replaceAll(/\\/g, '').replaceAll(/"/g, '"').replaceAll(/^"|"$/g, '');
};

const parseAnalysisResult = (data) => {
  data = cleanData(data);
  try {
    return JSON.parse(data);
  } catch (error) {
    console.error('Error parsing analysisResult:', error);
    return null;
  }
};

const groupBy = (arr, property) => 
  arr.reduce((acc, obj) => {
    const key = obj[property] || 'Sin Nombre';
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(obj);
    return acc;
  }, {});


const ExcelExportButton = ({ tableInstance }) => {
  const handleExport = async () => {
    if (!tableInstance) return;

    const filteredData = tableInstance.getFilteredRowModel().rows.map((row) => {
      const id = row.original.phone_number || row.original.id;
      const {campaign} = row.original;
      const analysis = parseAnalysisResult(row.original.analysisResult);
      const evaluationPromptName = row.original.evaluationPromptName || 'Sin Nombre';

      return { id, campaign, evaluationPromptName, analysis };
    });

    if (!filteredData.length) return;

    const groupedData = groupBy(filteredData, 'evaluationPromptName');
    const workbook = new ExcelJS.Workbook();

    Object.entries(groupedData).forEach(([promptName, dataSet]) => {
      const worksheet = workbook.addWorksheet(promptName.substring(0, 31));

      worksheet.addRow(['evaluationPromptName', ...dataSet.map((d) => d.id)]);
      worksheet.addRow(['Categorías', ...dataSet.map(() => 'Calificación')]);

      const categoryOrder = [];
      const gradeMatrix = new Array(dataSet.length).fill(null).map(() => []);

      if (dataSet.length > 0) {
        const firstData = dataSet[0];
        if (firstData.analysis?.categories) {
          firstData.analysis.categories.forEach((category) => {
            categoryOrder.push(category.categoryTitle);
            category.questions.forEach((question) => {
              categoryOrder.push(question.questionTitle);
            });
          });
        }
      }

      dataSet.forEach((data, index) => {
        if (!data.analysis?.categories) return;

        data.analysis.categories.forEach((category) => {
          gradeMatrix[index].push(category.obtainedGrade);
          category.questions.forEach((question) => {
            gradeMatrix[index].push(question.obtainedGrade);
          });
        });
      });

      categoryOrder.forEach((title, rowIndex) => {
        worksheet.addRow([title, ...gradeMatrix.map((grades) => grades[rowIndex] || '-')]);
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), 'AnalysisResults.xlsx');
  };

  return <Button onClick={handleExport}>Exportar Análisis a Excel</Button>;
};

export default ExcelExportButton;
