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
  UnauthorizedException,
} from '@nestjs/common';
import { HomeService } from './home.service';
import {
  CreateHomeDTO,
  HomeInquiryDTO,
  HomeResponseDTO,
  UpdateHomeDTO,
} from './dto/home.dto';
import { PropertyType, UserType } from '@prisma/client';
import { User, UserDecodedTokenType } from 'src/user/decorators/user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { Roles } from 'src/decorators/roles.decorators';

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

  @Roles(UserType.BUYER)
  @Post()
  postHome(@Body() body: CreateHomeDTO, @User() user: UserDecodedTokenType) {
    return this.homeService.createHome(body, user.id);
  }

  @Roles(UserType.REALTOR, UserType.ADMIN)
  @Put(':id')
  putHomeId(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateHomeDTO,
    @User() user: UserDecodedTokenType,
  ) {
    return this.homeService.updateHome(id, body, user?.id);
  }

  @Roles(UserType.REALTOR, UserType.ADMIN)
  @Delete(':id')
  deleteHomeId(@Param('id', ParseIntPipe) id: number) {
    return this.homeService.deleteHome(id);
  }

  @Roles(UserType.BUYER)
  @Post('/inquire/:id')
  inquireHome(
    @Param('id', ParseIntPipe) homeId: number,
    @User() user: UserDecodedTokenType,
    @Body() { message }: HomeInquiryDTO,
  ) {
    return this.homeService.inquireHome(user, homeId, message);
  }

  @Roles(UserType.REALTOR, UserType.ADMIN)
  @Get('/:id/messages')
  async getMessagesByHome(
    @Param('id', ParseIntPipe) homeId: number,
    @User() user: UserDecodedTokenType,
  ) {
    return this.homeService.getMessagesByHome(user, homeId);
  }
}
