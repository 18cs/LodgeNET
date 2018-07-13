
// using System.Data;
// using System.Data.OleDb;

// namespace LodgeNET.API.IO
// {
//     public class FileReader
//     {
//                 private static OleDbConnection ReturnConnection(string fileName)
//         {
           
//             return new OleDbConnection("Provider=Microsoft.ACE.OLEDB.12.0;Data Source=" + fileName + "; Jet OLEDB:Engine Type=5;Extended Properties = \"Excel 12.0 Xml;HDR=YES\"; ");
//             //return new OleDbConnection("Provider=Microsoft.Jet.OLEDB.4.0;Data Source=" + fileName + "; Jet OLEDB:Engine Type=5;Extended Properties=\"Excel 8.0;\"");

//         }

//         public static DataSet ReadExcelFile(string fileName)
//         {
//             DataSet ds = new DataSet();

//             using (OleDbConnection conn = ReturnConnection(fileName))
//             {
//                 conn.Open();
//                 OleDbCommand cmd = new OleDbCommand();
//                 cmd.Connection = conn;

//                 foreach (DataRow dr in conn.GetOleDbSchemaTable(OleDbSchemaGuid.Tables, null).Rows)
//                 {
//                     //DataRow dr = conn.GetOleDbSchemaTable(OleDbSchemaGuid.Tables, null).Rows[0];

//                     string sheetName = dr["TABLE_NAME"].ToString();
//                     bool yup = Regex.Match(sheetName, ".*[Cc]losed.*[Ee]val.*").Success;
//                     bool yup2 = Regex.Match(sheetName, @".*[Oo]pen.?[Ee]val.*").Success;
//                     if (!Regex.Match(sheetName, @".*[Oo]pen.*[Ee]val.*").Success && !Regex.Match(sheetName, ".*[Cc]losed.*[Ee]val.*").Success)
//                         continue;

//                     DataTable myColumns = conn.GetOleDbSchemaTable(OleDbSchemaGuid.Columns, new object[] { null, null, sheetName, null });

//                     if (myColumns.Rows[0]["COLUMN_NAME"].Equals("Application ID"))
//                     {
//                         cmd.CommandText = "SELECT * FROM [" + sheetName + "] WHERE [Application ID] IS NOT NULL";
//                     }
//                     else
//                     {
//                         cmd.CommandText = "SELECT * FROM [" + sheetName + "A4:Q] WHERE [Application ID] IS NOT NULL";
//                     }

//                     DataTable dt = new DataTable();
//                     dt.TableName = sheetName;

//                     OleDbDataAdapter da = new OleDbDataAdapter(cmd);
//                     da.Fill(dt);

//                     ds.Tables.Add(dt);

//                 }
//                 cmd = null;
//                 conn.Close();
//             }
//             return ds;
//         }
//     }
// }