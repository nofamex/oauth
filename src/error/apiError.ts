const DEFAULT_API_ERROR_TITLE = "Internal server error";
const DEFAULT_API_ERROR_MESSAGE =
  "Something is not working in the back-end. Please contact back-end team to resolve this issue.";

export default class ApiError {
  private title: string;
  private message: string;

  constructor(title: string, message?: string) {
    this.title = title || DEFAULT_API_ERROR_TITLE;
    this.message = message || DEFAULT_API_ERROR_MESSAGE;
  }
}
