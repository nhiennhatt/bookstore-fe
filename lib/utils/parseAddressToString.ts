export function parseAddressToString(address: {
    province: string;
    district: string;
    ward: string;
    address: string;
}) {
    return `${address.address}, ${address.ward}, ${address.district}, ${address.province}`;
}