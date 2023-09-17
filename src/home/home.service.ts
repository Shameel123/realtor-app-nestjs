import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { HomeResponseDTO, UpdateHomeDTO } from './dto/home.dto';
import { PropertyType } from '@prisma/client';

interface GetHomesParams {
  city?: string;
  minPrice?: string;
  maxPrice?: string;
  PropertyType?: PropertyType;
}

interface CreateHomeParams {
  address: string;
  city: string;
  price: number;
  propertyType: PropertyType;
  landSize: number;
  images: { url: string }[];
  numberOfBedrooms: number;
  numberOfBathrooms: number;
}

@Injectable()
export class HomeService {
  constructor(private readonly prismaService: PrismaService) {}
  async getHomes(filters: GetHomesParams): Promise<HomeResponseDTO[]> {
    const homes = await this.prismaService.home.findMany({
      select: {
        id: true,
        address: true,
        price: true,
        land_size: true,
        listed_date: true,
        city: true,
        number_of_bathrooms: true,
        number_of_bedrooms: true,
        propertyType: true,
        images: {
          select: {
            url: true,
          },
          take: 1,
        },
        // realtor: {
        //   select: {
        //     id: true,
        //     name: true,
        //     email: true,
        //     phone: true,
        //   },
        // },
      },
      where: filters,
    });

    if (!homes.length) {
      throw new NotFoundException('No homes found');
    }
    return homes.map((home) => {
      const fetchHome = new HomeResponseDTO(home);
      delete fetchHome.images;
      return new HomeResponseDTO(fetchHome);
    });
  }

  async getHomeById(id: number): Promise<HomeResponseDTO> {
    const home = await this.prismaService.home.findUnique({
      where: { id },
      select: {
        id: true,
        address: true,
        price: true,
        land_size: true,
        listed_date: true,
        city: true,
        number_of_bathrooms: true,
        number_of_bedrooms: true,
        propertyType: true,
        images: {
          select: {
            url: true,
          },
        },
        realtor: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });
    if (!home) {
      throw new NotFoundException('No home found');
    }
    delete home.realtor;
    return new HomeResponseDTO(home);
  }

  async createHome(
    {
      address,
      numberOfBathrooms,
      numberOfBedrooms,
      city,
      landSize,
      propertyType,
      price,
      images,
    }: CreateHomeParams,
    userId: number,
  ) {
    console.log({ userId });
    const home = await this.prismaService.home.create({
      data: {
        address,
        number_of_bathrooms: numberOfBathrooms,
        number_of_bedrooms: numberOfBedrooms,
        city,
        land_size: landSize,
        propertyType,
        price,
        realtor_id: userId,
      },
    });
    const homeImages = images.map((image) => {
      return { ...image, homeId: home.id };
    });
    await this.prismaService.image.createMany({
      data: homeImages,
    });

    return new HomeResponseDTO(home);
  }

  async updateHome(
    id: number,
    {
      address,
      numberOfBathrooms,
      numberOfBedrooms,
      city,
      landSize,
      propertyType,
      price,
    }: UpdateHomeDTO,
    userId: number,
  ) {
    const home = await this.prismaService.home.findUnique({
      where: { id },
    });
    if (!home) {
      throw new NotFoundException('No home found');
    }
    const doesUserOwnHome = home.realtor_id === userId;

    if (!doesUserOwnHome) {
      throw new NotFoundException('You are not authorized to update this home');
    }

    const updatedHome = await this.prismaService.home.update({
      where: { id },
      data: {
        address,
        number_of_bathrooms: numberOfBathrooms,
        number_of_bedrooms: numberOfBedrooms,
        city,
        land_size: landSize,
        propertyType,
        price,
        realtor_id: userId,
      },
    });
    return new HomeResponseDTO(updatedHome);
  }

  async deleteHome(id: number) {
    const home = await this.prismaService.home.findUnique({
      where: { id },
    });
    if (!home) {
      throw new NotFoundException('No home found');
    }

    await this.prismaService.image.deleteMany({
      where: { homeId: id },
    });

    await this.prismaService.home.delete({
      where: { id },
    });
    return { message: 'Home deleted successfully' };
  }
}
