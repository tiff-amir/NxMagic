export default interface IBaseContract {
  resolvedAddress(): Promise<string>;
}
