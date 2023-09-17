import { Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { HomeService } from './home.service';
import { HomeResponseDTO } from './dto/home.dto';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get()
  getHomes(): Promise<HomeResponseDTO[]> {
    return this.homeService.getHomes();
  }

  @Get(':id')
  getHomeId(@Param('id') id: string) {
    return `Welcome to the home page ${id}!`;
  }

  @Post()
  postHome() {
    return 'Welcome to the home page!';
  }

  @Put(':id')
  putHomeId(@Param('id') id: string) {
    return `Welcome to the home page ${id}!`;
  }

  @Delete(':id')
  deleteHomeId(@Param('id') id: string) {
    return `Welcome to the home page ${id}!`;
  }
}
