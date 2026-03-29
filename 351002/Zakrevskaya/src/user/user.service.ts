import { Injectable, NotFoundException, BadRequestException, ConflictException, HttpException, HttpStatus } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/user-request.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    this.validateUserDto(createUserDto);
    
    try {
      const user = await this.userRepository.create(createUserDto);
      return this.toResponseDto(user);
    } catch (error) {
      // Обработка ошибки уникальности (duplicate key)
      if (error.code === '23505' || error.message?.includes('duplicate key')) {
        // Тест ожидает 403, используем HttpException с кодом 403
        throw new HttpException('User with this login already exists', HttpStatus.FORBIDDEN);
      }
      throw error;
    }
  }

  async update(id: number, updateUserDto: CreateUserDto): Promise<UserResponseDto> {
    this.validateUserDto(updateUserDto);
    
    try {
      const user = await this.userRepository.update(id, updateUserDto);
      return this.toResponseDto(user);
    } catch (error) {
      // Обработка ошибки уникальности при обновлении
      if (error.code === '23505' || error.message?.includes('duplicate key')) {
        throw new HttpException('User with this login already exists', HttpStatus.FORBIDDEN);
      }
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException('User not found');
    await this.userRepository.delete(id);
  }

  async findById(id: number): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return this.toResponseDto(user);
  }

  async findAll(page: number = 1, limit: number = 10): Promise<UserResponseDto[]> {
    const [users] = await this.userRepository.findAll({ page, limit });
    return users.map(user => this.toResponseDto(user));
  }

  private validateUserDto(dto: CreateUserDto) {
    if (dto.login.length < 2 || dto.login.length > 64) {
      throw new BadRequestException('Login must be 2-64 characters');
    }
    if (dto.password.length < 8 || dto.password.length > 128) {
      throw new BadRequestException('Password must be 8-128 characters');
    }
    if (dto.firstname.length < 2 || dto.firstname.length > 64) {
      throw new BadRequestException('Firstname must be 2-64 characters');
    }
    if (dto.lastname.length < 2 || dto.lastname.length > 64) {
      throw new BadRequestException('Lastname must be 2-64 characters');
    }
  }

  private toResponseDto(user: User): UserResponseDto {
    return {
      id: user.id,
      login: user.login,
      firstname: user.firstname,
      lastname: user.lastname,
    };
  }
}