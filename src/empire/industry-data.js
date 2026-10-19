// Owner-approved 18 October 2026. Literal prices are frozen; recipes retain original inputs.
import {DOLLAR,MG} from './data.js';
const rows=[
  {
    "id": "F01",
    "name": "Copper Wire Bundle",
    "copper": "500000000000000",
    "fee": "70000000000000000000",
    "seconds": 45,
    "reference": "615000000000000000000",
    "originalReference": "450000000000000000000",
    "volume": 1,
    "tier": 1,
    "game": 2001,
    "tags": [
      "wiring",
      "cables"
    ],
    "manualRequired": 5
  },
  {
    "id": "F02",
    "name": "Industrial Copper Cable",
    "copper": "1000000000000000",
    "fee": "150000000000000000000",
    "seconds": 60,
    "reference": "1265000000000000000000",
    "originalReference": "950000000000000000000",
    "volume": 1,
    "tier": 1,
    "game": 2002,
    "tags": [
      "cables",
      "advanced-cables"
    ],
    "manualRequired": 5
  },
  {
    "id": "F03",
    "name": "Copper Plumbing Pipe Set",
    "copper": "1500000000000000",
    "fee": "230000000000000000000",
    "seconds": 75,
    "reference": "1860000000000000000000",
    "originalReference": "1450000000000000000000",
    "volume": 1,
    "tier": 1,
    "game": 2003,
    "tags": [
      "infrastructure"
    ],
    "manualRequired": 5
  },
  {
    "id": "F04",
    "name": "Copper Sheet Pallet",
    "copper": "2000000000000000",
    "fee": "320000000000000000000",
    "seconds": 90,
    "reference": "2492000000000000000000",
    "originalReference": "2000000000000000000000",
    "volume": 1,
    "tier": 1,
    "game": 2004,
    "tags": [
      "industrial-equipment"
    ],
    "manualRequired": 5
  },
  {
    "id": "F05",
    "name": "Copper Cooling Tube Assembly",
    "copper": "3000000000000000",
    "fee": "500000000000000000000",
    "seconds": 105,
    "reference": "4217000000000000000000",
    "originalReference": "3100000000000000000000",
    "volume": 1,
    "tier": 1,
    "game": 2005,
    "tags": [
      "cooling"
    ],
    "manualRequired": 5
  },
  {
    "id": "F06",
    "name": "Electric Motor Winding Set",
    "copper": "4000000000000000",
    "fee": "700000000000000000000",
    "seconds": 120,
    "reference": "5456000000000000000000",
    "originalReference": "4200000000000000000000",
    "volume": 2,
    "tier": 2,
    "game": 2006,
    "tags": [
      "motors"
    ],
    "manualRequired": 8
  },
  {
    "id": "F07",
    "name": "Transformer Coil Assembly",
    "copper": "5000000000000000",
    "fee": "900000000000000000000",
    "seconds": 140,
    "reference": "6845000000000000000000",
    "originalReference": "5300000000000000000000",
    "volume": 2,
    "tier": 2,
    "game": 2007,
    "tags": [
      "transformers"
    ],
    "manualRequired": 8
  },
  {
    "id": "F08",
    "name": "Industrial Wiring Harness",
    "copper": "7000000000000000",
    "fee": "1300000000000000000000",
    "seconds": 160,
    "reference": "9978000000000000000000",
    "originalReference": "7500000000000000000000",
    "volume": 2,
    "tier": 2,
    "game": 2008,
    "tags": [
      "wiring",
      "electronics"
    ],
    "manualRequired": 8
  },
  {
    "id": "F09",
    "name": "Generator Stator Winding",
    "copper": "10000000000000000",
    "fee": "1900000000000000000000",
    "seconds": 180,
    "reference": "14298000000000000000000",
    "originalReference": "10800000000000000000000",
    "volume": 2,
    "tier": 2,
    "game": 2009,
    "tags": [
      "generators",
      "motors"
    ],
    "manualRequired": 8
  },
  {
    "id": "F10",
    "name": "Copper Heat Exchanger",
    "copper": "15000000000000000",
    "fee": "3000000000000000000000",
    "seconds": 210,
    "reference": "22148000000000000000000",
    "originalReference": "16500000000000000000000",
    "volume": 2,
    "tier": 2,
    "game": 2010,
    "tags": [
      "cooling"
    ],
    "manualRequired": 8
  },
  {
    "id": "F11",
    "name": "Precision Copper Connector Kit",
    "copper": "20000000000000000",
    "fee": "4000000000000000000000",
    "seconds": 240,
    "reference": "33823000000000000000000",
    "originalReference": "22000000000000000000000",
    "volume": 3,
    "tier": 3,
    "game": 2011,
    "tags": [
      "precision",
      "electronics"
    ],
    "manualRequired": 12
  },
  {
    "id": "F12",
    "name": "Power Distribution Busbar Set",
    "copper": "30000000000000000",
    "fee": "6000000000000000000000",
    "seconds": 270,
    "reference": "40255000000000000000000",
    "originalReference": "33000000000000000000000",
    "volume": 3,
    "tier": 3,
    "game": 2012,
    "tags": [
      "distribution",
      "power-grid"
    ],
    "manualRequired": 12
  },
  {
    "id": "F13",
    "name": "Industrial Cooling Module",
    "copper": "50000000000000000",
    "fee": "10000000000000000000000",
    "seconds": 300,
    "reference": "78818000000000000000000",
    "originalReference": "56000000000000000000000",
    "volume": 3,
    "tier": 3,
    "game": 2013,
    "tags": [
      "cooling",
      "electronics"
    ],
    "manualRequired": 12
  },
  {
    "id": "F14",
    "name": "High-Voltage Cable Assembly",
    "copper": "75000000000000000",
    "fee": "16000000000000000000000",
    "seconds": 330,
    "reference": "105190000000000000000000",
    "originalReference": "86000000000000000000000",
    "volume": 3,
    "tier": 3,
    "game": 2014,
    "tags": [
      "advanced-cables",
      "cables"
    ],
    "manualRequired": 12
  },
  {
    "id": "F15",
    "name": "Industrial Generator Module",
    "copper": "100000000000000000",
    "fee": "22000000000000000000000",
    "seconds": 360,
    "reference": "149807000000000000000000",
    "originalReference": "115000000000000000000000",
    "volume": 3,
    "tier": 3,
    "game": 2015,
    "tags": [
      "generators",
      "heavy-machines"
    ],
    "manualRequired": 12
  },
  {
    "id": "F16",
    "name": "Heavy Transformer Assembly",
    "copper": "150000000000000000",
    "fee": "35000000000000000000000",
    "seconds": 420,
    "reference": "221259000000000000000000",
    "originalReference": "175000000000000000000000",
    "volume": 5,
    "tier": 4,
    "game": 2016,
    "tags": [
      "transformers",
      "heavy-machines"
    ],
    "manualRequired": 16
  },
  {
    "id": "F17",
    "name": "Advanced Power Grid Module",
    "copper": "250000000000000000",
    "fee": "60000000000000000000000",
    "seconds": 480,
    "reference": "379839000000000000000000",
    "originalReference": "295000000000000000000000",
    "volume": 5,
    "tier": 4,
    "game": 2017,
    "tags": [
      "power-grid",
      "advanced-power",
      "controls"
    ],
    "manualRequired": 16
  },
  {
    "id": "F18",
    "name": "Industrial Motor System",
    "copper": "400000000000000000",
    "fee": "100000000000000000000000",
    "seconds": 540,
    "reference": "627861000000000000000000",
    "originalReference": "480000000000000000000000",
    "volume": 5,
    "tier": 4,
    "game": 2018,
    "tags": [
      "motors",
      "heavy-machines"
    ],
    "manualRequired": 16
  },
  {
    "id": "F19",
    "name": "Gigawatt Electrical Converter",
    "copper": "650000000000000000",
    "fee": "170000000000000000000000",
    "seconds": 600,
    "reference": "1115119000000000000000000",
    "originalReference": "800000000000000000000000",
    "volume": 5,
    "tier": 4,
    "game": 2019,
    "tags": [
      "advanced-power",
      "electronics"
    ],
    "manualRequired": 16
  },
  {
    "id": "F20",
    "name": "Integrated Power Distribution Station",
    "copper": "1000000000000000000",
    "fee": "270000000000000000000000",
    "seconds": 660,
    "reference": "1655923000000000000000000",
    "originalReference": "1250000000000000000000000",
    "volume": 5,
    "tier": 4,
    "game": 2020,
    "tags": [
      "power-grid",
      "distribution",
      "infrastructure"
    ],
    "manualRequired": 16
  },
  {
    "id": "F21",
    "name": "Modular Generator Complex",
    "copper": "2000000000000000000",
    "fee": "550000000000000000000000",
    "seconds": 720,
    "reference": "3323372000000000000000000",
    "originalReference": "2550000000000000000000000",
    "volume": 10,
    "tier": 5,
    "game": 2021,
    "tags": [
      "generators",
      "industrial-equipment"
    ],
    "manualRequired": 20
  },
  {
    "id": "F22",
    "name": "Continental Power Grid Assembly",
    "copper": "4000000000000000000",
    "fee": "1100000000000000000000000",
    "seconds": 780,
    "reference": "6926462000000000000000000",
    "originalReference": "5200000000000000000000000",
    "volume": 10,
    "tier": 5,
    "game": 2022,
    "tags": [
      "power-grid",
      "infrastructure"
    ],
    "manualRequired": 20
  },
  {
    "id": "F23",
    "name": "Automated Industrial Megaplant",
    "copper": "8000000000000000000",
    "fee": "2300000000000000000000000",
    "seconds": 840,
    "reference": "14375601000000000000000000",
    "originalReference": "10600000000000000000000000",
    "volume": 10,
    "tier": 5,
    "game": 2023,
    "tags": [
      "industrial-equipment",
      "controls"
    ],
    "manualRequired": 20
  },
  {
    "id": "F24",
    "name": "Global Copper Infrastructure System",
    "copper": "15000000000000000000",
    "fee": "4500000000000000000000000",
    "seconds": 900,
    "reference": "27992719000000000000000000",
    "originalReference": "20500000000000000000000000",
    "volume": 10,
    "tier": 5,
    "game": 2024,
    "tags": [
      "infrastructure",
      "advanced-power"
    ],
    "manualRequired": 20
  },
  {
    "id": "F25",
    "name": "Copper Empire Industrial Power Complex",
    "copper": "30000000000000000000",
    "fee": "9000000000000000000000000",
    "seconds": 1020,
    "reference": "58599383000000000000000000",
    "originalReference": "42000000000000000000000000",
    "volume": 10,
    "tier": 5,
    "game": 2025,
    "tags": [
      "generators",
      "industrial-equipment",
      "advanced-power"
    ],
    "manualRequired": 20
  }
];
export const PRODUCTS=rows.map(p=>({...p,copper:BigInt(p.copper),fee:BigInt(p.fee),reference:BigInt(p.reference),originalReference:BigInt(p.originalReference)}));
export const productById=id=>PRODUCTS.find(p=>p.id===id);
export const APPROVED_ECONOMY_VERSION='2026-10-18-approved';
