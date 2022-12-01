package com.ktl.server.security;

public enum AppUserPermission {
    ACT_CREATE("act:create"),
    ACT_READ("act:read");

    private final String permission;

    AppUserPermission(String permission) {
        this.permission = permission;
    }

    public String getPermission() {
        return this.permission;
    }
}
