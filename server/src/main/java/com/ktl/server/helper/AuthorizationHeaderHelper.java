package com.ktl.server.helper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.JWTVerifier;
import com.ktl.server.jwt.JwtConfig;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Component
public class AuthorizationHeaderHelper {
    @Autowired
    private JwtConfig jwtConfig;

    public String getSub(String authorizationHeader) {
        try {
            String token = authorizationHeader.replace(jwtConfig.getTokenPrefix(), "");
            Algorithm algorithm = Algorithm.HMAC256(jwtConfig.getSecretKey().getBytes());
            JWTVerifier verifier = JWT.require(algorithm).build();
            DecodedJWT decodedJWT = verifier.verify(token);

            return decodedJWT.getSubject();
        } catch (Exception ex) {
            throw new RuntimeException(ex);
        }
    }
}
