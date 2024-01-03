package com.ktl.server.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class JwtService {
    @Value("${jwt.secret-key}")
    private String SECRET_KEY;
    @Value("${jwt.expired-after-minute.access-token}")
    private String timeExpiredOfAccessToken;
    @Value("${jwt.expired-after-minute.refresh-token}")
    private String timeExpiredOfRefreshToken;

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }
    public List<String> extractRoles(String token){
        final Claims claims = extractAllClaims(token);
        Object rolesObject = claims.get("roles");
        if(rolesObject instanceof List<?>){
            return (List<String>) rolesObject;
        }else{
            return new ArrayList<>();
        }

    }

    public String generateToken(UserDetails userDetails, Boolean isAccessToken) {

        return generateToken(new HashMap<>(), userDetails, isAccessToken);
    }

    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails, Boolean isAccessToken) {
        int expiredAfter = 0;
        if (isAccessToken) {
            expiredAfter = Integer.parseInt(timeExpiredOfAccessToken);
            extraClaims.put("roles", userDetails.getAuthorities()
                    .stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.toList()));
        } else {
            expiredAfter = Integer.parseInt(timeExpiredOfRefreshToken);
        }

        return Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000L * 60 * expiredAfter))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean isTokenValid(String token, User user) {
        final String username = extractUsername(token);
        return (username.equals(user.getUsername())) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }


    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
