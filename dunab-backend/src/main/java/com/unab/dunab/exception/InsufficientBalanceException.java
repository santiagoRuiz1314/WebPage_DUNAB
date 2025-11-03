package com.unab.dunab.exception;

public class InsufficientBalanceException extends RuntimeException {
    public InsufficientBalanceException(String message) {
        super(message);
    }

    public InsufficientBalanceException() {
        super("Saldo insuficiente para realizar la transacción");
    }
}
