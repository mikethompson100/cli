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
function getSummary(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        yield workbook.xlsx.readFile(filePath);
        const worksheet = workbook.getWorksheet('Sheet1');
        if (!worksheet) {
            throw new Error("Sheet1 not found.");
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
        const summary = {};
        nameStrings.forEach((name, index) => {
            const hours = hourNumbers[index];
            summary[name] = hours;
        });
        return summary;
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const summary1 = yield getSummary("./file1.xlsx");
        const summary2 = yield getSummary("./file2.xlsx");
        console.log("Summary 1:", summary1);
        console.log("Summary 2:", summary2);
        const diffs = {};
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
    });
}
main();
