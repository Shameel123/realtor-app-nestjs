import { PropertyType } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

export class HomeResponseDTO {
  id: number;
  address: string;
  city: string;
  price: number;
  propertyType: PropertyType;
  image: string;

  @Exclude()
  number_of_bedrooms: number;
  @Exclude()
  number_of_bathrooms: number;
  @Exclude()
  listed_date: Date;
  @Exclude()
  land_size: number;
  @Exclude()
  realtor_id: number;
  @Exclude()
  createdAt: Date;
  @Exclude()
  updatedAt: Date;
  images: any;

  @Expose({ name: 'numberOfBedrooms' })
  getNumberOfBedrooms(): number {
    return this.number_of_bedrooms;
  }

  @Expose({ name: 'numberOfBathrooms' })
  getNumberOfBathrooms(): number {
    return this.number_of_bathrooms;
  }

  @Expose({ name: 'listedDate' })
  getListedDate(): Date {
    return this.listed_date;
  }

  @Expose({ name: 'landSize' })
  getLandSize(): number {
    return this.land_size;
  }

  constructor(partial: Partial<HomeResponseDTO>) {
    Object.assign(this, partial);
  }
}
