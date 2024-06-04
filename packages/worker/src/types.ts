import type { Address as UndefinedAddress } from "postal-mime";

export interface Address {
  name: string;
  address: string;
}

export function new_address(undefined_address: UndefinedAddress): Address {
  const result: Address = {
    name: undefined_address.name,
    address: undefined_address.address ?? "Undefined",
  };

  return result;
}
