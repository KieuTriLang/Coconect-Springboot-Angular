package com.ktl.server.user;

import com.ktl.server.home.RegisterRequest;

public interface UserService {

    void register(RegisterRequest registerRequest) throws Exception;
}
