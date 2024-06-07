const close: Array<number> = [];
const open: Array<number> = [];
const high: Array<number> = [];
const low: Array<number> = [];
const volume: Array<number> = [];
const timestamp: Array<number> = [];
const candlesticks: {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}[] = [
  {
    timestamp: 1028173500,
    open: 118.875,
    high: 130,
    low: 117.15,
    close: 127.75,
    volume: 60577000,
  },
  {
    timestamp: 1030938300,
    open: 130,
    high: 135.475005,
    low: 126,
    close: 129.024995,
    volume: 89946800,
  },
  {
    timestamp: 1033443900,
    open: 128.050005,
    high: 134.699995,
    low: 109.025,
    close: 132.75,
    volume: 167726600,
  },
  {
    timestamp: 1036122300,
    open: 132.899995,
    high: 147.899995,
    low: 125.875,
    close: 145.399995,
    volume: 289632000,
  },
  {
    timestamp: 1038800700,
    open: 144.949995,
    high: 153.199995,
    low: 141.100005,
    close: 148.975005,
    volume: 232001400,
  },
  {
    timestamp: 1041392700,
    open: 150.399995,
    high: 155,
    low: 131.649995,
    close: 137.524995,
    volume: 178826400,
  },
  {
    timestamp: 1044243900,
    open: 141,
    high: 151.875,
    low: 138.274995,
    close: 147.375,
    volume: 148041200,
  },
  {
    timestamp: 1046663100,
    open: 147.5,
    high: 150.600005,
    low: 137.050005,
    close: 139.050005,
    volume: 133674800,
  },
  {
    timestamp: 1049168700,
    open: 138,
    high: 151,
    low: 132.375,
    close: 137.225005,
    volume: 172278600,
  },
  {
    timestamp: 1051760700,
    open: 137.225005,
    high: 151,
    low: 128.574995,
    close: 149.300005,
    volume: 131019400,
  },
  {
    timestamp: 1054525500,
    open: 149.5,
    high: 168.875,
    low: 145.625,
    close: 162.449995,
    volume: 245337000,
  },
  {
    timestamp: 1057031100,
    open: 163.024995,
    high: 180.925005,
    low: 161.625,
    close: 178.949995,
    volume: 270529200,
  },
  {
    timestamp: 1059709500,
    open: 179.850005,
    high: 212.350005,
    low: 171.800005,
    close: 200.350005,
    volume: 236635600,
  },
  {
    timestamp: 1062387900,
    open: 199.125,
    high: 255,
    low: 196,
    close: 221.899995,
    volume: 324700800,
  },
  {
    timestamp: 1064979900,
    open: 220.5,
    high: 248.949995,
    low: 211.25,
    close: 243.225005,
    volume: 258226400,
  },
  {
    timestamp: 1067831100,
    open: 243.475005,
    high: 255,
    low: 223.100005,
    close: 243.524995,
    volume: 204663600,
  },
  {
    timestamp: 1070250300,
    open: 245.050005,
    high: 291.399995,
    low: 217.5,
    close: 286.42499,
    volume: 313141400,
  },
  {
    timestamp: 1072928700,
    open: 290,
    high: 302.95001,
    low: 263.625,
    close: 280.274995,
    volume: 298956800,
  },
];
candlesticks.forEach((item) => {
  close.push(item.close);
  open.push(item.open);
  high.push(item.high);
  low.push(item.low);
  volume.push(item.volume);
  timestamp.push(item.timestamp);
});
export const data = {
  close,
  open,
  high,
  low,
  volume,
  timestamp,
  candlesticks,
};
