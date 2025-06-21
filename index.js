
import ExcelJS from 'exceljs';

const workbook = new ExcelJS.Workbook();

async function main() {
  await workbook.xlsx.readFile("./cli-data.xlsx");
  const worksheet = workbook.getWorksheet('Sheet1');
  const nameCol = worksheet.getColumn('B');
  console.log(nameCol.values[7]);
}
main();