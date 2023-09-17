import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { HomeResponseDTO } from './dto/home.dto';

@Injectable()
export class HomeService {
  constructor(private readonly prisma: PrismaService) {}
  async getHomes(): Promise<HomeResponseDTO[]> {
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
    });
    return homes.map((home) => {
      const fetchHome = new HomeResponseDTO(home);
      delete fetchHome.images;
      return new HomeResponseDTO(fetchHome);
    });
  }
}
