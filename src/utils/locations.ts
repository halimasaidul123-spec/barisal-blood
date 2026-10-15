export interface DistrictData {
  name: string;
  enName: string;
  upazilas: string[];
}

export const BARISHAL_DIVISION_DISTRICTS: DistrictData[] = [
  {
    name: 'বরিশাল',
    enName: 'Barishal',
    upazilas: [
      'বরিশাল সদর',
      'বাবুগঞ্জ',
      'উজিরপুর',
      'বাকেরগঞ্জ',
      'বানারীপাড়া',
      'গৌরনদী',
      'আগৈলঝাড়া',
      'মেহেন্দিগঞ্জ',
      'মুলাদী',
      'হিজলা',
    ],
  },
  {
    name: 'পটুয়াখালী',
    enName: 'Patuakhali',
    upazilas: [
      'পটুয়াখালী সদর',
      'দুমকি',
      'বাউফল',
      'দশমিনা',
      'গলাচিপা',
      'কলাপাড়া',
      'মির্জাগঞ্জ',
      'রাঙ্গাবালী',
    ],
  },
  {
    name: 'ভোলা',
    enName: 'Bhola',
    upazilas: [
      'ভোলা সদর',
      'দৌলতখান',
      'বোরহানউদ্দিন',
      'তজুমদ্দিন',
      'লালমোহন',
      'চরফ্যাশন',
      'মনপুরা',
    ],
  },
  {
    name: 'পিরোজপুর',
    enName: 'Pirojpur',
    upazilas: [
      'পিরোজপুর সদর',
      'ইন্দুরকানী',
      'কাউখালী',
      'ভাণ্ডারিয়া',
      'মঠবাড়িয়া',
      'নেছারাবাদ (স্বরূপকাঠি)',
      'নাজিরপুর',
    ],
  },
  {
    name: 'বরগুনা',
    enName: 'Barguna',
    upazilas: [
      'বরগুনা সদর',
      'আমতলী',
      'তালতলী',
      'পাথরঘাটা',
      'বেতাগী',
      'বামনা',
    ],
  },
  {
    name: 'ঝালকাঠি',
    enName: 'Jhalokati',
    upazilas: [
      'ঝালকাঠি সদর',
      'নলছিটি',
      'রাজাপুর',
      'কাঁঠালিয়া',
    ],
  },
];

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;

export function getUpazilasForDistrict(districtName: string): string[] {
  const d = BARISHAL_DIVISION_DISTRICTS.find((item) => item.name === districtName);
  return d ? d.upazilas : [];
}
