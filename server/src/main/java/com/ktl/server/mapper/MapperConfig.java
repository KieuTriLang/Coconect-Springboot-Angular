package com.ktl.server.mapper;

import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.ktl.server.room.Room;
import com.ktl.server.room.RoomDto;
import com.ktl.server.user.AppUser;
import com.ktl.server.user.AppUserDto;

@Configuration
public class MapperConfig {
    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();

        modelMapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STANDARD);

        // // AppUser -> AppUserDto
        // modelMapper.createTypeMap(AppUser.class, AppUserDto.class);

        // // Room -> RoomDto
        // modelMapper.createTypeMap(Room.class, RoomDto.class);
        return modelMapper;
    }
}
