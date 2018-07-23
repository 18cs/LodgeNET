using NPOI.HSSF.UserModel;
using NPOI.SS.UserModel;
using NPOI.XSSF.UserModel;
using iTextSharp.text.pdf;
using iTextSharp.text.pdf.parser;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using System.IO;
using System.Collections;

namespace LodgeNET.API.Utilities.IO.FileIO
{
    public class FileReader
    {
        public ISheet GetExcelSheet(string fullPath)
        {
            ISheet sheet;
            string filename = System.IO.Path.GetFileName(fullPath);
            string sFileExtension = System.IO.Path.GetExtension(filename).ToLower();
            using (var stream = new FileStream(fullPath, FileMode.Open))
            {
                // file.CopyTo (stream);
                stream.Position = 0;
                if (sFileExtension == ".xls")
                {
                    HSSFWorkbook hssfwb = new HSSFWorkbook(stream); //This will read the Excel 97-2000 formats  
                    sheet = hssfwb.GetSheetAt(0); //get first sheet from workbook  
                }
                else
                {
                    XSSFWorkbook hssfwb = new XSSFWorkbook(stream); //This will read 2007 Excel format  
                    sheet = hssfwb.GetSheetAt(0); //get first sheet from workbook   
                }
            }

            return sheet;
        }

        public ArrayList GetExcelSheetHeaders(ISheet sheet)
        {
            ArrayList headers = new ArrayList();
            IRow headerRow = sheet.GetRow(0); //Get Header Row
            int cellCount = headerRow.LastCellNum;
            for (int j = 0; j < cellCount; j++)
            {
                NPOI.SS.UserModel.ICell cell = headerRow.GetCell(j);
                if (cell == null || string.IsNullOrWhiteSpace(cell.ToString())) continue;
                headers.Add(cell.ToString().Trim().ToUpper());
            }
            return headers;
        }

        public List<string> GetPdfText(IFormFile file)
        {
            List<string> textRows = new List<string>();
            using (PdfReader reader = new PdfReader(file.OpenReadStream()))
            {

                for (int i = 1; i <= reader.NumberOfPages; i++)
                {
                    textRows.AddRange(PdfTextExtractor.GetTextFromPage(reader, i).Split("\n"));
                }
            }
            return textRows;
        }
    }
}