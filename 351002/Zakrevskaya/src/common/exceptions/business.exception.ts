export class BusinessException extends Error {
  constructor(
    public readonly errorCode: string,
    public readonly errorMessage: string,
    public readonly statusCode: number,
  ) {
    super(errorMessage);
  }
}