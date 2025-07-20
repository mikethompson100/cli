
import ExcelJS from 'exceljs';
import { exec } from 'child_process';
console.log(process.argv[2]);

const workbook = new ExcelJS.Workbook();

async function getSummary(filePath: string) {
  await workbook.xlsx.readFile(filePath);
  const worksheet = workbook.getWorksheet('Sheet1');
  if (!worksheet) {
    throw new Error("Sheet1 not found.")
  }
  const nameCol = worksheet.getColumn('A');
  const filteredNames = nameCol.values.filter((value) => {
    return value;
  });
  const nameStrings = filteredNames.map((value) => {
    if (typeof value !== 'string') {
      throw new Error("Name is not a string.");
    }
    return value;
  });
  const hoursCol = worksheet.getColumn('B');
  const filteredHours = hoursCol.values.filter((value) => {
    return value;
  });

  const hourNumbers = filteredHours.map((value) => {
    if (typeof value !== 'number') {
      throw new Error(`Hour is not a number. It is a ${typeof value}.`);
    }
    return value;
  });
  const summary: Record<string, number> = {};

  nameStrings.forEach((name, index) => {
    const hours = hourNumbers[index];
    summary[name] = hours;
  });
  return summary

}

async function main() {
  const summary1 = await getSummary("./file1.xlsx");
  const summary2 = await getSummary("./file2.xlsx");
  console.log("Summary 1:", summary1);
  console.log("Summary 2:", summary2);
  const diffs: Record<string, {hours1: number, hours2: number, gap: number}> = {};
  for (const name in summary1) {
    const hours1 = summary1[name];
    const hours2 = summary2[name];
    if (hours1 !== hours2) {
      const gap = Math.abs(hours1 - hours2);
      const diff = { hours1, hours2, gap };
      diffs[name] = diff;
    }
  }
console.log("Differences:", diffs);
}
main();