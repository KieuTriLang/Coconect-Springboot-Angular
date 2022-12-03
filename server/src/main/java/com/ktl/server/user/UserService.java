package com.ktl.server.user;

import com.ktl.server.home.RegisterRequest;

public interface UserService {

    void register(RegisterRequest registerRequest);

    AppUserDto getInfoUserByUserCode(String userCode);

    AppUserDto getInfoUserByUsername(String username);
}
