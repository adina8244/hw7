class Cars {
  constructor(data) {
      this.company = data.company;
      this.model = data.model;
      this.year = data.year;
      this.color = data.color;
      this.category = data.category;
      this.img = data.img;
      this.description = data.description;
      this.available = data.available;
      this.rentalDate = null;
  }

  searchByStr(str) {
      const searchStr = str.toLowerCase().split(" ");
      return searchStr.every(term =>
          this.company.toLowerCase().includes(term) ||
          this.model.toLowerCase().includes(term) ||
          this.year.toString().includes(term) ||
          this.color.toLowerCase().includes(term) ||
          this.category.toLowerCase().includes(term)
      );
  }
}

class ElectricCar extends Cars {
  constructor(data) {
      super(data);
      this.batteryLife = data.batteryLife;
  }
}