// Car entity class
export class Car {
  constructor({
    id = null,
    brand = '',
    model = '',
    color = '',
    year = null,
    price = null,
    _links = null
  } = {}) {
    this.id = id;
    this.brand = brand;
    this.model = model;
    this.color = color;
    this.year = year;
    this.price = price;
    this._links = _links;
  }

  // Validate car data
  validate() {
    if (!this.brand) throw new Error('Brand is required');
    if (!this.model) throw new Error('Model is required');
    if (!this.year) throw new Error('Year is required');
    if (!this.price) throw new Error('Price is required');
    
    // Validate year
    const currentYear = new Date().getFullYear();
    if (this.year < 1900 || this.year > currentYear + 1) {
      throw new Error('Invalid year');
    }

    // Validate price
    if (this.price < 0) {
      throw new Error('Price must be positive');
    }
  }

  // Convert to API format
  toJSON() {
    return {
      brand: this.brand,
      model: this.model,
      color: this.color,
      year: this.year,
      price: this.price,
    };
  }

  // Create from API response
  static fromJSON(json) {
    return new Car(json);
  }
} 