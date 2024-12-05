import Car from '@domain/entities/Car';

class CarService {
  constructor(carRepository) {
    this.carRepository = carRepository;
  }

  async getAllCars() {
    return await this.carRepository.findAll();
  }

  async getCarById(id) {
    return await this.carRepository.findById(id);
  }

  async createCar(carData) {
    const car = new Car(
      carData.brand,
      carData.model,
      carData.color,
      carData.year,
      carData.price
    );
    return await this.carRepository.save(car);
  }

  async updateCar(id, carData) {
    const car = new Car(
      carData.brand,
      carData.model,
      carData.color,
      carData.year,
      carData.price,
      id
    );
    return await this.carRepository.update(id, car);
  }

  async deleteCar(id) {
    return await this.carRepository.delete(id);
  }
}

export default CarService; 