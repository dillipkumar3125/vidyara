package com.projects.vidyara.backend.shared.util;

import java.util.UUID;

public class UuidUtil {

    private UuidUtil() {} ;

    public static UUID parseUUID(String uuid) {
        return UUID.fromString(uuid) ;
    }
}