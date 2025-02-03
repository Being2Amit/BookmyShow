import { createContext, useState } from 'react';
import Cookies from 'js-cookie';

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [city, setCity] = useState(Cookies.get('city') || 'Location');
  const handleChange = (newCity) => {
    setCity(newCity);
    Cookies.set('city', newCity, { expires: 7 }); 
  };
  const clearCity = () => {
    setCity('Location'); // Set city to default value
    Cookies.remove('city'); // Remove city cookie
  };
  return (
    <AppContext.Provider value={{ city, handleChange, clearCity, location ,otherCities }}>
      {children}
    </AppContext.Provider>
  );
};

export const location = [
  { 
    link: "https://in.bmscdn.com/m6/images/common-modules/regions/mumbai.png", 
    selectedLink: "https://in.bmscdn.com/m6/images/common-modules/regions/mumbai-selected.png", 
    name: "Mumbai" 
  },
  { 
    link: "https://in.bmscdn.com/m6/images/common-modules/regions/ncr.png", 
    selectedLink: "https://in.bmscdn.com/m6/images/common-modules/regions/ncr-selected.png", 
    name: "Delhi-NCR" 
  },
  { 
    link: "https://in.bmscdn.com/m6/images/common-modules/regions/bang.png", 
    selectedLink: "https://in.bmscdn.com/m6/images/common-modules/regions/bang-selected.png", 
    name: "Bangalore" 
  },
  { 
    link: "https://in.bmscdn.com/m6/images/common-modules/regions/hyd.png", 
    selectedLink: "https://in.bmscdn.com/m6/images/common-modules/regions/hyd-selected.png", 
    name: "Hyderabad" 
  },
  { 
    link: "https://in.bmscdn.com/m6/images/common-modules/regions/ahd.png", 
    selectedLink: "https://in.bmscdn.com/m6/images/common-modules/regions/ahd-selected.png", 
    name: "Ahmedabad" 
  },
  { 
    link: "https://in.bmscdn.com/m6/images/common-modules/regions/chd.png", 
    selectedLink: "https://in.bmscdn.com/m6/images/common-modules/regions/chd-selected.png", 
    name: "Chandigarh" 
  },
  { 
    link: "https://in.bmscdn.com/m6/images/common-modules/regions/chen.png", 
    selectedLink: "https://in.bmscdn.com/m6/images/common-modules/regions/chen-selected.png", 
    name: "Chennai" 
  },
  { 
    link: "https://in.bmscdn.com/m6/images/common-modules/regions/pune.png", 
    selectedLink: "https://in.bmscdn.com/m6/images/common-modules/regions/pune-selected.png", 
    name: "Pune" 
  },
  { 
    link: "https://in.bmscdn.com/m6/images/common-modules/regions/kolk.png", 
    selectedLink: "https://in.bmscdn.com/m6/images/common-modules/regions/kolk-selected.png", 
    name: "Kolkata" 
  },
  { 
    link: "https://in.bmscdn.com/m6/images/common-modules/regions/koch.png", 
    selectedLink: "https://in.bmscdn.com/m6/images/common-modules/regions/koch-selected.png", 
    name: "Kochi" 
  },
];

export const otherCities = ["Abids", "Alwal", "Ameerpet", "Aliabad", "Attapur", "Balanagar", "Bahadurpura", "Begumpet", "Banjara Hills", "Balapur", "Borabanda",
  "Chandanagar", "Chintal", "Chilakalguda", "Cyberabad", "Dilsukhnagar", "ECIL", "Erragadda", "Gachibowli", "Hitech", "Hyderabad", "Jeedimetla",
  "Katedan", "Kachiguda", "Karmanghat", "Kavadiguda", "Kairathabad", "Kothapeta", "Kompally", "Kukatpally", "Kushaiguda", "KPHB Colony",
  "LB Nagar", "Lingampally", "Langer House", "Medchal", "Mehdipatnam", "Malkajgiri", "Miyapur", "Moosapet", "Musheerabad", "Madhapur",
  "Narayanaguda", "Nallagandla", "Nacharam", "Narapally", "Nizampet", "Panjagutta", "Pragathi Nagar", "RC Puram", "RTC X Roads",
  "Saroornagar", "Secunderabad", "Shameerpet", "Shamshabad", "Shamirpet", "Sultan Bazar", "Suraram", "SLN Terminus", "Tukkuguda",
  "Uppal", "Vanasthalipuram", "Vijayawada", "Yapral", "Yakutpura"]
;