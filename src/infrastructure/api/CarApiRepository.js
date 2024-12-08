import { Car } from '@domain/entities/Car';
import { CarRepository } from '@domain/repositories/CarRepository';

class CarApiRepository extends CarRepository {
  constructor(baseUrl = 'http://localhost:8080/api') {
    super();
    this.baseUrl = baseUrl;
  }

  async findAll() {
    try {
      const response = await fetch(`${this.baseUrl}/cars`);
      const data = await response.json();
      return data._embedded.cars.map(carData => Car.fromJSON(carData));
    } catch (error) {
      console.error('Error fetching cars:', error);
      throw error;
    }
  }

  async findById(id) {
    try {
      const response = await fetch(`${this.baseUrl}/cars/${id}`);
      const data = await response.json();
      return Car.fromJSON(data);
    } catch (error) {
      console.error(`Error fetching car with id ${id}:`, error);
      throw error;
    }
  }

  async save(car) {
    try {
      const response = await fetch(`${this.baseUrl}/cars`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(car.toJSON()),
      });
      const data = await response.json();
      return Car.fromJSON(data);
    } catch (error) {
      console.error('Error saving car:', error);
      throw error;
    }
  }

  async update(id, car) {
    try {
      const response = await fetch(`${this.baseUrl}/cars/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(car.toJSON()),
      });
      const data = await response.json();
      return Car.fromJSON(data);
    } catch (error) {
      console.error(`Error updating car with id ${id}:`, error);
      throw error;
    }
  }

  async delete(id) {
    try {
      await fetch(`${this.baseUrl}/cars/${id}`, {
        method: 'DELETE',
      });
      return true;
    } catch (error) {
      console.error(`Error deleting car with id ${id}:`, error);
      throw error;
    }
  }
}

export { CarApiRepository };
