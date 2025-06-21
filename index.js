
import ExcelJS from 'exceljs';
import { exec } from 'child_process';

const workbook = new ExcelJS.Workbook();

async function main() {
  await workbook.xlsx.readFile("./cli-data.xlsx");
  const worksheet = workbook.getWorksheet('Sheet1');
  const nameCol = worksheet.getColumn('B');
  console.log(nameCol.values[8].hyperlink);  
  exec(`open -a "Google Chrome" "${nameCol.values[8].hyperlink}"`); // macOS
}
main();