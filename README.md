# Your Library Name

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/dotranminhchu/financial-indicator/blob/master/LICENSE)
[![npm version](https://badge.fury.io/js/financial-indicator.svg)](https://badge.fury.io/js/financial-indicator)

A brief introduction to your library and what it does.

## Installation

You can install the library via npm:

```bash
npm install financial-indicator
```

## Usage

Here's how you can use the library in your projects:

```typescript
import { EMA } from "financial-indicator";

// Example usage of SomeFunction
const result = EMA.calculate({ period: 14, values: closes });
console.log(result);
```

### Example

```typescript
import { ADX } from "financial-indicator";

const result = ADX.calculate({
  adxPeriod: 10,
  diPeriod: 14,
  close: closes,
  low: lows,
  high: highs,
});
console.log(result);
```

## Documentation

You can find the detailed documentation [here](link/to/documentation).

## Contributing

Contributions are welcome! Please check the [Contribution Guidelines](link/to/contribution/guidelines).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
