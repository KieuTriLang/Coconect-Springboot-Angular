package com.ktl.server.exception;


import org.hibernate.exception.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(value = {NotFoundException.class})
    public ResponseEntity<ApiException> handleNotFoundException(NotFoundException exception){
        ApiException apiException = ApiException.builder().message(exception.getMessage()).build();
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .contentType(MediaType.APPLICATION_JSON)
                .body(apiException);
    }
    @ExceptionHandler(value = {BadRequestException.class})
    public ResponseEntity<ApiException> handleBadRequestException(BadRequestException exception){
        ApiException apiException = ApiException.builder().message(exception.getMessage()).build();

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .contentType(MediaType.APPLICATION_JSON)
                .body(apiException);
    }

    @ExceptionHandler(value = {InternalServerErrorException.class})
    public ResponseEntity<ApiException> handleInternalServerErrorException(InternalServerErrorException exception){

        ApiException apiException = ApiException.builder().message(exception.getMessage()).build();

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .contentType(MediaType.APPLICATION_JSON)
                .body(apiException);
    }

    @ExceptionHandler(value = {ConstraintViolationException.class})
    public ResponseEntity<ApiException> handleBadRequestException(RuntimeException exception){
        ApiException apiException = ApiException.builder().message(exception.getMessage()).build();

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .contentType(MediaType.APPLICATION_JSON)
                .body(apiException);
    }
}