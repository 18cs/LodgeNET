using System;

namespace LodgeNET.API.Utilities.Parsers
{
    public class ServiceParser
    {
        public enum Services
        {
            NOSERVICE = 0,
            AIRFORCE,
            AF = AIRFORCE,
            ARMY,
            NAVY,
            USMC,
            MARINECORPS = USMC
        }

        public Services GetServiceType(String strService)
        {
            var service = Services.NOSERVICE;
            var upperStrService = strService.ToUpper();
            Enum.TryParse<Services>(upperStrService, out service);
            return service;
        }

        public string ToString(Services service)
        {
            string strService = "";
            switch (service)
            {
                case Services.AIRFORCE:
                    strService = "Air Force";
                    break;
                case Services.ARMY:
                    strService = "Army";
                    break;
                case Services.NAVY:
                    strService = "Navy";
                    break;
                case Services.USMC:
                    strService = "USMC";
                    break;
            }
            return strService;
        }

        public string StandardizeString(string service)
        {
            return ToString(GetServiceType(service));
        }
    }
}