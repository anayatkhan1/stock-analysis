
export const globalMarketOverview = {
  lastUpdated: "May 15, 2024 16:30 EDT",
  tradingDay: "Regular Trading Day",
  featuredMarkets: [
    {
      region: "United States",
      index: "S&P 500",
      value: "5,234.56",
      change: "+0.75%",
      changeValue: "+38.92",
      isPositive: true,
      status: "open",
      color: "blue"
    },
    {
      region: "Europe",
      index: "STOXX 600",
      value: "507.32",
      change: "+0.42%",
      changeValue: "+2.11",
      isPositive: true,
      status: "closed",
      color: "indigo"
    },
    {
      region: "Asia",
      index: "Nikkei 225",
      value: "38,467.25",
      change: "-0.28%",
      changeValue: "-109.11",
      isPositive: false,
      status: "closed",
      color: "purple"
    },
    {
      region: "Emerging Markets",
      index: "MSCI EM",
      value: "1,078.45",
      change: "+0.63%",
      changeValue: "+6.75",
      isPositive: true,
      status: "active",
      color: "emerald"
    }
  ]
};

// Global Market Indices
export const globalMarketIndices = {
  americas: [
    {
      name: "S&P 500",
      description: "US Large Cap",
      value: "5,234.56",
      change: "+0.75%",
      isPositive: true,
      country: "United States"
    },
    {
      name: "Dow Jones",
      description: "US Blue Chip",
      value: "38,765.43",
      change: "+0.62%",
      isPositive: true,
      country: "United States"
    },
    {
      name: "Nasdaq",
      description: "US Tech",
      value: "16,432.10",
      change: "+1.23%",
      isPositive: true,
      country: "United States"
    },
    {
      name: "Russell 2000",
      description: "US Small Cap",
      value: "2,123.45",
      change: "-0.32%",
      isPositive: false,
      country: "United States"
    },
    {
      name: "S&P/TSX",
      description: "Canada Composite",
      value: "21,876.54",
      change: "+0.45%",
      isPositive: true,
      country: "Canada"
    },
    {
      name: "IPC",
      description: "Mexico",
      value: "56,789.01",
      change: "+0.38%",
      isPositive: true,
      country: "Mexico"
    },
    {
      name: "Bovespa",
      description: "Brazil",
      value: "127,654.32",
      change: "-0.56%",
      isPositive: false,
      country: "Brazil"
    },
    {
      name: "IPSA",
      description: "Chile",
      value: "6,543.21",
      change: "-0.21%",
      isPositive: false,
      country: "Chile"
    }
  ],
  europe: [
    {
      name: "FTSE 100",
      description: "UK",
      value: "7,876.54",
      change: "+0.32%",
      isPositive: true,
      country: "United Kingdom"
    },
    {
      name: "DAX",
      description: "Germany",
      value: "18,432.10",
      change: "+0.54%",
      isPositive: true,
      country: "Germany"
    },
    {
      name: "CAC 40",
      description: "France",
      value: "8,123.45",
      change: "+0.41%",
      isPositive: true,
      country: "France"
    },
    {
      name: "IBEX 35",
      description: "Spain",
      value: "10,765.43",
      change: "-0.22%",
      isPositive: false,
      country: "Spain"
    },
    {
      name: "FTSE MIB",
      description: "Italy",
      value: "33,456.78",
      change: "+0.18%",
      isPositive: true,
      country: "Italy"
    },
    {
      name: "SMI",
      description: "Switzerland",
      value: "11,987.65",
      change: "+0.27%",
      isPositive: true,
      country: "Switzerland"
    },
    {
      name: "AEX",
      description: "Netherlands",
      value: "876.54",
      change: "+0.35%",
      isPositive: true,
      country: "Netherlands"
    },
    {
      name: "BEL 20",
      description: "Belgium",
      value: "4,321.09",
      change: "-0.15%",
      isPositive: false,
      country: "Belgium"
    },
    {
      name: "MOEX",
      description: "Russia",
      value: "3,456.78",
      change: "-0.42%",
      isPositive: false,
      country: "Russia"
    },
    {
      name: "WIG20",
      description: "Poland",
      value: "2,345.67",
      change: "+0.23%",
      isPositive: true,
      country: "Poland"
    }
  ],
  asia: [
    {
      name: "Nikkei 225",
      description: "Japan",
      value: "38,467.25",
      change: "-0.28%",
      isPositive: false,
      country: "Japan"
    },
    {
      name: "Shanghai Composite",
      description: "China",
      value: "3,234.56",
      change: "+0.65%",
      isPositive: true,
      country: "China"
    },
    {
      name: "Hang Seng",
      description: "Hong Kong",
      value: "19,876.54",
      change: "+0.87%",
      isPositive: true,
      country: "Hong Kong"
    },
    {
      name: "KOSPI",
      description: "South Korea",
      value: "2,765.43",
      change: "-0.12%",
      isPositive: false,
      country: "South Korea"
    },
    {
      name: "ASX 200",
      description: "Australia",
      value: "7,654.32",
      change: "+0.43%",
      isPositive: true,
      country: "Australia"
    },
    {
      name: "Sensex",
      description: "India",
      value: "72,345.67",
      change: "+1.05%",
      isPositive: true,
      country: "India"
    },
    {
      name: "Straits Times",
      description: "Singapore",
      value: "3,456.78",
      change: "+0.21%",
      isPositive: true,
      country: "Singapore"
    },
    {
      name: "TAIEX",
      description: "Taiwan",
      value: "20,123.45",
      change: "+1.32%",
      isPositive: true,
      country: "Taiwan"
    },
    {
      name: "FTSE Bursa Malaysia",
      description: "Malaysia",
      value: "1,543.21",
      change: "-0.18%",
      isPositive: false,
      country: "Malaysia"
    },
    {
      name: "SET",
      description: "Thailand",
      value: "1,432.10",
      change: "-0.25%",
      isPositive: false,
      country: "Thailand"
    }
  ]
};

// Global Currencies
export const globalCurrencies = {
  majorPairs: [
    {
      name: "EUR/USD",
      base: "Euro",
      quote: "US Dollar",
      rate: "1.0876",
      change: "+0.32%",
      isPositive: true
    },
    {
      name: "USD/JPY",
      base: "US Dollar",
      quote: "Japanese Yen",
      rate: "154.32",
      change: "+0.45%",
      isPositive: true
    },
    {
      name: "GBP/USD",
      base: "British Pound",
      quote: "US Dollar",
      rate: "1.2654",
      change: "-0.18%",
      isPositive: false
    },
    {
      name: "USD/CHF",
      base: "US Dollar",
      quote: "Swiss Franc",
      rate: "0.9032",
      change: "+0.21%",
      isPositive: true
    },
    {
      name: "AUD/USD",
      base: "Australian Dollar",
      quote: "US Dollar",
      rate: "0.6587",
      change: "-0.35%",
      isPositive: false
    },
    {
      name: "USD/CAD",
      base: "US Dollar",
      quote: "Canadian Dollar",
      rate: "1.3654",
      change: "+0.28%",
      isPositive: true
    },
    {
      name: "NZD/USD",
      base: "New Zealand Dollar",
      quote: "US Dollar",
      rate: "0.6123",
      change: "-0.42%",
      isPositive: false
    }
  ],
  emergingPairs: [
    {
      name: "USD/CNY",
      base: "US Dollar",
      quote: "Chinese Yuan",
      rate: "7.2345",
      change: "+0.15%",
      isPositive: true
    },
    {
      name: "USD/INR",
      base: "US Dollar",
      quote: "Indian Rupee",
      rate: "83.4567",
      change: "+0.32%",
      isPositive: true
    },
    {
      name: "USD/BRL",
      base: "US Dollar",
      quote: "Brazilian Real",
      rate: "5.1234",
      change: "-0.28%",
      isPositive: false
    },
    {
      name: "USD/RUB",
      base: "US Dollar",
      quote: "Russian Ruble",
      rate: "92.3456",
      change: "+0.65%",
      isPositive: true
    },
    {
      name: "USD/MXN",
      base: "US Dollar",
      quote: "Mexican Peso",
      rate: "16.7890",
      change: "-0.42%",
      isPositive: false
    },
    {
      name: "USD/ZAR",
      base: "US Dollar",
      quote: "South African Rand",
      rate: "18.5678",
      change: "+0.38%",
      isPositive: true
    },
    {
      name: "USD/TRY",
      base: "US Dollar",
      quote: "Turkish Lira",
      rate: "32.1098",
      change: "+0.87%",
      isPositive: true
    }
  ],
  exoticPairs: [
    {
      name: "USD/SGD",
      base: "US Dollar",
      quote: "Singapore Dollar",
      rate: "1.3456",
      change: "-0.12%",
      isPositive: false
    },
    {
      name: "USD/HKD",
      base: "US Dollar",
      quote: "Hong Kong Dollar",
      rate: "7.8123",
      change: "+0.05%",
      isPositive: true
    },
    {
      name: "USD/SEK",
      base: "US Dollar",
      quote: "Swedish Krona",
      rate: "10.4567",
      change: "+0.28%",
      isPositive: true
    },
    {
      name: "USD/NOK",
      base: "US Dollar",
      quote: "Norwegian Krone",
      rate: "10.7890",
      change: "-0.18%",
      isPositive: false
    },
    {
      name: "USD/DKK",
      base: "US Dollar",
      quote: "Danish Krone",
      rate: "6.8765",
      change: "+0.21%",
      isPositive: true
    },
    {
      name: "USD/PLN",
      base: "US Dollar",
      quote: "Polish Zloty",
      rate: "3.9876",
      change: "-0.32%",
      isPositive: false
    },
    {
      name: "USD/THB",
      base: "US Dollar",
      quote: "Thai Baht",
      rate: "35.6789",
      change: "+0.45%",
      isPositive: true
    }
  ]
};