import type { Address as UndefinedAddress } from "postal-mime";
import type { Address } from "@tmpee/shared";

export function newAddress(undefinedAddress: UndefinedAddress | undefined): Address {
  if (undefinedAddress == undefined) {
    const result: Address = {
      name: "Undefined",
      address: "Undefined",
    };

    return result;
  }

  const result: Address = {
    name: undefinedAddress.name,
    address: undefinedAddress.address ?? "Undefined",
  };

  return result;
}
