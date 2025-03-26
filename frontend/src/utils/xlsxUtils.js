import ExcelJS from 'exceljs';

function parsePromptObject(promptObj) {
    try {
        const { specialCasesPrompt, evaluationFormatPrompt, isBinary } = promptObj;
        const promptInformation = [];

        const specialCasesObj = {};
        const specialCasesData = specialCasesPrompt.split('-');
        specialCasesData.forEach((specialCase) => {
            const splittedSpecialCase = specialCase.trim().split(":").map(sc => sc.trim());
            specialCasesObj[splittedSpecialCase[0]] = splittedSpecialCase[1];
        });

        const evaluationFormatData = evaluationFormatPrompt.split('\n');

        evaluationFormatData.forEach(evaluationLine => {
            if (evaluationLine.trim().startsWith(">")) {
                // Extraer los puntos
                const pointsMatch = evaluationLine.match(/(\d+)/g);
                const points = pointsMatch ? pointsMatch[0] : "0";

                // Extraer la categoría, ignorando paréntesis si es isBinary
                let category = evaluationLine.trim().slice(2).trim();
                if (isBinary) {
                    category = category.replace(/\(\d+\)/g, "").trim();
                } else {
                    category = category.slice(0, category.lastIndexOf("(")).trim();
                }

                promptInformation.push({
                    category,
                    score: points
                });
            } else {
                evaluationLine.split(",").forEach(el => {
                    el = el.trim();

                    // Extraer la subcategoría, ignorando paréntesis si es isBinary
                    let subcategory = el.slice(1).trim();
                    if (isBinary) {
                        subcategory = subcategory.replace(/\(\d+\)/g, "").trim();
                    } else {
                        subcategory = subcategory.slice(0, subcategory.lastIndexOf("(")).trim();
                    }

                    // Extraer los puntos
                    const pointsMatch = el.match(/(\d+)/g);
                    const points = pointsMatch ? pointsMatch[0] : "-";

                    promptInformation.push({
                        subcategory,
                        score: points,
                        description: specialCasesObj[subcategory]
                    });
                });
            }
        });

        return promptInformation;
    } catch (error) {
        console.log("Error al momento de procesar el objeto prompt");
        console.error(error);
        return [];
    }
}


function parsePromptCriticalErrors(criticalErrors) {
    console.log()
    if (typeof criticalErrors !== "string" || !criticalErrors.length) {
        console.log("There are not critical Errors")
        return []
    }

    return criticalErrors.split("-").slice(1)
}

export async function convertObjectToXlsx(promptObj) {
    console.log(promptObj)
    const promptInformation = parsePromptObject(promptObj)
    const parsedErrors = parsePromptCriticalErrors(promptObj?.criticalErrors)

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Evaluación");
    const errorsSheet = workbook.addWorksheet("Errores Críticos")

    sheet.addRow(["Categoría", "Subcategoría", "Puntaje", "Descripción"]);
    errorsSheet.addRow(["Listado de errores críticos"])
    // Escribir los datos en la hoja
    const startRow = 2; // Supone que la primera fila tiene encabezados
    promptInformation.forEach((data, index) => {
        sheet.getCell(startRow + index, 1).value = data.category || "";
        sheet.getCell(startRow + index, 2).value = data.subcategory || "";
        sheet.getCell(startRow + index, 3).value = data.score || "";
        sheet.getCell(startRow + index, 4).value = data.description || "";
    });

    parsedErrors.forEach((data, index) => {
        errorsSheet.getCell(startRow + index, 1).value = data
    })

    // Guardar el archivo
    return workbook.xlsx.writeBuffer();
}

export async function convertXlsxToObject(workbook) {
    try {
        const sheet = workbook.worksheets[0];

        const promptInformation = [];
        const specialCasesObj = {};
        let lastCategory = "";

        sheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) return;

            const category = row.getCell(1).value;
            const subcategory = row.getCell(2).value;
            const score = row.getCell(3).value;
            const description = row.getCell(4).value;

            if (category) {
                lastCategory = category;
                promptInformation.push({ category, score });
            }

            if (subcategory) {
                promptInformation.push({ subcategory, score, description });
                specialCasesObj[subcategory] = typeof description === "string" ?
                    description
                        .replaceAll("-", "*")
                        .replaceAll(">", "*")
                    : ""

            }
        });

        // Construir el objeto de salida
        const promptObj = {
            specialCasesPrompt: Object.entries(specialCasesObj)
                .map(([key, value]) => value ? `${key}: ${value}` : null)
                .filter(e => e)
                .join("- "),
            evaluationFormatPrompt: promptInformation.map(item => {
                if (item.category) {
                    return `> ${item.category} (${item.score})`;
                }
                return `-${item.subcategory} (${item.score})`;
            }).join("\n"),
            isActive: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        return promptObj;
    } catch (error) {
        console.error("Error al procesar el archivo Excel", error);
        return {}
    }
}