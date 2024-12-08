import { carApi } from '@infrastructure/api/carApi';

// Car service class for business logic
export class CarService {
  constructor() {
    this.api = carApi;
  }

  // Get all cars
  async getAllCars() {
    return this.api.getAllCars();
  }

  // Get car by ID
  async getCarById(id) {
    return this.api.getCarById(id);
  }

  // Search cars by filters
  async searchCars(filters) {
    return this.api.searchCars(filters);
  }

  // Add new car
  async addCar(carData) {
    return this.api.addCar(carData);
  }

  // Update car
  async updateCar(id, carData) {
    return this.api.updateCar(id, carData);
  }

  // Delete car
  async deleteCar(id) {
    return this.api.deleteCar(id);
  }
} 