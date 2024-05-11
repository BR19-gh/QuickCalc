import { NativeModules, Platform } from "react-native";

export function formatDate(timestamp) {
  const date = new Date(timestamp);

  return date.toLocaleTimeString("en-UK", {
    year: "2-digit",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const deviceLanguage =
  Platform.OS === "ios"
    ? NativeModules.SettingsManager.settings.AppleLocale ||
      NativeModules.SettingsManager.settings.AppleLanguages[0] // iOS 13
    : NativeModules.I18nManager.localeIdentifier;

let lan;
let str = deviceLanguage;
let match = str.match(/^([a-z]{2})/i);
if (match) {
  lan = match[0];
} else {
  lan = "en";
}

export const lang = lan;

export const CALENDAR_INFO = [
  {
    en: "Gregorian",
    ar: "ميلادي",
    short: { ar: "م", en: "AD" },
    value: "gregorian",
  },
  {
    en: "Islamic",
    ar: "هجري",
    short: { ar: "ھ", en: "AH" },
    value: "islamicLunar",
  },
  {
    en: "Islamic Solar",
    ar: "هجري شمسي",
    short: { ar: "ھ ش", en: "SH" },
    value: "islamicSolar",
  },
  {
    en: "Persian",
    ar: "فارسي",
    short: { ar: "ف", en: "HS" },
    value: "persian",
  },
  {
    en: "Hebrew",
    ar: "عبري",
    short: { ar: "ع", en: "AM" },
    value: "hebrew",
  },
];
export const CALENDAR_INFO_LIMITED = [
  {
    en: "Gregorian",
    ar: "ميلادي",
    short: { ar: "م", en: "AD" },
    value: "gregorian",
  },
  {
    en: "Islamic",
    ar: "هجري",
    short: { ar: "ھ", en: "AH" },
    value: "islamicLunar",
  },
  {
    en: "Islamic Solar",
    ar: "هجري شمسي",
    short: { ar: "ھ ش", en: "SH" },
    value: "islamicSolar",
  },
];

export const UNIT_INFO = [
  {
    en: "Length",
    ar: "الطول",

    units: [
      { meausrement: "Length", en: "Meter", ar: "متر", code: "Meter" },
      { meausrement: "Length", en: "Inch", ar: "بوصة", code: "Inch" },
      { meausrement: "Length", en: "Feet", ar: "قدم", code: "Feet" },
      { meausrement: "Length", en: "Micron", ar: "ميكرومتر", code: "Micron" },
      { meausrement: "Length", en: "Yard", ar: "ياردة", code: "Yard" },
      { meausrement: "Length", en: "Mile", ar: "ميل", code: "Mile" },
    ],
  },
  {
    en: "Temperature",
    ar: "الحرارة",

    units: [
      {
        meausrement: "Temperature",
        en: "Celsius",
        ar: "درجة مئوية",
        code: "Celsius",
      },
      {
        meausrement: "Temperature",
        en: "Fahrenheit",
        ar: "فهرنهايت",
        code: "Fahrenheit",
      },
      // { meausrement: "Temperature", en: "Kelvin", ar: "كلفن", code: "Kelvin" },
    ],
  },
  {
    en: "Time",
    ar: "الوقت",

    units: [
      { meausrement: "Time", en: "Second", ar: "ثانية", code: "Second" },
      { meausrement: "Time", en: "Minute", ar: "دقيقة", code: "Minute" },
      { meausrement: "Time", en: "Hour", ar: "ساعة", code: "Hour" },
      { meausrement: "Time", en: "Day", ar: "يوم", code: "Day" },
      { meausrement: "Time", en: "Week", ar: "أسبوع", code: "Week" },
      { meausrement: "Time", en: "Month", ar: "شهر", code: "Month" },
    ],
  },
  {
    en: "Volume",
    ar: "الحجم",

    units: [
      { meausrement: "Volume", en: "Liter", ar: "لتر", code: "Liter" },
      { meausrement: "Volume", en: "Gallon", ar: "جالون", code: "Gallon" },
      { meausrement: "Volume", en: "Pint", ar: "باينت", code: "Pint" },
    ],
  },
  {
    en: "Mass",
    ar: "الكتلة",

    units: [
      { meausrement: "Mass", en: "Gram", ar: "غرام", code: "Gram" },
      { meausrement: "Mass", en: "Kilogram", ar: "كيلوغرام", code: "Kilogram" },
      { meausrement: "Mass", en: "Tonne", ar: "طن", code: "Tonne" },
      { meausrement: "Mass", en: "Ounce", ar: "أونصة", code: "Ounce" },
      { meausrement: "Mass", en: "Pound", ar: "رطل", code: "Pound" },
    ],
  },
  {
    en: "Energy",
    ar: "الطاقة",

    units: [
      { meausrement: "Energy", en: "Joule", ar: "جول", code: "Joule" },
      { meausrement: "Energy", en: "Watt-hour", ar: "واط-ساعة", code: "Watt" },
    ],
  },
  {
    en: "Angle",
    ar: "الزاوية",

    units: [
      { meausrement: "Angle", en: "Degree", ar: "درجة", code: "Degree" },
      { meausrement: "Angle", en: "Radian", ar: "راديان", code: "Radian" },
    ],
  },
  {
    en: "Electric",
    ar: "الكهرباء",

    units: [
      { meausrement: "Electric", en: "Ampere", ar: "أمبير", code: "Amp" },
      { meausrement: "Electric", en: "Volt", ar: "فولت", code: "Volt" },
      { meausrement: "Electric", en: "Ohm", ar: "أوم", code: "Ohm" },
      { meausrement: "Electric", en: "Pascal", ar: "باسكال", code: "Pascal" },
    ],
  },
  {
    en: "Data",
    ar: "البيانات",

    units: [
      { meausrement: "Data", en: "Bit", ar: "بت", code: "Bit" },
      { meausrement: "Data", en: "Byte", ar: "بايت", code: "Byte" },
    ],
  },
  {
    en: "Substance",
    ar: "المادة",

    units: [{ meausrement: "Substance", en: "Mole", ar: "مول", code: "Mole" }],
  },
];

export const CURRENCY_INFO = [
  {
    code: "AED",
    name: "United Arab Emirates Dirham",
    arabic_name: "درهم إماراتي",
    symbol: "د.إ",
    country: "United Arab Emirates",
  },
  {
    code: "AFN",
    name: "Afghan Afghani",
    arabic_name: "افغانى أفغانستان",
    symbol: "؋",
    country: "Afghanistan",
  },
  {
    code: "ALL",
    name: "Albanian Lek",
    arabic_name: "ليك ألباني",
    symbol: "L",
    country: "Albania",
  },
  {
    code: "ARS",
    name: "Argentine Peso",
    arabic_name: "بيزو أرجنتيني",
    symbol: "$",
    country: "Argentina",
  },
  {
    code: "AUD",
    name: "Australian Dollar",
    arabic_name: "دولار أسترالي",
    symbol: "$",
    country: "Australia",
  },
  {
    code: "BDT",
    name: "Bangladeshi Taka",
    arabic_name: "تاكا بنغلاديشي",
    symbol: "৳",
    country: "Bangladesh",
  },
  {
    code: "BGN",
    name: "Bulgarian Lev",
    arabic_name: "ليف بلغاري",
    symbol: "лв",
    country: "Bulgaria",
  },
  {
    code: "BHD",
    name: "Bahraini Dinar",
    arabic_name: "دينار بحريني",
    symbol: ".د.ب",
    country: "Bahrain",
  },
  {
    code: "BOB",
    name: "Bolivian Boliviano",
    arabic_name: "بوليفيانو بوليفي",
    symbol: "Bs.",
    country: "Bolivia",
  },
  {
    code: "BRL",
    name: "Brazilian Real",
    arabic_name: "ريال برازيلي",
    symbol: "R$",
    country: "Brazil",
  },
  {
    code: "CAD",
    name: "Canadian Dollar",
    arabic_name: "دولار كندي",
    symbol: "$",
    country: "Canada",
  },
  {
    code: "CHF",
    name: "Swiss Franc",
    arabic_name: "فرنك سويسري",
    symbol: "CHF",
    country: "Switzerland",
  },
  {
    code: "CLP",
    name: "Chilean Peso",
    arabic_name: "بيزو تشيلي",
    symbol: "$",
    country: "Chile",
  },
  {
    code: "CNY",
    name: "Chinese Yuan",
    arabic_name: "يوان صيني",
    symbol: "¥",
    country: "China",
  },
  {
    code: "COP",
    name: "Colombian Peso",
    arabic_name: "بيزو كولومبي",
    symbol: "$",
    country: "Colombia",
  },
  {
    code: "CRC",
    name: "Costa Rican Colón",
    arabic_name: "كولون كوستاريكي",
    symbol: "₡",
    country: "Costa Rica",
  },
  {
    code: "CZK",
    name: "Czech Koruna",
    arabic_name: "كورونا تشيكية",
    symbol: "Kč",
    country: "Czech Republic",
  },
  {
    code: "DKK",
    name: "Danish Krone",
    arabic_name: "كرون دنماركي",
    symbol: "kr",
    country: "Denmark",
  },
  {
    code: "DZD",
    name: "Algerian Dinar",
    arabic_name: "دينار جزائري",
    symbol: "د.ج",
    country: "Algeria",
  },
  {
    code: "EGP",
    name: "Egyptian Pound",
    arabic_name: "جنيه مصري",
    symbol: "E£",
    country: "Egypt",
  },
  {
    code: "EUR",
    name: "Euro",
    arabic_name: "يورو",
    symbol: "€",
    country: "Eurozone",
  },
  {
    code: "FJD",
    name: "Fijian Dollar",
    arabic_name: "دولار فيجي",
    symbol: "$",
    country: "Fiji",
  },
  {
    code: "GBP",
    name: "British Pound Sterling",
    arabic_name: "جنيه إسترليني",
    symbol: "£",
    country: "United Kingdom",
  },
  {
    code: "GEL",
    name: "Georgian Lari",
    arabic_name: "لاري جورجي",
    symbol: "₾",
    country: "Georgia",
  },
  {
    code: "GHS",
    name: "Ghanaian Cedi",
    arabic_name: "سيدي غانا",
    symbol: "GH₵",
    country: "Ghana",
  },
  {
    code: "HKD",
    name: "Hong Kong Dollar",
    arabic_name: "دولار هونغ كونغي",
    symbol: "$",
    country: "Hong Kong",
  },
  {
    code: "HRK",
    name: "Croatian Kuna",
    arabic_name: "كونا كرواتية",
    symbol: "kn",
    country: "Croatia",
  },
  {
    code: "HUF",
    name: "Hungarian Forint",
    arabic_name: "فورينت مجري",
    symbol: "Ft",
    country: "Hungary",
  },
  {
    code: "IDR",
    name: "Indonesian Rupiah",
    arabic_name: "روبيه إندونيسية",
    symbol: "Rp",
    country: "Indonesia",
  },
  {
    code: "ILS",
    name: "Israeli New Shekel",
    arabic_name: "شيكل إسرائيلي جديد",
    symbol: "₪",
    country: "Israel",
  },
  {
    code: "INR",
    name: "Indian Rupee",
    arabic_name: "روبية هندية",
    symbol: "₹",
    country: "India",
  },
  {
    code: "IQD",
    name: "Iraqi Dinar",
    arabic_name: "دينار عراقي",
    symbol: "ع.د",
    country: "Iraq",
  },
  {
    code: "ISK",
    name: "Icelandic Króna",
    arabic_name: "كرونة أيسلندية",
    symbol: "kr",
    country: "Iceland",
  },
  {
    code: "JOD",
    name: "Jordanian Dinar",
    arabic_name: "دينار أردني",
    symbol: "د.ا",
    country: "Jordan",
  },
  {
    code: "JPY",
    name: "Japanese Yen",
    arabic_name: "ين ياباني",
    symbol: "¥",
    country: "Japan",
  },
  {
    code: "KES",
    name: "Kenyan Shilling",
    arabic_name: "شلن كيني",
    symbol: "KSh",
    country: "Kenya",
  },
  {
    code: "KRW",
    name: "South Korean Won",
    arabic_name: "ون كوري جنوبي",
    symbol: "₩",
    country: "South Korea",
  },
  {
    code: "KWD",
    name: "Kuwaiti Dinar",
    arabic_name: "دينار كويتي",
    symbol: "د.ك",
    country: "Kuwait",
  },
  {
    code: "KZT",
    name: "Kazakhstani Tenge",
    arabic_name: "تينغ كازاخستاني",
    symbol: "₸",
    country: "Kazakhstan",
  },
  {
    code: "LBP",
    name: "Lebanese Pound",
    arabic_name: "ليرة لبنانية",
    symbol: "ل.ل",
    country: "Lebanon",
  },
  {
    code: "LKR",
    name: "Sri Lankan Rupee",
    arabic_name: "روبية سريلانكية",
    symbol: "රු",
    country: "Sri Lanka",
  },
  {
    code: "MAD",
    name: "Moroccan Dirham",
    arabic_name: "درهم مغربي",
    symbol: "د.م.",
    country: "Morocco",
  },
  {
    code: "MDL",
    name: "Moldovan Leu",
    arabic_name: "ليو مولديفي",
    symbol: "L",
    country: "Moldova",
  },
  {
    code: "MMK",
    name: "Myanmar Kyat",
    arabic_name: "كيات ميانمار",
    symbol: "Ks",
    country: "Myanmar",
  },
  {
    code: "MNT",
    name: "Mongolian Tugrik",
    arabic_name: "توغريك منغولي",
    symbol: "₮",
    country: "Mongolia",
  },
  {
    code: "MOP",
    name: "Macanese Pataca",
    arabic_name: "باتاكا ماكاوية",
    symbol: "MOP$",
    country: "Macau",
  },
  {
    code: "MXN",
    name: "Mexican Peso",
    arabic_name: "بيزو مكسيكي",
    symbol: "$",
    country: "Mexico",
  },
  {
    code: "MYR",
    name: "Malaysian Ringgit",
    arabic_name: "رينغيت ماليزي",
    symbol: "RM",
    country: "Malaysia",
  },
  {
    code: "NGN",
    name: "Nigerian Naira",
    arabic_name: "نايرا نيجيرية",
    symbol: "₦",
    country: "Nigeria",
  },
  {
    code: "NOK",
    name: "Norwegian Krone",
    arabic_name: "كرونة نرويجية",
    symbol: "kr",
    country: "Norway",
  },
  {
    code: "NZD",
    name: "New Zealand Dollar",
    arabic_name: "دولار نيوزيلندي",
    symbol: "$",
    country: "New Zealand",
  },
  {
    code: "OMR",
    name: "Omani Rial",
    arabic_name: "ريال عماني",
    symbol: "ر.ع.",
    country: "Oman",
  },
  {
    code: "PEN",
    name: "Peruvian Nuevo Sol",
    arabic_name: "سول بيروفي جديد",
    symbol: "S/.",
    country: "Peru",
  },
  {
    code: "PHP",
    name: "Philippine Peso",
    arabic_name: "بيزو فلبيني",
    symbol: "₱",
    country: "Philippines",
  },
  {
    code: "PKR",
    name: "Pakistani Rupee",
    arabic_name: "روبية باكستانية",
    symbol: "₨",
    country: "Pakistan",
  },
  {
    code: "PLN",
    name: "Polish Zloty",
    arabic_name: "زلوتي بولندي",
    symbol: "zł",
    country: "Poland",
  },
  {
    code: "PYG",
    name: "Paraguayan Guarani",
    arabic_name: "غواراني باراغوي",
    symbol: "₲",
    country: "Paraguay",
  },
  {
    code: "QAR",
    name: "Qatari Rial",
    arabic_name: "ريال قطري",
    symbol: "ر.ق",
    country: "Qatar",
  },
  {
    code: "RON",
    name: "Romanian Leu",
    arabic_name: "ليو روماني",
    symbol: "lei",
    country: "Romania",
  },
  {
    code: "RSD",
    name: "Serbian Dinar",
    arabic_name: "دينار صربي",
    symbol: "дин.",
    country: "Serbia",
  },
  {
    code: "RUB",
    name: "Russian Ruble",
    arabic_name: "روبل روسي",
    symbol: "₽",
    country: "Russia",
  },
  {
    code: "SAR",
    name: "Saudi Riyal",
    arabic_name: "ريال سعودي",
    symbol: "ر.س",
    country: "Saudi Arabia",
  },
  {
    code: "SEK",
    name: "Swedish Krona",
    arabic_name: "كرونا سويدية",
    symbol: "kr",
    country: "Sweden",
  },
  {
    code: "SGD",
    name: "Singapore Dollar",
    arabic_name: "دولار سنغافوري",
    symbol: "$",
    country: "Singapore",
  },
  {
    code: "THB",
    name: "Thai Baht",
    arabic_name: "بات تايلاندي",
    symbol: "฿",
    country: "Thailand",
  },
  {
    code: "TRY",
    name: "Turkish Lira",
    arabic_name: "ليرة تركية",
    symbol: "₺",
    country: "Turkey",
  },
  {
    code: "TWD",
    name: "New Taiwan Dollar",
    arabic_name: "دولار تايواني جديد",
    symbol: "NT$",
    country: "Taiwan",
  },
  {
    code: "TZS",
    name: "Tanzanian Shilling",
    arabic_name: "شلن تنزاني",
    symbol: "TSh",
    country: "Tanzania",
  },
  {
    code: "UAH",
    name: "Ukrainian Hryvnia",
    arabic_name: "هريفنيا أوكرانية",
    symbol: "₴",
    country: "Ukraine",
  },
  {
    code: "USD",
    name: "United States Dollar",
    arabic_name: "دولار أمريكي",
    symbol: "$",
    country: "United States",
  },
  {
    code: "VEF",
    name: "Venezuelan Bolívar",
    arabic_name: "بوليفار فنزويلي",
    symbol: "Bs.",
    country: "Venezuela",
  },
  {
    code: "VND",
    name: "Vietnamese Dong",
    arabic_name: "دونغ فيتنامي",
    symbol: "₫",
    country: "Vietnam",
  },
  {
    code: "ZAR",
    name: "South African Rand",
    arabic_name: "راند جنوب أفريقي",
    symbol: "R",
    country: "South Africa",
  },
];
