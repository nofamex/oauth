import ApiError from "./apiError";

export const clientIdNotFoundError = (): ApiError => {
  return new ApiError("Client error", "There is no client with given id");
};

export const wrongClientSecretError = (): ApiError => {
  return new ApiError("Client error", "Wrong client secret");
};

export const noUsernameFoundError = (): ApiError => {
  return new ApiError("User error", "There is no user with given username");
};

export const wrongPasswordError = (): ApiError => {
  return new ApiError("Authentication error", "Wrong user password");
};

export const wrongAccessTokenError = (): ApiError => {
  return new ApiError(
    "Token error",
    "Token maybe expired or you input the wrong token"
  );
};
