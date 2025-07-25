var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import ExcelJS from 'exceljs';
console.log(process.argv[2]);
const workbook = new ExcelJS.Workbook();
function getWorkfrontData(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        yield workbook.xlsx.readFile(filePath);
        const worksheet = workbook.getWorksheet('Sheet1');
        if (!worksheet) {
            throw new Error("Sheet1 not found.");
        }
        const data = {}; // { Accounting: 3, Developer: 8 }
        worksheet.eachRow((row) => {
            const hours = row.getCell(2).value;
            if (typeof hours !== 'number') {
                return;
            }
            ;
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
    });
}
function getSummary(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        yield workbook.xlsx.readFile(filePath);
        const worksheet = workbook.getWorksheet('Sheet1');
        if (!worksheet) {
            throw new Error("Sheet1 not found.");
        }
        const summary = {};
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
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const workfront = yield getWorkfrontData("./file1.xlsx");
        console.log("Workfront Data:", workfront);
        const client = yield getSummary("./file2.xlsx");
        console.log("Client Data:", client);
        for (const role in client) {
            const clientHours = client[role];
            const workfrontHours = workfront[role];
            const difference = clientHours - (workfrontHours);
            if (difference !== 0) {
                console.log(`Role: ${role}, Client Hours: ${clientHours}, Workfront Hours: ${workfrontHours}, Difference: ${difference}`);
            }
            else {
                console.log(`Role: ${role} has no difference.`);
            }
        }
    });
}
main();
