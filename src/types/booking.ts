export interface Booking {
    _id: string;
    start: {
      latitude: number;
      longitude: number;
    };
    end: {
      latitude: number;
      longitude: number;
    };
    user: {
      _id: string;
      name: string;
      phoneNo: string;
    };
    status: string;
    date: string;
    time: string;
    fare: number;
    type: string;
    model: string;
    createdAt: string;
    updatedAt: string;
    driver: {
      _id: string;
      name: string;
      phone: string;
      carNumber: string;
      drivingLicense: string;
      aadhaarCard: string;
      employmentType: string;
      carType: string;
      carModel: string;
      carYear: number;
      status: boolean;
      createdAt: string;
      updatedAt: string;
    };
  }