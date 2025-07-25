
import ExcelJS from 'exceljs';
import { exec } from 'child_process';
console.log(process.argv[2]);

const workbook = new ExcelJS.Workbook();

async function getWorkfrontData(filePath: string) {
  await workbook.xlsx.readFile(filePath);
  const worksheet = workbook.getWorksheet('Sheet1');
  if (!worksheet) {
    throw new Error("Sheet1 not found.")
  }
  const data: Record<string, number> = {}; // { Accounting: 3, Developer: 8 }

  worksheet.eachRow((row) => {
    const hours = row.getCell(2).value;
    if (typeof hours !== 'number') {
      return;
    };
    const role = row.getCell(3).value;
    if (typeof role !== 'string') {
      throw new Error("Role is not a string.");
    }
    const oldValue = data[role];
    if (!oldValue) {
      data[role] = hours;
    }
    else {
      data[role] = oldValue + hours;
    }
  });
  return data;
}

async function getSummary(filePath: string) {
  await workbook.xlsx.readFile(filePath);
  const worksheet = workbook.getWorksheet('Sheet1');
  if (!worksheet) {
    throw new Error("Sheet1 not found.")
  }

  const summary: Record<string, number> = {};
  worksheet.eachRow((row) => {
    const hours = row.getCell(2).value;
    if (typeof hours !== 'number') {
      return;
    }
    const name = row.getCell(1).value;
    if (typeof name !== 'string') {
      throw new Error("Name is not a string.");
    }
    summary[name] = hours;
  });
  return summary;
}

async function main() {
  const workfront = await getWorkfrontData("./file1.xlsx");
  console.log("Workfront Data:", workfront);
  const client = await getSummary("./file2.xlsx");
  console.log("Client Data:", client);
  for (const role in client) {
    const clientHours = client[role];
    const workfrontHours = workfront[role];
    const difference = clientHours - (workfrontHours);
    if (difference !== 0) {
      console.log(`Role: ${role}, Client Hours: ${clientHours}, Workfront Hours: ${workfrontHours}, Difference: ${difference}`);
    } else {
      console.log(`Role: ${role} has no difference.`);
    }
  }

}
main();