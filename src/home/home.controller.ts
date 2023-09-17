import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { HomeService } from './home.service';
import { CreateHomeDTO, HomeResponseDTO, UpdateHomeDTO } from './dto/home.dto';
import { PropertyType } from '@prisma/client';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get()
  getHomes(
    @Query('city') city?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('PropertyType') PropertyType?: PropertyType,
  ): Promise<HomeResponseDTO[]> {
    const price =
      minPrice || maxPrice
        ? {
            ...(minPrice && { gte: parseFloat(minPrice) }),
            ...(maxPrice && { lte: parseFloat(maxPrice) }),
          }
        : undefined;

    const filters = {
      ...(city && { city }),
      ...(PropertyType && { propertyType: PropertyType }),
      ...(price && { price }),
    };
    return this.homeService.getHomes(filters);
  }

  @Get(':id')
  getHomeId(@Param('id', ParseIntPipe) id: number) {
    return this.homeService.getHomeById(id);
  }

  @Post()
  postHome(@Body() body: CreateHomeDTO) {
    return this.homeService.createHome(body);
  }

  @Put(':id')
  putHomeId(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateHomeDTO,
  ) {
    return this.homeService.updateHome(id, body);
  }

  @Delete(':id')
  deleteHomeId(@Param('id', ParseIntPipe) id: number) {
    return this.homeService.deleteHome(id);
  }
}
