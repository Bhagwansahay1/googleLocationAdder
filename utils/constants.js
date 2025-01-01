import HouseFillIcon from '../assets/icons/houseFill.svg';
import OfficeIcon from '../assets/icons/work.svg';
import MapPinBlackIcon from '../assets/icons/mapPinBlack.svg';
import HomeIcon from '../assets/icons/homeIcon.svg';
import BuildingIcon from '../assets/icons/buildingIcon.svg';
import LandmarkIcon from '../assets/icons/landmarkIcon.svg';
import UserIcon from '../assets/icons/userIcon.svg';
import PhoneIcon from '../assets/icons/phoneIcon.svg';
import PetNameIcon from '../assets/icons/petNameIcon.svg';

export const addressTypes = [
  { label: 'Home', IconComponent: HouseFillIcon },
  { label: 'Work', IconComponent: OfficeIcon },
  { label: 'Other', IconComponent: MapPinBlackIcon }
];

export const createAddressInputs = (addressDetails, setAddressDetails) => [
  {
    placeholder: 'House/Flat no.',
    value: addressDetails.houseNumber,
    IconComponent: HomeIcon,
    onChangeText: (value) => setAddressDetails({ ...addressDetails, houseNumber: value })
  },
  {
    placeholder: 'Building name',
    value: addressDetails.buildingName,
    IconComponent: BuildingIcon,
    onChangeText: (value) => setAddressDetails({ ...addressDetails, buildingName: value })
  },
  {
    placeholder: 'Landmark',
    value: addressDetails.landmark,
    IconComponent: LandmarkIcon,
    onChangeText: (value) => setAddressDetails({ ...addressDetails, landmark: value })
  },
];

export const createReceiverInputs = (receiverDetails, setReceiverDetails) => [
  {
    placeholder: 'Your name',
    value: receiverDetails.receiverName,
    IconComponent: UserIcon,
    onChangeText: (value) => setReceiverDetails({ ...receiverDetails, receiverName: value })
  },
  {
    placeholder: 'Your mobile no.',
    value: receiverDetails.receiverMobile,
    IconComponent: PhoneIcon,
    onChangeText: (value) => setReceiverDetails({ ...receiverDetails, receiverMobile: value })
  },
  {
    placeholder: 'Your pet name',
    value: receiverDetails.petName,
    IconComponent: PetNameIcon,
    onChangeText: (value) => setReceiverDetails({ ...receiverDetails, petName: value })
  },
];