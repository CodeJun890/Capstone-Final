import CvsuLogo from "../../Assets/cvsu-icon.webp";
import Upload from "../../Assets/upload.jpg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import "../../styles.css";
import { useState, useRef, useEffect } from "react";
import InputGroup from "react-bootstrap/InputGroup";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { StrengthIndicator } from "./StrengthIndicator";
import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import axios from "axios";
import ScaleLoader from "react-spinners/ScaleLoader";
import zxcvbc from "zxcvbn";

function StudentSignupPage() {
  const [programs, setPrograms] = useState([]);
  const baseUrl = "http://api.discipline-recommender-system.xyz/";

  useEffect(() => {
    axios
      .get(baseUrl + "program-list")
      .then((res) => {
        setPrograms(res.data.program);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  // React Spinners for Signup

  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  const [isEmailTaken, setIsEmailTaken] = useState(false);

  // useState for each form in the Multi Form Signup Page

  const [showForm1, setShowForm1] = useState(false);
  const [showForm2, setShowForm2] = useState(false);
  const [showForm3, setShowForm3] = useState(false);

  const [showProgressBar2, setShowProgressBar2] = useState(false);
  const [showProgressBar3, setShowProgressBar3] = useState(false);

  const formRef1 = useRef(null);
  const formRef2 = useRef(null);
  const formRef3 = useRef(null);
  const inputRef = useRef(null);

  const [isNotMatch, setIsNotMatch] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  // UPLOAD PROFILE IMAGE

  const handleImgClick = () => {
    inputRef.current.click();
  };

  const handleImgChange = (event) => {
    const file = event.target.files[0];
    displayImage(file);
  };

  const displayImage = (file) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;

      img.onload = () => {
        // Resize the image to desired dimensions
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const maxWidth = 300; // Set your desired width
        const maxHeight = 300; // Set your desired height

        // Calculate the new dimensions
        let newWidth = img.width;
        let newHeight = img.height;

        if (img.width > maxWidth) {
          newWidth = maxWidth;
          newHeight = (img.height * maxWidth) / img.width;
        }

        if (newHeight > maxHeight) {
          newHeight = maxHeight;
          newWidth = (img.width * maxHeight) / img.height;
        }

        // Set canvas dimensions to the resized image
        canvas.width = newWidth;
        canvas.height = newHeight;

        // Draw the resized image on the canvas
        ctx.drawImage(img, 0, 0, newWidth, newHeight);

        // Get the data URL of the resized image
        const resizedImage = canvas.toDataURL("image/jpeg");

        // Set the resized image in state
        setProfileImage(resizedImage);
      };
    };

    reader.readAsDataURL(file);
  };

  // ALL INPUT FOR SIGNUP FORM

  // STEP 1
  const [studentNumber, setStudentNumber] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // STEP 2
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState(null);
  const [course, setCourse] = useState("");
  const [gender, setGender] = useState("");
  const [suffix, setSuffix] = useState("");
  const [sectionYear, setSectionYear] = useState("");
  // STEP 3
  const [phoneNumber, setPhoneNumber] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [barangay, setBarangay] = useState("");
  const [region, setRegion] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);

  // Check if password is strong
  const [isPasswordStrong, setIsPasswordStrong] = useState(true);
  const testResult = zxcvbc(password);

  const passLabel = () => {
    switch (testResult.score) {
      case 0:
        return "Very Weak";
      case 1:
        return "Weak";
      case 2:
        return "Fair";
      case 3:
        return "Strong";
      case 4:
        return "Very Strong";
      default:
        return "";
    }
  };

  const regionsWithProvinces = [
    {
      region: "AUTONOMOUS REGION IN MUSLIM MINDANAO (ARMM)",
      provinces: [
        {
          provinceName: "Basilan",
          cities: [
            "Akbar",
            "Al-Barka",
            "Hadji Mohammad Ajul",
            "Hadji Muhtamad",
            "Isabela",
            "Lamitan",
            "Lantawan",
            "Maluso",
            "Sumisip",
            "Tabuan-Lasa",
            "Tipo-Tipo",
            "Tuburan",
            "Ungkaya Pukan",
          ],
        },
        {
          provinceName: "Lanao del Sur",
          cities: [
            "Amai Manabilang",
            "Bacolod-Kalawi",
            "Balabagan",
            "Balindong",
            "Bayang",
            "Binidayan",
            "Buadiposo-Buntong",
            "Bubong",
            "Butig",
            "Calanogas",
            "Ditsaan-Ramain",
            "Ganassi, Lanao del Sur",
            "Kapai",
            "Kapatagan, Lanao del Sur",
            "Lumba-Bayabao",
            "Lumbaca-Unayan",
            "Lumbatan",
            "Lumbayanague",
            "Madalum",
            "Madamba",
            "Maguing",
            "Malabang",
            "Marantao",
            "Marogong",
            "Masiu",
            "Mulondo, Lanao del Sur",
            "Pagayawan",
            "Piagapo",
            "Picong, Lanao del Sur",
            "Poona Bayabao",
            "Pualas",
            "Saguiaran",
            "Sultan Dumalondong",
            "Tagoloan, Lanao del Sur",
            "Tamparan",
            "Taraka, Lanao del Sur",
            "Tubaran",
            "Tugaya",
            "Wao, Lanao del Sur",
          ],
        },
        {
          provinceName: "Maguindanao",
          cities: [
            "Ampatuan",
            "Barira",
            "Buldon",
            "Buluan",
            "Cotabato City",
            "Datu Abdullah Sangki",
            "Datu Anggal Midtimbang",
            "Datu Blah T. Sinsuat",
            "Datu Hoffer Ampatuan",
            "Datu Montawal",
            "Datu Odin Sinsuat",
            "Datu Paglas",
            "Datu Piang",
            "Datu Salibo",
            "Datu Saudi-Ampatuan",
            "Datu Unsay",
            "General Salipada K. Pendatun",
            "Guindulungan",
            "Kabuntalan",
            "Mamasapano",
            "Mangudadatu",
            "Matanog",
            "Northern Kabuntalan",
            "Pagalungan",
            "Paglat",
            "Pandag",
            "Parang",
            "Rajah Buayan",
            "Shariff Aguak",
            "Shariff Saydona Mustapha",
            "South Upi",
            "Sultan Kudarat",
            "Sultan Mastura",
            "Sultan sa Barongis",
            "Sultan Sumagka",
            "Talayan",
            "Upi",
          ],
        },
        {
          provinceName: "Sulu",
          cities: [
            "Banguingui",
            "Hadji Panglima Tahil",
            "Indanan",
            "Jolo",
            "Kalingalan Caluang",
            "Lugus",
            "Luuk",
            "Maimbung",
            "Omar",
            "Panamao",
            "Pandami",
            "Panglima Estino",
            "Pangutaran",
            "Parang",
            "Pata",
            "Patikul",
            "Siasi",
            "Talipao",
            "Tapul",
          ],
        },
        {
          provinceName: "Tawi-Tawi",
          cities: [
            "Bongao",
            "Languyan",
            "Mapun",
            "Panglima Sugala",
            "Sapa-Sapa",
            "Sibutu",
            "Simunul",
            "Sitangkai",
            "South Ubian",
            "Tandubas",
            "Turtle Islands",
          ],
        },
      ],
    },
    {
      region: "CORDILLERA ADMINISTRATIVE REGION (CAR)",
      provinces: [
        {
          provinceName: "Abra",
          cities: [
            "Bangued",
            "Boliney",
            "Bucay",
            "Bucloc",
            "Daguioman",
            "Danglas",
            "Dolores",
            "La Paz",
            "Lacub",
            "Lagangilang",
            "Lagayan",
            "Langiden",
            "Licuan-Baay (Licuan)",
            "Luba",
            "Malibcong",
            "Manabo",
            "Peñarrubia",
            "Pidigan",
            "Pilar",
            "Sallapadan",
            "San Isidro",
            "San Juan",
            "San Quintin",
            "Tayum",
            "Tineg",
            "Tubo",
            "Villaviciosa",
          ],
        },
        {
          provinceName: "Apayao",
          cities: [
            "Calanasan",
            "Conner",
            "Flora",
            "Kabugao",
            "Luna",
            "Pudtol",
            "Santa Marcela",
          ],
        },
        {
          provinceName: "Benguet",
          cities: [
            "Atok",
            "Bakun",
            "Bokod",
            "Buguias",
            "Itogon",
            "Kabayan",
            "Kapangan",
            "Kibungan",
            "La Trinidad",
            "Mankayan",
            "Sablan",
            "Tuba",
            "Tublay",
          ],
        },
        {
          provinceName: "Ifugao",
          cities: [
            "Balbalan",
            "Lubuagan",
            "Pasil",
            "Pinukpuk",
            "Rizal",
            "Tabuk",
            "Tanudan",
            "Tinglayan",
          ],
        },
        {
          provinceName: "Kalinga",
          cities: [
            "Balbalan",
            "Lubuagan",
            "Pasil",
            "Pinukpuk",
            "Rizal",
            "Tabuk",
            "Tanudan",
            "Tinglayan",
          ],
        },
        {
          provinceName: "Mountain Province",
          cities: [
            "Sadanga",
            "Natonin",
            "Paracelis",
            "Barlig",
            "Bontoc",
            "Besao",
            "Sagada",
            "Bauko",
            "Tadian",
            "Sabangan",
          ],
        },
      ],
    },
    {
      region: "NATIONAL CAPITAL REGION (NCR)",
      provinces: [
        {
          provinceName: "NCR, CITY OF MANILA, FIRST DISTRICT",
          cities: [
            "Tondo I / II",
            "Binondo",
            "Quiapo",
            "San Nicolas",
            "Santa Cruz",
            "Sampaloc",
            "San Miguel",
            "Ermita",
            "Intramuros",
            "Malate",
            "Pandacan",
            "Port Area",
            "Santa Ana",
          ],
        },
        {
          provinceName: "CITY OF MANILA",
          cities: [
            "Tondo I / II",
            "Binondo",
            "Quiapo",
            "San Nicolas",
            "Santa Cruz",
            "Sampaloc",
            "San Miguel",
            "Ermita",
            "Intramuros",
            "Malate",
            "Pandacan",
            "Port Area",
            "Santa Ana",
          ],
        },
        {
          provinceName: "NCR, SECOND DISTRICT",
          cities: [
            "City of Mandaluyong",
            "City of Marikina",
            "City of Pasig",
            "Quezon City",
            "City of San Juan",
          ],
        },
        {
          provinceName: "NCR, THIRD DISTRICT",
          cities: [
            "Caloocan City",
            "City of Malabon",
            "City of Navotas",
            "City of Valenzuela",
          ],
        },
        {
          provinceName: "NCR, FOURTH DISTRICT",
          cities: [
            "City of Las Piñas",
            "City of Makati",
            "City of Muntinlupa",
            "City of Parañaque",
            "Pasay City",
            "Pateros",
            "Taguig City",
          ],
        },
      ],
    },
    {
      region: "REGION I (ILOCOS REGION)",
      provinces: [
        {
          provinceName: "Ilocos Norte",
          cities: [
            "Adams, Ilocos Norte",
            "Bacarra",
            "Badoc",
            "Bangui, Ilocos Norte",
            "Banna, Ilocos Norte",
            "Burgos, Ilocos Norte",
            "Carasi",
            "Currimao",
            "Dingras",
            "Dumalneg",
            "Marcos, Ilocos Norte",
            "Nueva Era, Ilocos Norte",
            "Pagudpud",
            "Paoay",
            "Pasuquin",
            "Piddig",
            "Pinili",
            "San Nicolas, Ilocos Norte",
            "Sarrat",
            "Solsona, Ilocos Norte",
            "Vintar",
          ],
        },
        {
          provinceName: "Ilocos Sur",
          cities: [
            "Alilem",
            "Banayoyo",
            "Bantay",
            "Burgos",
            "Cabugao",
            "Candon",
            "Caoayan",
            "Cervantes",
            "Galimuyod",
            "Gregorio del Pilar",
            "Lidlidda",
            "Magsingal",
            "Nagbukel",
            "Narvacan",
            "Quirino",
            "Salcedo",
            "San Emilio",
            "San Esteban",
            "San Ildefonso",
            "San Juan",
            "San Vicente",
            "Santa",
            "Santa Catalina",
            "Santa Cruz",
            "Santa Lucia",
            "Santa Maria",
            "Santiago",
            "Santo Domingo",
            "Sigay",
            "Sinait",
            "Sugpon",
            "Suyo",
            "Tagudin",
            "Vigan",
          ],
        },
        {
          provinceName: "La Union",
          cities: [
            "Agoo",
            "Aringay",
            "Bacnotan",
            "Bagulin",
            "Balaoan",
            "Bangar",
            "Bauang",
            "Burgos",
            "Caba",
            "Luna",
            "Naguilian",
            "Pugo",
            "Rosario",
            "San Fernando",
            "San Gabriel",
            "San Juan",
            "Santo Tomas",
            "Santol",
            "Sudipen",
            "Tubao",
          ],
        },
        {
          provinceName: "Pangasinan",
          cities: [
            "Agno, Pangasinan",
            "Aguilar, Pangasinan",
            "Alcala, Pangasinan",
            "Anda, Pangasinan",
            "Asingan",
            "Balungao",
            "Bani, Pangasinan",
            "Basista",
            "Bautista, Pangasinan",
            "Bayambang",
            "Binalonan",
            "Binmaley",
            "Bolinao",
            "Bugallon",
            "Burgos, Pangasinan",
            "Calasiao",
            "Dasol",
            "Infanta, Pangasinan",
            "Labrador, Pangasinan",
            "Laoac",
            "Lingayen",
            "Mabini, Pangasinan",
            "Malasiqui",
            "Manaoag",
            "Mangaldan",
            "Mangatarem",
            "Mapandan",
            "Natividad, Pangasinan",
            "Pozorrubio",
            "Rosales, Pangasinan",
            "San Fabian, Pangasinan",
            "San Jacinto, Pangasinan",
            "San Manuel, Pangasinan",
            "San Nicolas, Pangasinan",
            "San Quintin, Pangasinan",
            "Santa Barbara, Pangasinan",
            "Santa Maria, Pangasinan",
            "Santo Tomas, Pangasinan",
            "Sison, Pangasinan",
            "Sual",
            "Tayug",
            "Umingan",
            "Urbiztondo",
            "Villasis",
          ],
        },
      ],
    },
    {
      region: "REGION II (CAGAYAN VALLEY)",
      provinces: [
        {
          provinceName: "Batanes",
          cities: ["Basco", "Itbayat", "Ivana", "Mahatao", "Sabtang", "Uyugan"],
        },
        {
          provinceName: "Cagayan",
          cities: [
            "Abulug",
            "Alcala, Cagayan",
            "Allacapan",
            "Amulung",
            "Aparri",
            "Baggao",
            "Ballesteros, Cagayan",
            "Buguey",
            "Calayan, Cagayan",
            "Camalaniugan",
            "Claveria, Cagayan",
            "Enrile, Cagayan",
            "Gattaran",
            "Gonzaga, Cagayan",
            "Iguig",
            "Lal-lo",
            "Lasam",
            "Pamplona, Cagayan",
            "Peñablanca",
            "Piat, Cagayan",
            "Rizal, Cagayan",
            "Sanchez-Mira",
            "Santa Ana, Cagayan",
            "Santa Praxedes, Cagayan",
            "Santa Teresita, Cagayan",
            "Santo Niño, Cagayan",
            "Solana, Cagayan",
            "Tuguegarao City",
            "Tuao",
          ],
        },
        {
          provinceName: "Isabela",
          cities: [
            "Alicia, Isabela",
            "Angadanan",
            "Aurora, Isabela",
            "Benito Soliven",
            "Burgos, Isabela",
            "Cabagan",
            "Cabatuan, Isabela",
            "Cordon, Isabela",
            "Delfin Albano",
            "Dinapigue",
            "Divilacan",
            "Echague",
            "Gamu",
            "Jones, Isabela",
            "Luna, Isabela",
            "Maconacon",
            "Mallig",
            "Naguilian, Isabela",
            "Palanan",
            "Quezon, Isabela",
            "Quirino, Isabela",
            "Ramon, Isabela",
            "Reina Mercedes, Isabela",
            "Roxas, Isabela",
            "San Agustin, Isabela",
            "San Guillermo",
            "San Isidro, Isabela",
            "San Manuel, Isabela",
            "San Mariano, Isabela",
            "San Mateo, Isabela",
            "San Pablo, Isabela",
            "Santa Maria, Isabela",
            "Santo Tomas, Isabela",
          ],
        },
        {
          provinceName: "Nueva Vizcaya",
          cities: [
            "Alfonso Castañeda",
            "Ambaguio",
            "Aritao",
            "Bagabag, Nueva Vizcaya",
            "Bambang, Nueva Vizcaya",
            "Bayombong",
            "Diadi",
            "Dupax del Norte",
            "Dupax del Sur",
            "Kasibu",
            "Kayapa",
            "Quezon, Nueva Vizcaya",
            "Santa Fe, Nueva Vizcaya",
            "Solano, Nueva Vizcaya",
            "Villaverde, Nueva Vizcaya",
          ],
        },
        {
          provinceName: "Quirino",
          cities: [
            "Aglipay",
            "Cabarroguis",
            "Diffun",
            "Maddela",
            "Nagtipunan",
            "Saguday",
          ],
        },
      ],
    },
    {
      region: "REGION III (CENTRAL LUZON)",
      provinces: [
        {
          provinceName: "Aurora",
          cities: [
            "Baler",
            "Casiguran",
            "Dilasag",
            "Dinalungan",
            "Dingalan",
            "Dipaculao",
            "Maria Aurora",
            "San Luis",
          ],
        },
        {
          provinceName: "Bataan",
          cities: [
            "Abucay",
            "Bagac",
            "Dinalupihan",
            "Hermosa",
            "Limay",
            "Mariveles",
            "Morong",
            "Orani",
            "Orion",
            "Pilar",
            "Samal",
          ],
        },
        {
          provinceName: "Bulacan",
          cities: [
            "Angat",
            "Balagtas",
            "Baliwag",
            "Bocaue",
            "Bulakan",
            "Bustos",
            "Calumpit",
            "Doña Remedios Trinidad",
            "Guiguinto",
            "Hagonoy",
            "Malolos",
            "Marilao",
            "Meycauayan",
            "Norzagaray",
            "Obando",
            "Pandi",
            "Paombong",
            "Plaridel",
            "Pulilan",
            "San Ildefonso",
            "San Jose del Monte",
            "San Miguel",
            "San Rafael",
            "Santa Maria",
          ],
        },
        {
          provinceName: "Nueva Ecija",
          cities: [
            "Aliaga",
            "Bongabon",
            "Cabanatuan",
            "Cabiao",
            "Carranglan",
            "Cuyapo",
            "Gabaldon (Bitulok & Sabani)",
            "Gapan",
            "General Mamerto Natividad",
            "General Tinio (Papaya)",
            "Guimba",
            "Jaen",
            "Laur",
            "Licab",
            "Llanera",
            "Lupao",
            "Science City of Muñoz",
            "Nampicuan",
            "Palayan",
            "Pantabangan",
            "Peñaranda",
            "Quezon",
            "Rizal",
            "San Antonio",
            "San Isidro",
            "San Jose (Cabaritan)",
            "San Leonardo",
            "Santa Rosa",
            "Santo Domingo",
            "Talavera",
            "Talugtug",
            "Zaragoza",
          ],
        },
        {
          provinceName: "Pampanga",
          cities: [
            "Apalit",
            "Arayat, Pampanga",
            "Bacolor",
            "Candaba",
            "Floridablanca, Pampanga",
            "Guagua",
            "Lubao",
            "Macabebe",
            "Magalang",
            "Masantol",
            "Mexico, Pampanga",
            "Minalin",
            "Porac",
            "San Luis, Pampanga",
            "San Simon, Pampanga",
            "Santa Ana, Pampanga",
            "Santa Rita, Pampanga",
            "Santo Tomas, Pampanga",
            "Sasmuan",
          ],
        },
        {
          provinceName: "Tarlac",
          cities: [
            "Anao",
            "Bamban",
            "Camiling",
            "Capas",
            "Concepcion",
            "Gerona",
            "La Paz",
            "Mayantoc",
            "Moncada",
            "Paniqui",
            "Pura",
            "Ramos",
            "San Clemente",
            "San Jose",
            "San Manuel",
            "Santa Ignacia",
            "Tarlac City",
            "Victoria",
          ],
        },
        {
          provinceName: "Zambales",
          cities: [
            "Botolan",
            "Cabangan",
            "Candelaria",
            "Castillejos",
            "Iba",
            "Masinloc",
            "Olongapo",
            "Palauig",
            "San Antonio",
            "San Felipe",
            "San Marcelino",
            "San Narciso",
            "Santa Cruz",
            "Subic",
          ],
        },
      ],
    },
    {
      region: "REGION IV-A (CALABARZON)",
      provinces: [
        {
          provinceName: "Batangas",
          cities: [
            "Agoncillo",
            "Alitagtag",
            "Balayan",
            "Balete",
            "Batangas City",
            "Bauan",
            "Calaca",
            "Calatagan",
            "Cuenca",
            "Ibaan",
            "Laurel",
            "Lemery",
            "Lian",
            "Lipa",
            "Lobo",
            "Mabini",
            "Malvar",
            "Mataasnakahoy",
            "Nasugbu",
            "Padre Garcia",
            "Rosario",
            "San Jose",
            "San Juan",
            "San Luis",
            "San Nicolas",
            "San Pascual",
            "Santa Teresita",
            "Santo Tomas",
            "Taal",
            "Talisay",
            "Tanauan",
            "Taysan",
            "Tingloy",
            "Tuy",
          ],
        },
        {
          provinceName: "Cavite",
          cities: [
            "Alfonso",
            "Amadeo",
            "Bacoor",
            "Carmona",
            "Cavite City",
            "Dasmariñas",
            "General Emilio Aguinaldo",
            "General Mariano Alvarez",
            "General Trias",
            "Imus",
            "Indang",
            "Kawit",
            "Magallanes",
            "Maragondon",
            "Mendez",
            "Naic",
            "Noveleta",
            "Rosario",
            "Silang",
            "Tagaytay",
            "Tanza",
            "Ternate",
            "Trece Martires City",
          ],
        },
        {
          provinceName: "Laguna",
          cities: [
            "Alaminos, Laguna",
            "Bay, Laguna",
            "Calauan",
            "Cavinti",
            "Famy",
            "Kalayaan, Laguna",
            "Liliw",
            "Los Baños, Laguna",
            "Luisiana",
            "Lumban",
            "Mabitac",
            "Magdalena, Laguna",
            "Majayjay",
            "Nagcarlan",
            "Paete",
            "Pagsanjan",
            "Pakil",
            "Pangil",
            "Pila, Laguna",
            "Rizal, Laguna",
            "Santa Cruz, Laguna",
            "Santa Maria, Laguna",
            "Siniloan",
            "Victoria, Laguna",
          ],
        },
        {
          provinceName: "Quezon",
          cities: [
            "Agdangan",
            "Alabat",
            "Atimonan",
            "Buenavista",
            "Burdeos",
            "Calauag",
            "Candelaria",
            "Catanauan",
            "Dolores",
            "General Luna",
            "General Nakar",
            "Guinayangan",
            "Gumaca",
            "Infanta",
            "Jomalig",
            "Lopez",
            "Lucban",
            "Lucena",
            "Macalelon",
            "Mauban",
            "Mulanay",
            "Padre Burgos",
            "Pagbilao",
            "Panukulan",
            "Patnanungan",
            "Perez",
            "Pitogo",
            "Plaridel",
            "Polillo",
            "Quezon",
            "Real",
            "Sampaloc",
            "San Andres",
            "San Antonio",
            "San Francisco",
            "San Narciso",
            "Sariaya",
            "Tagkawayan",
            "Tayabas",
            "Tiaong",
            "Unisan",
          ],
        },
        {
          provinceName: "Rizal",
          cities: [
            "Angono",
            "Antipolo",
            "Baras",
            "Binangonan",
            "Cainta",
            "Cardona",
            "Jalajala",
            "Morong",
            "Pililla",
            "Rodriguez",
            "San Mateo",
            "Tanay",
            "Taytay",
            "Teresa",
          ],
        },
      ],
    },
    {
      region: "REGION IV-B (MIMAROPA)",
      provinces: [
        {
          provinceName: "Marinduque",
          cities: [
            "Boac",
            "Buenavista",
            "Gasan",
            "Mogpog",
            "Santa Cruz",
            "Torrijos",
          ],
        },
        {
          provinceName: "Occidental Mindoro",
          cities: [
            "Abra de Ilog",
            "Calintaan",
            "Looc, Occidental Mindoro",
            "Lubang, Occidental Mindoro",
            "Magsaysay, Occidental Mindoro",
            "Mamburao",
            "Paluan",
            "Rizal, Occidental Mindoro",
            "Sablayan",
            "San Jose, Occidental Mindoro",
            "Santa Cruz, Occidental Mindoro",
          ],
        },
        {
          provinceName: "Oriental Mindoro",
          cities: [
            "Baco, Oriental Mindoro",
            "Bansud",
            "Bongabong",
            "Bulalacao",
            "Gloria, Oriental Mindoro",
            "Mansalay",
            "Naujan",
            "Pinamalayan",
            "Pola, Oriental Mindoro",
            "Puerto Galera",
            "Roxas, Oriental Mindoro",
            "San Teodoro, Oriental Mindoro",
            "Socorro, Oriental Mindoro",
            "Victoria, Oriental Mindoro",
          ],
        },
        {
          provinceName: "Palawan",
          cities: [
            "Aborlan",
            "Agutaya",
            "Araceli",
            "Balabac",
            "Bataraza",
            "Brooke's Point",
            "Busuanga",
            "Cagayancillo",
            "Coron",
            "Culion",
            "Cuyo",
            "Dumaran",
            "El Nido",
            "Kalayaan",
            "Linapacan",
            "Magsaysay",
            "Narra",
            "Puerto Princesa",
            "Quezon",
            "Rizal",
            "Roxas",
            "San Vicente",
            "Sofronio Española",
            "Taytay",
          ],
        },
        {
          provinceName: "Romblon",
          cities: [
            "Alcantara",
            "Banton (Jones)",
            "Cajidiocan",
            "Calatrava",
            "Concepcion",
            "Corcuera",
            "Ferrol",
            "Looc",
            "Magdiwang",
            "Odiongan",
            "Romblon",
            "San Agustin",
            "San Andres",
            "San Fernando",
            "San Jose",
            "Santa Fe",
            "Santa Maria",
          ],
        },
      ],
    },
    {
      region: "REGION IX (ZAMBOANGA PENINSULA)",
      provinces: [
        {
          provinceName: "Zamboanga Del Norte",
          cities: [
            "Baliguian",
            "Godod",
            "Gutalac",
            "Jose Dalman",
            "Kalawit",
            "Katipunan",
            "La Libertad",
            "Labason",
            "Leon B. Postigo",
            "Liloy",
            "Manukan",
            "Mutia",
            "Piñan",
            "Polanco",
            "Rizal",
            "Roxas",
            "Salug",
            "Sergio Osmeña",
            "Siayan",
            "Sibuco",
            "Sibutad",
            "Sindangan",
            "Siocon",
            "Sirawai",
            "Tampilisan",
          ],
        },
        {
          provinceName: "Zamboanga Del Sur",
          cities: [
            "Aurora",
            "Bayog",
            "Dimataling",
            "Dinas",
            "Dumalinao",
            "Dumingag",
            "Guipos",
            "Josefina",
            "Kumalarang",
            "Labangan",
            "Lakewood",
            "Lapuyan",
            "Mahayag",
            "Margosatubig",
            "Midsalip",
            "Molave",
            "Pagadian",
            "Pitogo",
            "Ramon Magsaysay",
            "San Miguel",
            "San Pablo",
            "Sominot",
            "Tabina",
            "Tambulig",
            "Tigbao",
            "Tukuran",
            "Vincenzo A. Sagun",
            "Zamboanga City",
          ],
        },
        {
          provinceName: "Zamboanga Sibugay",
          cities: [
            "Alicia",
            "Buug",
            "Diplahan",
            "Imelda",
            "Ipil",
            "Kabasalan",
            "Mabuhay",
            "Malangas",
            "Naga",
            "Olutanga",
            "Payao",
            "Roseller Lim",
            "Siay",
            "Talusan",
            "Titay",
            "Tungawan",
          ],
        },
      ],
    },
    {
      region: "REGION V (BICOL REGION)",
      provinces: [
        {
          provinceName: "Albay",
          cities: [
            "Bacacay",
            "Camalig",
            "Daraga",
            "Guinobatan",
            "Jovellar",
            "Legazpi",
            "Libon",
            "Ligao",
            "Malilipot",
            "Malinao",
            "Manito",
            "Oas",
            "Pio Duran",
            "Polangui",
            "Rapu-Rapu",
            "Santo Domingo",
            "Tabaco",
            "Tiwi",
          ],
        },
        {
          provinceName: "Camarines Norte",
          cities: [
            "Basud",
            "Capalonga",
            "Daet",
            "Jose Panganiban",
            "Labo",
            "Mercedes",
            "Paracale",
            "San Lorenzo Ruiz",
            "San Vicente",
            "Santa Elena",
            "Talisay",
            "Vinzons",
          ],
        },
        {
          provinceName: "Camarines Sur",
          cities: [
            "Baao",
            "Balatan",
            "Bato",
            "Bombon",
            "Buhi",
            "Bula",
            "Cabusao",
            "Calabanga",
            "Camaligan",
            "Canaman",
            "Caramoan",
            "Del Gallego",
            "Gainza",
            "Garchitorena",
            "Goa",
            "Iriga",
            "Lagonoy",
            "Libmanan",
            "Lupi",
            "Magarao",
            "Milaor",
            "Minalabac",
            "Nabua",
            "Naga",
            "Ocampo",
            "Pamplona",
            "Pasacao",
            "Pili",
            "Presentacion",
            "Ragay",
            "Sagñay",
            "San Fernando",
            "San Jose",
            "Sipocot",
            "Siruma",
            "Tigaon",
            "Tinambac",
          ],
        },
        {
          provinceName: "Catanduanes",
          cities: [
            "Bagamanoc",
            "Baras",
            "Bato",
            "Caramoran",
            "Gigmoto",
            "Pandan",
            "Panganiban",
            "San Andres",
            "San Miguel",
            "Viga",
            "Virac",
          ],
        },
        {
          provinceName: "Masbate",
          cities: [
            "Aroroy",
            "Baleno",
            "Balud",
            "Batuan",
            "Cataingan",
            "Cawayan",
            "Claveria",
            "Dimasalang",
            "Esperanza",
            "Mandaon",
            "Masbate City",
            "Milagros",
            "Mobo",
            "Monreal",
            "Palanas",
            "Pio V. Corpus",
            "Placer",
            "San Fernando",
            "San Jacinto",
            "San Pascual",
            "Uson",
          ],
        },
        {
          provinceName: "Sorsogon",
          cities: [
            "Barcelona",
            "Bulan",
            "Bulusan",
            "Casiguran",
            "Castilla",
            "Donsol",
            "Gubat",
            "Irosin",
            "Juban",
            "Magallanes",
            "Matnog",
            "Pilar",
            "Prieto Diaz",
            "Santa Magdalena",
            "Sorsogon City",
          ],
        },
      ],
    },
    {
      region: "REGION VI (WESTERN VISAYAS)",
      provinces: [
        {
          provinceName: "Aklan",
          cities: [
            "Altavas",
            "Balete",
            "Banga",
            "Batan",
            "Buruanga",
            "Ibajay",
            "Kalibo",
            "Lezo",
            "Libacao",
            "Madalag",
            "Makato",
            "Malay",
            "Malinao",
            "Nabas",
            "New Washington",
            "Numancia",
            "Tangalan",
          ],
        },
        {
          provinceName: "Antique",
          cities: [
            "Anini-y",
            "Barbaza (Nalupa)",
            "Belison",
            "Bugasong (Bugason)",
            "Caluya",
            "Culasi (Bacong)",
            "Hamtic",
            "Laua-an",
            "Libertad (Inayawan)",
            "Pandan",
            "Patnongon",
            "San Jose de Buenavista",
            "San Remigio (Tigbagacay)",
            "Sebaste (Ipayo)",
            "Sibalom",
            "Tibiao",
            "Tobias Fornier (Dao)",
            "Valderrama (Kaberi-an)",
          ],
        },
        {
          provinceName: "Capiz",
          cities: [
            "Cuartero",
            "Dao",
            "Dumalag",
            "Dumarao",
            "Ivisan",
            "Jamindan",
            "Maayon",
            "Mambusao",
            "Panay",
            "Panitan",
            "Pilar",
            "Pontevedra",
            "President Roxas",
            "Roxas City",
            "Sapian",
            "Sigma",
            "Tapaz",
          ],
        },
        {
          provinceName: "Guimaras",
          cities: [
            "Buenavista",
            "Jordan",
            "Nueva Valencia",
            "San Lorenzo",
            "Sibunag",
          ],
        },
        {
          provinceName: "IloIlo",
          cities: [
            "Ajuy, Iloilo",
            "Alimodian",
            "Anilao, Iloilo",
            "Badiangan",
            "Balasan",
            "Banate, Iloilo",
            "Barotac Nuevo",
            "Barotac Viejo",
            "Batad, Iloilo",
            "Bingawan",
            "Cabatuan, Iloilo",
            "Calinog",
            "Carles, Iloilo",
            "Concepcion, Iloilo",
            "Dingle, Iloilo",
            "Dueñas, Iloilo",
            "Dumangas",
            "Estancia, Iloilo",
            "Guimbal",
            "Igbaras",
            "Janiuay",
            "Lambunao",
            "Leganes, Iloilo",
            "Lemery, Iloilo",
            "Leon, Iloilo",
            "Maasin, Iloilo",
            "Miagao",
            "Mina, Iloilo",
            "New Lucena",
            "Oton",
            "Pavia, Iloilo",
            "Pototan",
            "San Dionisio, Iloilo",
            "San Enrique, Iloilo",
            "San Joaquin, Iloilo",
            "San Miguel, Iloilo",
            "San Rafael, Iloilo",
            "Santa Barbara, Iloilo",
            "Sara, Iloilo",
            "Tigbauan",
            "Tubungan",
            "Zarraga",
          ],
        },
        {
          provinceName: "Negros Occidental",
          cities: [
            "Bacolod City",
            "Bago City",
            "Binalbagan",
            "Cadiz City",
            "Calatrava",
            "Candoni",
            "Cauayan",
            "Don Salvador Benedicto",
            "Enrique B. Magalona",
            "Escalante City",
            "Himamaylan City",
            "Hinigaran",
            "Hinoba-an",
            "Ilog",
            "Isabela",
            "Kabankalan City",
            "La Carlota City",
            "La Castellana",
            "Manapla",
            "Moises Padilla",
            "Murcia",
            "Pontevedra",
            "Pulupandan",
            "Sagay City",
            "San Carlos City",
            "San Enrique",
            "Silay City",
            "Sipalay City",
            "Talisay City",
            "Toboso",
            "Valladolid",
            "Victorias City",
          ],
        },
      ],
    },
    {
      region: "REGION VII (CENTRAL VISAYAS)",
      provinces: [
        {
          provinceName: "Bohol",
          cities: [
            "Alburquerque",
            "Antequera",
            "Baclayon",
            "Balilihan",
            "Calape",
            "Catigbian",
            "Corella",
            "Cortes",
            "Dauis",
            "Loon",
            "Maribojoc",
            "Panglao",
            "Sikatuna",
            "Tagbilaran",
            "Tubigon",
            "Bien Unido",
            "Buenavista",
            "Clarin",
            "Dagohoy",
            "Danao",
            "Getafe",
            "Inabanga",
            "President Carlos P. Garcia",
            "Sagbayan",
            "San Isidro",
            "San Miguel",
            "Talibon",
            "Trinidad",
            "Ubay",
            "Alicia",
            "Anda",
            "Batuan",
            "Bilar",
            "Candijay",
            "Carmen",
            "Dimiao",
            "Duero",
            "Garcia Hernandez",
            "Guindulman",
            "Jagna",
            "Sevilla",
            "Lila",
            "Loay",
            "Loboc",
            "Mabini",
            "Pilar",
            "Sierra Bullones",
            "Valencia",
          ],
        },
        {
          provinceName: "Cebu",
          cities: [
            "Alcantara",
            "Alcoy",
            "Alegria",
            "Aloguinsan",
            "Argao",
            "Asturias",
            "Badian",
            "Balamban",
            "Bantayan",
            "Barili",
            "Bogo",
            "Boljoon",
            "Borbon",
            "Carcar",
            "Carmen",
            "Catmon",
            "Cebu City",
            "Compostela",
            "Consolacion",
            "Cordova",
            "Daanbantayan",
            "Dalaguete",
            "Danao",
            "Dumanjug",
            "Ginatilan",
            "Lapu-Lapu City",
            "Liloan",
            "Madridejos",
            "Malabuyoc",
            "Mandaue",
            "Medellin",
            "Minglanilla",
            "Moalboal",
            "Naga City",
            "Oslob",
            "Pilar",
            "Pinamungajan",
            "Poro",
            "Ronda",
            "Samboan",
            "San Fernando",
            "San Francisco",
            "San Remigio",
            "Santa Fe",
            "Santander",
            "Sibonga",
            "Sogod",
            "Tabogon",
            "Tabuelan",
            "Talisay",
            "Toledo City",
            "Tuburan",
            "Tudela",
          ],
        },
        {
          provinceName: "Negros Oriental",
          cities: [
            "Amlan (Ayuquitan)",
            "Ayungon",
            "Bacong",
            "Bais",
            "Basay",
            "Bayawan (Tolong)",
            "Bindoy (Payabon)",
            "Canlaon",
            "Dauin",
            "Dumaguete",
            "Guihulngan",
            "Jimalalud",
            "La Libertad",
            "Mabinay",
            "Manjuyod",
            "Pamplona",
            "San Jose",
            "Santa Catalina",
            "Siaton",
            "Sibulan",
            "Tanjay",
            "Tayasan",
            "Valencia (Luzurriaga)",
            "Vallehermoso",
            "Zamboanguita",
          ],
        },
        {
          provinceName: "Siquijor",
          cities: [
            "Enrique Villanueva",
            "Larena",
            "Lazi",
            "Maria",
            "San Juan",
            "Siquijor",
          ],
        },
      ],
    },
    {
      region: "REGION VIII (EASTERN VISAYAS)",
      provinces: [
        {
          provinceName: "Biliran",
          cities: [
            "Almeria",
            "Biliran",
            "Cabucgayan",
            "Caibiran",
            "Culaba",
            "Kawayan",
            "Maripipi",
            "Naval",
          ],
        },
        {
          provinceName: "Eastern Samar",
          cities: [
            "Arteche",
            "Balangiga",
            "Balangkayan",
            "Borongan",
            "Can-avid",
            "Dolores",
            "General MacArthur",
            "Giporlos",
            "Guiuan",
            "Hernani",
            "Jipapad",
            "Lawaan",
            "Llorente",
            "Maslog",
            "Maydolong",
            "Mercedes",
            "Oras",
            "Quinapondan",
            "Salcedo",
            "San Julian",
            "San Policarpo",
            "Sulat",
            "Taft",
          ],
        },
        {
          provinceName: "Leyte",
          cities: [
            "Abuyog",
            "Alangalang",
            "Albuera",
            "Babatngon",
            "Barugo",
            "Bato",
            "Baybay",
            "Burauen",
            "Calubian",
            "Capoocan",
            "Carigara",
            "Dagami",
            "Dulag",
            "Hilongos",
            "Hindang",
            "Inopacan",
            "Isabel",
            "Jaro",
            "Javier (Bugho)",
            "Julita",
            "Kananga",
            "La Paz",
            "Leyte",
            "MacArthur",
            "Mahaplag",
            "Matag-ob",
            "Mayorga",
            "Merida",
            "Ormoc",
            "Palo",
            "Palompon",
            "Pastrana",
            "San Isidro",
            "San Miguel",
            "Santa Fe",
            "Tabango",
            "Tabontabon",
            "Tacloban",
            "Tanauan",
            "Tolosa",
            "Tunga",
            "Villaba",
          ],
        },
        {
          provinceName: "Northern Samar",
          cities: [
            "Allen",
            "Biri",
            "Bobon",
            "Capul",
            "Catarman",
            "Catubig",
            "Gamay",
            "Laoang",
            "Lapinig",
            "Las Navas",
            "Lavezares",
            "Lope de Vega",
            "Mapanas",
            "Mondragon",
            "Palapag",
            "Pambujan",
            "Rosario",
            "San Antonio",
            "San Isidro",
            "San Jose",
            "San Roque",
            "San Vicente",
            "Silvino Lobos",
            "Victoria",
          ],
        },
        {
          provinceName: "Western Samar",
          cities: [
            "Almagro",
            "Basey",
            "Calbayog",
            "Calbiga",
            "Catbalogan",
            "Daram",
            "Gandara",
            "Hinabangan",
            "Jiabong",
            "Marabut",
            "Matuguinao",
            "Motiong",
            "Pagsanghan",
            "Paranas (Wright)",
            "Pinabacdao",
            "San Jorge",
            "San Jose de Buan",
            "San Sebastian",
            "Santa Margarita",
            "Santa Rita",
            "Santo Niño",
            "Tagapul-an",
            "Talalora",
            "Tarangnan",
            "Villareal",
            "Zumarraga",
          ],
        },
        {
          provinceName: "Southern Leyte",
          cities: [
            "Anahawan",
            "Bontoc, Southern Leyte",
            "Hinunangan",
            "Hinundayan",
            "Libagon",
            "Liloan, Southern Leyte",
            "Limasawa",
            "Macrohon",
            "Malitbog, Southern Leyte",
            "Padre Burgos, Southern Leyte",
            "Pintuyan",
            "Saint Bernard, Southern Leyte",
            "San Francisco, Southern Leyte",
            "San Juan, Southern Leyte",
            "San Ricardo",
            "Silago",
            "Sogod, Southern Leyte",
            "Tomas Oppus",
          ],
        },
      ],
    },
    {
      region: "REGION X (NORTHERN MINDANAO)",
      provinces: [
        {
          provinceName: "Bukidnon",
          cities: [
            "Baungon",
            "Cabanglasan",
            "Damulog",
            "Dangcagan",
            "Don Carlos",
            "Impasugong",
            "Kadingilan",
            "Kalilangan",
            "Kibawe",
            "Kitaotao",
            "Lantapan",
            "Libona",
            "Malaybalay",
            "Malitbog",
            "Manolo Fortich",
            "Maramag",
            "Pangantucan",
            "Quezon",
            "San Fernando",
            "Sumilao",
            "Talakag",
            "Valencia",
          ],
        },
        {
          provinceName: "Camiguin",
          cities: ["Catarman", "Guinsiliban", "Mahinog", "Mambajao", "Sagay"],
        },
        {
          provinceName: "Lanao Del Norte",
          cities: [
            "Bacolod",
            "Baloi",
            "Baroy",
            "Iligan",
            "Kapatagan",
            "Kauswagan",
            "Kolambugan",
            "Lala",
            "Linamon",
            "Magsaysay",
            "Maigo",
            "Matungao",
            "Munai",
            "Nunungan",
            "Pantao Ragat",
            "Pantar",
            "Poona Piagapo",
            "Salvador",
            "Sapad",
            "Sultan Naga Dimaporo (Karomatan)",
            "Tagoloan",
            "Tangcal",
            "Tubod",
          ],
        },
        {
          provinceName: "Misamis Occidental",
          cities: [
            "Aloran",
            "Baliangao",
            "Bonifacio",
            "Calamba",
            "Clarin",
            "Concepcion",
            "Don Victoriano Chiongbian (Don Mariano Marcos)",
            "Jimenez",
            "Lopez Jaena",
            "Oroquieta",
            "Ozamiz",
            "Panaon",
            "Plaridel",
            "Sapang Dalaga",
            "Sinacaban",
            "Tangub",
            "Tudela",
          ],
        },
        {
          provinceName: "Misamis Oriental",
          cities: [
            "Alubijid",
            "Balingasag",
            "Balingoan",
            "Binuangan",
            "Cagayan de Oro",
            "Claveria",
            "El Salvador",
            "Gingoog",
            "Gitagum",
            "Initao",
            "Jasaan",
            "Kinoguitan",
            "Lagonglong",
            "Laguindingan",
            "Libertad",
            "Lugait",
            "Magsaysay",
            "Manticao",
            "Medina",
            "Naawan",
            "Opol",
            "Salay",
            "Sugbongcogon",
            "Tagoloan",
            "Talisayan",
            "Villanueva",
          ],
        },
      ],
    },
    {
      region: "REGION XI (DAVAO REGION)",
      provinces: [
        {
          provinceName: "Compostella Valley",
          cities: [
            "Compostela",
            "Laak",
            "Mabini",
            "Maco",
            "Maragusan",
            "Mawab",
            "Monkayo",
            "Montevista",
            "Nabunturan",
            "New Bataan",
            "Pantukan",
          ],
        },
        {
          provinceName: "Davao Del Norte",
          cities: [
            "Asuncion",
            "Braulio E. Dujali",
            "Carmen",
            "Kapalong",
            "New Corella",
            "Panabo",
            "Samal",
            "San Isidro",
            "Santo Tomas",
            "Tagum",
            "Talaingod",
          ],
        },
        {
          provinceName: "Davao Del Sur",
          cities: [
            "Bansalan",
            "Davao City",
            "Digos",
            "Hagonoy",
            "Kiblawan",
            "Magsaysay",
            "Malalag",
            "Matanao",
            "Padada",
            "Santa Cruz",
            "Sulop",
          ],
        },
        {
          provinceName: "Davao Occidental",
          cities: [
            "Don Marcelino",
            "Jose Abad Santos",
            "Malita",
            "Santa Maria",
            "Sarangani",
          ],
        },
        {
          provinceName: "Davao Oriental",
          cities: [
            "Baganga",
            "Banaybanay",
            "Boston",
            "Caraga",
            "Cateel",
            "Governor Generoso",
            "Lupon",
            "Manay",
            "Mati",
            "San Isidro",
            "Tarragona",
          ],
        },
      ],
    },
    {
      region: "REGION XII (SOCCSKARGEN)",
      provinces: [
        {
          provinceName: "Cotabato (NORTH COTABATO)",
          cities: [
            "Alamada",
            "Aleosan",
            "Antipas",
            "Arakan",
            "Banisilan",
            "Carmen",
            "Kabacan",
            "Kidapawan City",
            "Libungan",
            "M'lang",
            "Magpet",
            "Makilala",
            "Matalam",
            "Midsayap",
            "Pigcawayan",
            "Pikit",
            "President Roxas",
            "Tulunan",
          ],
        },
        {
          provinceName: "Sarangani",
          cities: [
            "Alabel",
            "Glan",
            "Kiamba",
            "Maasim",
            "Maitum",
            "Malapatan",
            "Malungon",
          ],
        },
        {
          provinceName: "South Cotabato",
          cities: [
            "Banga",
            "General Santos",
            "Koronadal",
            "Lake Sebu",
            "Norala",
            "Polomolok",
            "Santo Niño",
            "Surallah",
            "T'Boli",
            "Tampakan",
            "Tantangan",
            "Tupi",
          ],
        },
        {
          provinceName: "Sultan Kudarat",
          cities: [
            "Bagumbayan",
            "Columbio",
            "Esperanza",
            "Isulan",
            "Kalamansig",
            "Lambayong",
            "Lebak",
            "Lutayan",
            "Palimbang",
            "President Quirino",
            "Senator Ninoy Aquino",
          ],
        },
      ],
    },
    {
      region: "REGION XIII (CARAGA)",
      provinces: [
        {
          provinceName: "Agusan del Norte",
          cities: [
            "Buenavista",
            "Carmen",
            "Jabonga",
            "Kitcharao",
            "Las Nieves",
            "Magallanes",
            "Nasipit",
            "Remedios T. Romualdez",
            "Santiago",
            "Tubay",
          ],
        },
        {
          provinceName: "Agusan del Sur",
          cities: [
            "Bayugan",
            "Bunawan",
            "Esperanza",
            "La Paz",
            "Loreto",
            "Prosperidad",
            "Rosario",
            "San Francisco",
            "San Luis",
            "Santa Josefa",
            "Sibagat",
            "Talacogon",
            "Trento",
            "Veruela",
          ],
        },
        {
          provinceName: "Dinagat Islands",
          cities: [
            "Basilisa",
            "Cagdianao",
            "Dinagat",
            "Libjo",
            "Loreto",
            "San Jose",
            "Tubajon",
          ],
        },
        {
          provinceName: "Surigao del Norte",
          cities: [
            "Alegria",
            "Bacuag",
            "Burgos",
            "Claver",
            "Dapa",
            "Del Carmen",
            "General Luna",
            "Gigaquit",
            "Mainit",
            "Malimono",
            "Pilar",
            "Placer",
            "San Benito",
            "San Francisco (Anao-Aon)",
            "San Isidro",
            "Santa Monica (Sapao)",
            "Sison",
            "Socorro",
            "Surigao City",
            "Tagana-an",
            "Tubod",
          ],
        },
        {
          provinceName: "Surigao del Sur",
          cities: [
            "Barobo",
            "Bayabas",
            "Bislig",
            "Cagwait",
            "Cantilan",
            "Carmen",
            "Carrascal",
            "Cortes",
            "Hinatuan",
            "Lanuza",
            "Lianga",
            "Lingig",
            "Madrid",
            "Marihatag",
            "San Agustin",
            "San Miguel",
            "Tagbina",
            "Tago",
            "Tandag",
          ],
        },
      ],
    },
  ];

  const validateForm1 = () => {
    // Validate form 1 fields
    const studentNumber = document.getElementById("studentNumber").value;
    const emailAddress = document.getElementById("emailAddress").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (!studentNumber || !emailAddress || !password || !confirmPassword)
      return false;
    if (password !== confirmPassword) {
      setIsNotMatch(true);
      return false;
    } else {
      setIsNotMatch(false);
    }

    return true;
  };

  // Check multiple select input

  const changeRegion = (e) => {
    setRegion(e.target.value);
    setProvinces(
      regionsWithProvinces.find((reg) => reg.region === e.target.value)
        .provinces
    );
  };
  const changeProvince = (e) => {
    setProvince(e.target.value);
    setCities(
      provinces.find((province) => province.provinceName === e.target.value)
        .cities
    );
  };

  const validateForm2 = () => {
    // Validate form 2 fields
    const firstName = document.getElementById("firstName").value;
    const middleName = document.getElementById("middleName").value;
    const lastName = document.getElementById("lastName").value;
    const birthDate = document.getElementById("birthDate").value;

    if (!firstName || !lastName || !birthDate || !gender || !course)
      return false;

    return true;
  };
  const validateForm3 = () => {
    // Validate form 3 fields
    const contactNumber = document.getElementById("contactNumber").value;
    const streetAddress = document.getElementById("streetAddress").value;
    const barangay = document.getElementById("barangay").value;
    const city = document.getElementById("city").value;

    if (
      !contactNumber ||
      !streetAddress ||
      !barangay ||
      !city ||
      !region ||
      !province
    )
      return false;

    return true;
  };

  const handleForm1Next = async () => {
    if (validateForm1()) {
      if (
        passLabel() === "Very Weak" ||
        passLabel() === "Weak" ||
        passLabel() === "Fair"
      ) {
        setIsPasswordStrong(false);
      } else {
        axios
          .post(
            "http://api.discipline-recommender-system.xyz/check-existence",
            {
              emailAddress,
              studentNumber,
            }
          )
          .then((res) => {
            if (res.data.isTaken === true) {
              setIsEmailTaken(res.data.isTaken);
            } else {
              setShowForm1(true);
              setShowForm2(true);
              setShowProgressBar2(true);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    } else {
      formRef1.current.reportValidity();
    }
  };
  const handleForm2Next = () => {
    console.log(validateForm2());
    if (validateForm2()) {
      setShowForm1(true);
      setShowForm2(false);
      setShowForm3(true);
      setShowProgressBar3(true);
    } else {
      formRef2.current.reportValidity();
    }
  };
  const handleForm2Back = () => {
    setShowForm1(false);
    setShowForm2(false);
    setShowForm3(false);
    setShowProgressBar2(false);
  };
  const handleForm3Back = () => {
    setShowForm2(true);
    setShowForm3(false);
    setShowProgressBar3(false);
  };

  const handleForm3Submit = () => {
    if (validateForm3()) {
      setShowForm1(false);
      setShowForm2(false);
    } else {
      formRef3.current.reportValidity();
    }
  };

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (validateForm1() && validateForm2() && validateForm3()) {
        axios
          .post("http://api.discipline-recommender-system.xyz/signup-student", {
            studentNumber,
            emailAddress,
            password,
            firstName,
            middleName,
            lastName,
            birthDate,
            course,
            gender,
            sectionYear,
            suffix,
            phoneNumber,
            streetAddress,
            barangay,
            city,
            base64: profileImage,
            province,
            region,
          })
          .then((res) => {
            if (res.status === 200) {
              Swal.fire({
                position: "center",
                icon: "success",
                title: "Congratulations!",
                text: "Your account has been successfully created.",
                showConfirmButton: false,
                timer: 1000,
                padding: "3em",
              }).then((result) => {
                if (result.dismiss === Swal.DismissReason.timer) {
                  navigate("/login");
                }
              });
            }
          })
          .catch((err) => console.log(err));
      }
    }, 1000);
  };

  return (
    <>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-7">
            <div className="wrapper shadow-lg border mx-auto my-3 py-5">
              <div className="campus-logo d-flex justify-content-center">
                <img
                  src={CvsuLogo}
                  className="img-fluid"
                  style={{ width: "120px" }}
                />
              </div>
              <div className="header">
                <ul>
                  <li className="active form_1_progressbar">
                    <div>
                      <p>1</p>
                    </div>
                  </li>
                  <li
                    className={`form_2_progressbar ${
                      showProgressBar2 ? "active" : ""
                    }`}
                  >
                    <div>
                      <p>2</p>
                    </div>
                  </li>
                  <li
                    className={`form_3_progressbar ${
                      showProgressBar3 ? "active" : ""
                    }`}
                  >
                    <div>
                      <p>3</p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="form_wrap">
                <form ref={formRef1} autoComplete="off">
                  <div
                    className={`form_1 data_info ${
                      showForm1 ? "isHidden" : "activeForm2"
                    }`}
                  >
                    <h2>Account Information</h2>
                    <p className="text-center mb-4">
                      Provide all necessary information
                    </p>
                    {isNotMatch && (
                      <p className="alert alert-danger mx-md-5 mx-2 text-center">
                        Passwords don't match. Double-check and confirm your
                        password entry.
                      </p>
                    )}
                    {!isPasswordStrong && (
                      <p className="alert alert-danger text-center mx-md-5 mx-2">
                        Please choose a stronger password for better account
                        security.
                      </p>
                    )}

                    {isEmailTaken && (
                      <p className="alert alert-warning text-center mx-md-5 mx-2">
                        Warning: Email or Student Number Already Registered
                      </p>
                    )}
                    <div className="form_container">
                      <div className="input_wrap">
                        <label htmlFor="studentNumber" className="fw-bold">
                          Student Number
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-lg bg-light fs-6"
                          placeholder="2020-100-1642"
                          pattern="[0-9-]+"
                          inputMode="numeric"
                          title="Only numbers and dashes are allowed"
                          name="studentNumber"
                          value={studentNumber}
                          onChange={(e) => {
                            setIsEmailTaken(false);
                            const re = /^[0-9-]+$/;
                            if (
                              e.target.value === "" ||
                              re.test(e.target.value)
                            ) {
                              setStudentNumber(e.target.value);
                            }
                          }}
                          id="studentNumber"
                          required
                        />
                      </div>

                      <div className="input_wrap">
                        <label htmlFor="emailAddress" className="fw-bold">
                          Email Address
                        </label>
                        <input
                          type="email"
                          className="form-control form-control-lg bg-light fs-6"
                          placeholder="johndoe@gmail.com"
                          value={emailAddress}
                          name="emailAddress"
                          onChange={(e) => {
                            setIsEmailTaken(false);
                            setEmailAddress(e.target.value);
                          }}
                          id="emailAddress"
                          required
                        />
                      </div>
                      <div className="input_wrap">
                        <label htmlFor="password" className="fw-bold">
                          Password
                        </label>
                        <InputGroup>
                          <input
                            type={showPassword1 ? "text" : "password"}
                            className={`form-control form-control-lg bg-light fs-6 ${
                              !isPasswordStrong ? "border-danger " : ""
                            }`}
                            placeholder="Enter your password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => {
                              setPassword(e.target.value);
                              setIsPasswordStrong(true);
                            }}
                            required
                          />
                          <Button
                            onClick={() => setShowPassword1(!showPassword1)}
                            variant="secondary"
                          >
                            {showPassword1 ? (
                              <FontAwesomeIcon
                                icon={faEyeSlash}
                                className="fa-solid fa-eye-slash showPassIcon"
                              />
                            ) : (
                              <FontAwesomeIcon
                                icon={faEye}
                                className="fa-solid fa-eye showPassIcon"
                              />
                            )}
                          </Button>
                        </InputGroup>
                        {password && <StrengthIndicator password={password} />}
                      </div>
                      <div className="input_wrap">
                        <label htmlFor="confirmPassword" className="fw-bold">
                          Confirm Password
                        </label>
                        <InputGroup>
                          <input
                            type={showPassword2 ? "text" : "password"}
                            className={`form-control form-control-lg bg-light fs-6 ${
                              isNotMatch ? "border-danger " : ""
                            }`}
                            placeholder="Confirm your password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => {
                              setConfirmPassword(e.target.value);
                              setIsNotMatch(false);
                            }}
                            required
                          />
                          <Button
                            onClick={() => setShowPassword2(!showPassword2)}
                            variant="secondary"
                          >
                            {showPassword2 ? (
                              <FontAwesomeIcon
                                icon={faEyeSlash}
                                className="fa-solid fa-eye-slash showPassIcon"
                              />
                            ) : (
                              <FontAwesomeIcon
                                icon={faEye}
                                className="fa-solid fa-eye showPassIcon"
                              />
                            )}
                          </Button>
                        </InputGroup>
                      </div>
                    </div>
                  </div>
                </form>
                <form
                  ref={formRef2}
                  encType="multipart/form-data"
                  autoComplete="off"
                >
                  <div
                    className={`form_2 data_info ${
                      showForm2 ? "activeForm2" : "isHidden"
                    }`}
                  >
                    <h2>Personal Information</h2>
                    <p className="text-center mb-4">
                      Provide all necessary information
                    </p>

                    <div className="row">
                      <div
                        className="col-12 p-0 d-flex justify-content-center align-items-center image-container-display"
                        onClick={handleImgClick}
                      >
                        <div className="image-display-inner text-center">
                          <div className="p fw-bold border rounded mb-3">
                            Add Profile Picture
                          </div>
                          {profileImage ? (
                            <img
                              src={profileImage}
                              alt="profile image"
                              className="image-display"
                            />
                          ) : (
                            <img
                              src={Upload}
                              alt="profile image"
                              className="image-display"
                            />
                          )}
                          <input
                            type="file"
                            ref={inputRef}
                            style={{ display: "none" }}
                            onChange={handleImgChange}
                          />
                        </div>
                      </div>
                      <div className="col-lg-6 p-0">
                        <div className="form_container">
                          <div className="input_wrap">
                            <label htmlFor="firstName" className="fw-bold">
                              First Name
                            </label>
                            <input
                              type="text"
                              className="form-control form-control-lg bg-light fs-6"
                              placeholder="Enter your firstname"
                              id="firstName"
                              name="firstName"
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                              required
                            />
                          </div>

                          <div className="input_wrap">
                            <label htmlFor="middleName" className="fw-bold">
                              Middle Name
                            </label>
                            <input
                              type="text"
                              className="form-control form-control-lg bg-light fs-6"
                              placeholder="Enter your middlename"
                              id="middleName"
                              name="middleName"
                              value={middleName}
                              onChange={(e) => setMiddleName(e.target.value)}
                            />
                            <p
                              className=" px-2  mt-1 rounded"
                              style={{ fontSize: "12px", position: "absolute" }}
                            >
                              Please leave it blank if not applicable.
                            </p>
                          </div>
                          <div className="input_wrap mt-2">
                            <label htmlFor="lastName" className="fw-bold">
                              Last Name
                            </label>
                            <input
                              type="text"
                              className="form-control form-control-lg bg-light fs-6"
                              placeholder="Enter your lastname"
                              id="lastName"
                              name="lastName"
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                              required
                            />
                          </div>
                          <div className="input_wrap mt-2">
                            <label htmlFor="suffix" className="fw-bold">
                              Suffix
                            </label>
                            <input
                              type="text"
                              className="form-control form-control-lg bg-light fs-6"
                              placeholder="Enter Suffix here"
                              id="suffix"
                              name="suffix"
                              value={suffix}
                              onChange={(e) => setSuffix(e.target.value)}
                            />
                            <p
                              className=" px-2  mt-1 rounded"
                              style={{ fontSize: "12px", position: "absolute" }}
                            >
                              Please leave it blank if not applicable.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6 p-0">
                        <div className="form_container">
                          <div className="input_wrap">
                            <label
                              htmlFor="gender"
                              className="text-start w-100 fw-bold"
                            >
                              Sex
                            </label>
                            <Form.Select
                              id="gender"
                              aria-label="Default select example"
                              value={gender}
                              name="gender"
                              onChange={(e) => setGender(e.target.value)}
                              required
                            >
                              <option value="" hidden>
                                Select your sex
                              </option>
                              <option value="N/A" hidden defaultValue />
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                            </Form.Select>
                          </div>
                          <div className="input_wrap">
                            <label
                              htmlFor="birthDate"
                              className="text-start w-100 fw-bold"
                            >
                              Birth Date
                            </label>
                            <DatePicker
                              className="form-control form-control-lg bg-light fs-6"
                              id="birthDate"
                              name="birthDate"
                              selected={birthDate}
                              onChange={(date) => setBirthDate(date)}
                              dateFormat="dd/MM/yyyy"
                              placeholderText="dd/mm/yyyy"
                              showYearDropdown
                              scrollableMonthYearDropdown
                              required
                            />
                            <p
                              className=" px-2  mt-1 rounded"
                              style={{ fontSize: "12px", position: "absolute" }}
                            >
                              Date format:{" "}
                              <span
                                className="text-danger px-1 rounded fw-bold"
                                style={{ backgroundColor: "#eee" }}
                              >
                                dd/mm/yyyy
                              </span>
                            </p>
                          </div>
                          <div
                            className="input_wrap"
                            style={{ marginTop: "30px" }}
                          >
                            <label
                              htmlFor="gender"
                              className="text-start w-100 fw-bold"
                            >
                              Course
                            </label>
                            <Form.Select
                              id="course"
                              aria-label="Default select example"
                              value={course}
                              name="course"
                              onChange={(e) => setCourse(e.target.value)}
                              required
                            >
                              <option value="" hidden>
                                Select Course
                              </option>
                              {programs &&
                                programs.map((program, index) => (
                                  <option
                                    key={index}
                                    value={program.program_code}
                                  >
                                    {program.program_code}
                                  </option>
                                ))}
                            </Form.Select>
                          </div>
                          <div className="input_wrap">
                            <label htmlFor="section-year" className="fw-bold">
                              Year / Section
                            </label>
                            <input
                              type="text"
                              className="form-control form-control-lg bg-light fs-6"
                              placeholder="Enter Year / Section"
                              id="section-year"
                              name="lastName"
                              value={sectionYear}
                              onChange={(e) => setSectionYear(e.target.value)}
                              required
                            />
                            <p
                              className=" px-2  mt-1 rounded"
                              style={{ fontSize: "12px", position: "absolute" }}
                            >
                              Follow this pattern: 1-2, 2-3, 3-4, 4-5
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
                <form ref={formRef3} autoComplete="off">
                  <div
                    className={`form_3 data_info ${
                      showForm3 ? "activeForm3" : "isHidden"
                    }`}
                  >
                    <h2>Contact Details</h2>
                    <p className="text-center mb-4">
                      Provide all necessary information
                    </p>
                    <div className="form_container">
                      <div className="input_wrap">
                        <label
                          htmlFor="contactNumber"
                          className="text-start w-100 fw-bold"
                        >
                          Phone Number
                        </label>
                        <input
                          value={phoneNumber}
                          type="tel"
                          id="contactNumber"
                          name="contactNumber"
                          maxLength="11"
                          pattern="[0-9]*"
                          placeholder="Enter your phone number"
                          onInput={(e) =>
                            (e.target.value = e.target.value
                              .replace(/\D/g, "")
                              .slice(0, 11))
                          }
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="form-control form-control-lg bg-light fs-6"
                          required
                        />
                        <p style={{ fontSize: "12px" }} className="ms-2 mt-1">
                          Phone number mask:{" "}
                          <span
                            className="text-danger px-1 rounded fw-bold"
                            style={{ backgroundColor: "#eee" }}
                          >
                            0916 305 4327
                          </span>
                        </p>
                      </div>

                      <div className="input_wrap">
                        <label
                          htmlFor="region"
                          className="text-start w-100 fw-bold"
                        >
                          Region
                        </label>

                        <Form.Select
                          className="form-control form-control-lg bg-light fs-6"
                          id="region"
                          name="region"
                          value={region}
                          onChange={changeRegion}
                          required
                        >
                          <option value="" hidden>
                            [Select Region]
                          </option>
                          <option value="N/A" defaultValue hidden />
                          {regionsWithProvinces.map((reg, index) => (
                            <option key={index} value={reg.region}>
                              {reg.region}
                            </option>
                          ))}
                        </Form.Select>
                      </div>
                      <div className="input_wrap">
                        <label
                          htmlFor="province"
                          className="text-start w-100 fw-bold"
                        >
                          Province
                        </label>

                        <Form.Select
                          className="form-control form-control-lg bg-light fs-6"
                          placeholder="Ex. Trece Martires City"
                          id="province"
                          name="province"
                          value={province}
                          onChange={changeProvince}
                          required
                        >
                          <option value="" hidden>
                            [Select Province]
                          </option>
                          <option value="N/A" defaultValue hidden />
                          {provinces.map((province, index) => (
                            <option key={index} value={province.provinceName}>
                              {province.provinceName}
                            </option>
                          ))}
                        </Form.Select>
                      </div>
                      <div className="input_wrap">
                        <label
                          htmlFor="city"
                          className="text-start w-100 fw-bold"
                        >
                          City / Municipality
                        </label>
                        <Form.Select
                          type="text"
                          className="form-control form-control-lg bg-light fs-6"
                          placeholder="Ex. Trece Martires City"
                          id="city"
                          name="city"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          required
                        >
                          <option value="" hidden>
                            [Select City/Municipality]
                          </option>
                          <option value="N/A" defaultValue hidden />
                          {cities.map((city, index) => (
                            <option key={index} value={city}>
                              {city}
                            </option>
                          ))}
                        </Form.Select>
                      </div>
                      <div className="input_wrap">
                        <label
                          htmlFor="streetAddress"
                          className="text-start w-100 fw-bold"
                        >
                          Street Address
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-lg bg-light fs-6"
                          placeholder="Ex. Block 7 Lot 40 Phase 2 Sampaguita Street"
                          id="streetAddress"
                          name="streetAddress"
                          value={streetAddress}
                          onChange={(e) => setStreetAddress(e.target.value)}
                          required
                        />
                      </div>
                      <div className="input_wrap">
                        <label
                          htmlFor="barangay"
                          className="text-start w-100 fw-bold"
                        >
                          Barangay
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-lg bg-light fs-6"
                          id="barangay"
                          name="barangay"
                          value={barangay}
                          onChange={(e) => setBarangay(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              <div className="btns_wrap">
                <div
                  className={`common_btns form_1_btns ${
                    showForm1 ? "btn1Hidden" : ""
                  }`}
                >
                  <button
                    className="btn btn-primary btn_next"
                    onClick={handleForm1Next}
                  >
                    Next <i className="fa-solid fa-arrow-right icon ms-2"></i>
                  </button>
                </div>
                <div
                  className={`common_btns form_2_btns ${
                    showForm2 ? "showBtn2" : "isHidden"
                  }`}
                >
                  <button
                    className="btn btn-secondary btn_back"
                    onClick={handleForm2Back}
                  >
                    <i className="fa-solid fa-arrow-left icon me-2"></i>Back
                  </button>
                  <button
                    className="btn btn-primary btn_next ms-3"
                    onClick={handleForm2Next}
                  >
                    Next <i className="fa-solid fa-arrow-right icon ms-2"></i>
                  </button>
                </div>
                <div
                  className={`common_btns form_3_btns ${
                    showForm3 ? "showBtn3" : "isHidden"
                  }`}
                >
                  <button
                    className="btn btn-secondary btn_back"
                    onClick={handleForm3Back}
                  >
                    <i className="fa-solid fa-arrow-left icon me-2"></i> Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="btn btn-success btn_done"
                  >
                    {" "}
                    Submit{" "}
                    {loading ? (
                      <ScaleLoader
                        color={"#ffffff"}
                        loading={loading}
                        size={10}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                      />
                    ) : null}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default StudentSignupPage;
