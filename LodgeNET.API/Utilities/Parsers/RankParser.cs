using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;

namespace LodgeNET.API.Utilities.Parsers
{
    /// <summary>
    /// Represents rank/contains rank utility methods
    /// </summary>
    public class RankParser
    {
        #region Member Variables
        /// <summary>
        /// Contains potential ranks
        /// </summary>
        public enum Ranks
        {
            NORANK = 0,
            GS,
            AB,
            AMN,
            A1C,
            SRA,
            SSGT,
            SSG = SSGT,
            TSGT,
            TSG = TSGT,
            MSGT,
            MSG = MSGT,
            SRMSGT,
            SMSGT = SRMSGT,
            SMS = SRMSGT,
            CMSGT,
            CMS = CMSGT,
            CMG = CMSGT,
            TWOLT,
            ONELT,
            CAPT,
            CPT = CAPT,
            MAJ,
            MAJOR = MAJ,
            LTCOL,
            LTC = LTCOL,
            COL,
            BRIGGEN,
            MAJGEN,
            LTGEN,
            GEN,
        }

        /// <summary>
        /// List of enlisted ranks
        /// </summary>
        private List<string> _enlisted = new List<string>
        {
            "AB",
            "AMN",
            "A1C",
            "SRA",
            "SSGT",
            "SSG",
            "TSGT",
            "TSG",
            "MSGT",
            "MSG",
            "SMSGT",
            "SMS",
            "CMSGT",
            "CMS",
        };

        /// <summary>
        /// Contains commissioned ranks
        /// </summary>
        private List<string> _commissioned = new List<string>
        {
            "TWOLT",
            "ONELT",
            "CAPT",
            "CPT",
            "MAJ",
            "LTCOL",
            "LTC",
            "COL",
            "BRIGGEN",
            "MAJGEN",
            "LTGEN",
            "GEN"
        };
        #endregion

        #region Accessors

        /// <summary>
        /// Enlisted accessors
        /// </summary>
        /// <remarks>
        /// Readonly
        /// </remarks>
        public List<string> Enlisted
        {
            get { return _enlisted; }
        }

        /// <summary>
        /// Commissioned accessors
        /// </summary>
        /// <remarks>
        /// Readonly
        /// </remarks>
        public List<string> Commissioned
        {
            get { return _commissioned; }
        }

        #endregion

        #region Methods

        /// <summary>
        /// Parses rank string into Ranks Enum instance
        /// </summary>
        /// <param name="strRank">Rank String</param>
        /// <returns>Rank value from Ranks enum</returns>
        public Ranks GetRankType(String strRank)
        {
            Ranks rank = Ranks.NORANK;

            if (strRank == null || strRank.Equals(string.Empty))
                return rank;

            string upperStrRank = strRank.ToUpper();

            if (Regex.Match(upperStrRank, @"^2.*").Success)
            {
                rank = Ranks.TWOLT;
            }
            else if (Regex.Match(upperStrRank, @"^1.*").Success)
            {
                rank = Ranks.ONELT;
            }
            else if (Regex.Match(upperStrRank, @"^LT.*").Success && !(Regex.Match(upperStrRank, @".*[Gg]EN.*").Success))
            {
                rank = Ranks.LTCOL;
            }
            else if (Regex.Match(upperStrRank, @"^GS.*").Success || (Regex.Match(upperStrRank, @"^\d+$").Success))
            {
                rank = Ranks.GS;
            }
            else
            {
                Enum.TryParse<Ranks>(upperStrRank, out rank);
            }

            return rank;
        }

        /// <summary>
        /// Compares two ranks strings if are equal
        /// </summary>
        /// <param name="rank">First Rank</param>
        /// <param name="rank2">Second Rank</param>
        /// <returns>boolean result of equals comparision</returns>
        public bool Equals(string rank, string rank2)
        {
            Ranks parsedRank = GetRankType(rank);
            Ranks parsedRank2 = GetRankType(rank2);

            return parsedRank.Equals(parsedRank2);
        }

        /// <summary>
        /// Standardizes rank for easy comparison
        /// </summary>
        /// <param name="rank">Rank string to standardize</param>
        /// <returns>Standardized rank string</returns>
        public string Standardize(string rank)
        {
            return ToString(GetRankType(rank));
        }

        /// <summary>
        /// Compares two ranks
        /// </summary>
        /// <param name="rank">Rank standard</param>
        /// <param name="relativeRank">Rank to compare</param>
        /// <returns>Difference between ranks</returns>
        public int GetRankDiff(Ranks rank, Ranks relativeRank)
        {
            int rankValue = (int)rank;
            int relativeRankValue = (int)relativeRank;

            return relativeRankValue - rankValue;  //returns negative value if relativeRank is below the rank in question
        }

        /// <summary>
        /// Change Enum ranks instance to a string
        /// </summary>
        /// <param name="rank">Rank to convert</param>
        /// <remarks>When enums are set equal to eachother (ex CPT = CAPT), caused Default ToString/GetValue methods to have unexpected results</remarks>
        /// <returns>string of rank</returns>
        public string ToString(Ranks rank)
        {
            string strRank = "";

            switch (rank)
            {
                case Ranks.GS:
                    strRank = "GS";
                    break;
                case Ranks.AB:
                    strRank = "AB";
                    break;
                case Ranks.AMN:
                    strRank = "AMN";
                    break;
                case Ranks.A1C:
                    strRank = "A1C";
                    break;
                case Ranks.SRA:
                    strRank = "SRA";
                    break;
                case Ranks.SSGT:
                    strRank = "SSGT";
                    break;
                case Ranks.TSGT:
                    strRank = "TSGT";
                    break;
                case Ranks.MSGT:
                    strRank = "MSGT";
                    break;
                case Ranks.SRMSGT:
                    strRank = "SMSGT";
                    break;
                case Ranks.CMSGT:
                    strRank = "CMSGT";
                    break;
                case Ranks.TWOLT:
                    strRank = "2LT";
                    break;
                case Ranks.ONELT:
                    strRank = "1LT";
                    break;
                case Ranks.CAPT:
                    strRank = "CAPT";
                    break;
                case Ranks.MAJ:
                    strRank = "MAJ";
                    break;
                case Ranks.LTCOL:
                    strRank = "LTC";
                    break;
                case Ranks.COL:
                    strRank = "COL";
                    break;
                case Ranks.BRIGGEN:
                    strRank = "BG";
                    break;
                case Ranks.MAJGEN:
                    strRank = "MG";
                    break;
                case Ranks.LTGEN:
                    strRank = " LTG";
                    break;
                case Ranks.GEN:
                    strRank = "GEN";
                    break;
            }

            return strRank;
        }
        #endregion
    }
}