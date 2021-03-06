const internalError = (message, internalCode) => ({
  message,
  internalCode
});

exports.DATABASE_ERROR = 'database_error';
exports.databaseError = message => internalError(message, exports.DATABASE_ERROR);

exports.DEFAULT_ERROR = 'default_error';
exports.defaultError = message => internalError(message, exports.DEFAULT_ERROR);

exports.API_ERROR = 'api_error';
exports.apiError = message => internalError(message, exports.API_ERROR);

exports.HASH_ERROR = 'hash_error';
exports.hashError = message => internalError(message, exports.HASH_ERROR);

exports.VALIDATION_ERROR = 'validation_error';
exports.validationError = message => internalError(message, exports.VALIDATION_ERROR);

exports.TOKEN_ERROR = 'token_error';
exports.tokenError = message => internalError(message, exports.TOKEN_ERROR);

exports.PERMISSION_ERROR = 'permission_error';
exports.permissionError = message => internalError(message, exports.PERMISSION_ERROR);

exports.NOTIFICATION_ERROR = 'notification_error';
exports.notificationError = message => internalError(message, exports.NOTIFICATION_ERROR);
