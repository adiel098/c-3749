export interface CountryCode {
  country: string;
  code: string;
  flag: string;
}

export const countryCodes: CountryCode[] = [
  { country: "Israel", code: "+972", flag: "🇮🇱" },
  { country: "United States", code: "+1", flag: "🇺🇸" },
  { country: "United Kingdom", code: "+44", flag: "🇬🇧" },
  { country: "France", code: "+33", flag: "🇫🇷" },
  { country: "Germany", code: "+49", flag: "🇩🇪" },
  { country: "Italy", code: "+39", flag: "🇮🇹" },
  { country: "Spain", code: "+34", flag: "🇪🇸" },
  { country: "Russia", code: "+7", flag: "🇷🇺" },
  { country: "China", code: "+86", flag: "🇨🇳" },
  { country: "Japan", code: "+81", flag: "🇯🇵" },
];