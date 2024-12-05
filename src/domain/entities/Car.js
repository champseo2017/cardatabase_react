// Car Entity
class Car {
  constructor(brand, model, color, year, price, id = null, links = null) {
    this.brand = brand;
    this.model = model;
    this.color = color;
    this.year = year;
    this.price = price;
    this.id = id;
    this._links = links;
  }

  // Domain methods
  updatePrice(newPrice) {
    if (newPrice <= 0) {
      throw new Error('Price must be greater than 0');
    }
    this.price = newPrice;
  }

  updateColor(newColor) {
    if (!newColor) {
      throw new Error('Color cannot be empty');
    }
    this.color = newColor;
  }

  // Factory method
  static fromDTO(dto) {
    return new Car(
      dto.brand,
      dto.model,
      dto.color,
      dto.year,
      dto.price,
      dto.id,
      dto._links
    );
  }

  // Convert to DTO
  toDTO() {
    return {
      brand: this.brand,
      model: this.model,
      color: this.color,
      year: this.year,
      price: this.price,
      id: this.id,
      _links: this._links
    };
  }
}

export default Car; 