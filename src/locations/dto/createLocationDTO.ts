export class CreateLocationDTO {
  name: string;
  about: string;
  description: string;
  isHotel: boolean;
  countryId: string;
  provinceId: string;
  districtId: string;
  wardId: string;
  streetAddress: string;
  categories: string[];
}
