import { startCase } from 'lodash';

export const formatPaymentMethodName = (paymentMethod) => {
  if (!paymentMethod) {
    return null;
  } else if (paymentMethod.service === 'paypal') {
    return `PayPal ${paymentMethod.type.toLowerCase()} ${paymentMethod.name}`;
  } else {
    return `${startCase(paymentMethod.type)} ${paymentMethod.name}`;
  }
};
