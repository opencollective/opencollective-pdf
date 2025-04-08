import { startCase } from 'lodash-es';
import { PaymentMethod } from 'server/graphql/types/v2/schema';

export const formatPaymentMethodName = (paymentMethod: PaymentMethod) => {
  if (!paymentMethod) {
    return null;
  } else if (paymentMethod.service?.toUpperCase() === 'PAYPAL') {
    return `PayPal ${paymentMethod.type?.toLowerCase() || 'payment'} ${paymentMethod.name || ''}`;
  } else {
    return `${startCase(paymentMethod.type || 'Payment method')} ${paymentMethod.name || ''}`;
  }
};
