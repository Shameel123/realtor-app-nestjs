import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { HomeResponseDTO } from './dto/home.dto';
import { PropertyType } from '@prisma/client';

interface GetHomesParams {
  city?: string;
  minPrice?: string;
  maxPrice?: string;
  PropertyType?: PropertyType;
}

@Injectable()
export class HomeService {
  constructor(private readonly prisma: PrismaService) {}
  async getHomes(filters: GetHomesParams): Promise<HomeResponseDTO[]> {
    const homes = await this.prisma.home.findMany({
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
    const home = await this.prisma.home.findUnique({
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
}
