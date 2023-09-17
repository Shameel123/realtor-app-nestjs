import { PropertyType } from '@prisma/client';
import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';

class Image {
  url: string;
}

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

export class CreateHomeDTO {
  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsEnum(PropertyType)
  propertyType: PropertyType;

  @IsNumber()
  @IsPositive()
  landSize: number;

  @IsArray()
  @ValidateNested({ each: true })
  images: Image[];

  @IsNumber()
  @IsPositive()
  numberOfBedrooms: number;

  @IsNumber()
  @IsPositive()
  numberOfBathrooms: number;
}

export class UpdateHomeDTO {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  address?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  city?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  price?: number;

  @IsOptional()
  @IsEnum(PropertyType)
  propertyType: PropertyType;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  landSize?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  numberOfBedrooms?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  numberOfBathrooms?: number;
}

export class HomeInquiryDTO {
  @IsString()
  @IsNotEmpty()
  message: string;
}
