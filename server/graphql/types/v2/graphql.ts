/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All account types */
export type AccountType =
  'BOT' | 'COLLECTIVE' | 'EVENT' | 'FUND' | 'INDIVIDUAL' | 'ORGANIZATION' | 'PLATFORM' | 'PROJECT' | 'VENDOR';

/** All supported currencies */
export type Currency =
  /** UAE Dirham */
  | 'AED'
  /** Afghani */
  | 'AFN'
  /** Lek */
  | 'ALL'
  /** Armenian Dram */
  | 'AMD'
  /** Netherlands Antillean Guilder */
  | 'ANG'
  /** Kwanza */
  | 'AOA'
  /** Argentine Peso */
  | 'ARS'
  /** Australian Dollar */
  | 'AUD'
  /** Aruban Florin */
  | 'AWG'
  /** Azerbaijanian Manat */
  | 'AZN'
  /** Convertible Mark */
  | 'BAM'
  /** Barbados Dollar */
  | 'BBD'
  /** Taka */
  | 'BDT'
  /** Bulgarian Lev */
  | 'BGN'
  /** Burundi Franc */
  | 'BIF'
  /** Bermudian Dollar */
  | 'BMD'
  /** Brunei Dollar */
  | 'BND'
  /** Boliviano */
  | 'BOB'
  /** Brazilian Real */
  | 'BRL'
  /** Bahamian Dollar */
  | 'BSD'
  /** Pula */
  | 'BWP'
  /** Belarussian Ruble */
  | 'BYN'
  /** Belize Dollar */
  | 'BZD'
  /** Canadian Dollar */
  | 'CAD'
  /** Congolese Franc */
  | 'CDF'
  /** Swiss Franc */
  | 'CHF'
  /** Chilean Peso */
  | 'CLP'
  /** Yuan Renminbi */
  | 'CNY'
  /** Colombian Peso */
  | 'COP'
  /** Costa Rican Colon */
  | 'CRC'
  /** Cabo Verde Escudo */
  | 'CVE'
  /** Czech Koruna */
  | 'CZK'
  /** Djibouti Franc */
  | 'DJF'
  /** Danish Krone */
  | 'DKK'
  /** Dominican Peso */
  | 'DOP'
  /** Algerian Dinar */
  | 'DZD'
  /** Egyptian Pound */
  | 'EGP'
  /** Ethiopian Birr */
  | 'ETB'
  /** Euro */
  | 'EUR'
  /** Fiji Dollar */
  | 'FJD'
  /** Falkland Islands Pound */
  | 'FKP'
  /** Pound Sterling */
  | 'GBP'
  /** Lari */
  | 'GEL'
  /** Ghana Cedi */
  | 'GHS'
  /** Gibraltar Pound */
  | 'GIP'
  /** Dalasi */
  | 'GMD'
  /** Guinea Franc */
  | 'GNF'
  /** Quetzal */
  | 'GTQ'
  /** Guyana Dollar */
  | 'GYD'
  /** Hong Kong Dollar */
  | 'HKD'
  /** Lempira */
  | 'HNL'
  /** Kuna */
  | 'HRK'
  /** Gourde */
  | 'HTG'
  /** Forint */
  | 'HUF'
  /** Rupiah */
  | 'IDR'
  /** New Israeli Sheqel */
  | 'ILS'
  /** Indian Rupee */
  | 'INR'
  /** Iceland Krona */
  | 'ISK'
  /** Jamaican Dollar */
  | 'JMD'
  /** Yen */
  | 'JPY'
  /** Kenyan Shilling */
  | 'KES'
  /** Som */
  | 'KGS'
  /** Riel */
  | 'KHR'
  /** Comoro Franc */
  | 'KMF'
  /** Won */
  | 'KRW'
  /** Cayman Islands Dollar */
  | 'KYD'
  /** Tenge */
  | 'KZT'
  /** Kip */
  | 'LAK'
  /** Lebanese Pound */
  | 'LBP'
  /** Sri Lanka Rupee */
  | 'LKR'
  /** Liberian Dollar */
  | 'LRD'
  /** Loti */
  | 'LSL'
  /** Moroccan Dirham */
  | 'MAD'
  /** Moldovan Leu */
  | 'MDL'
  /** Malagasy Ariary */
  | 'MGA'
  /** Denar */
  | 'MKD'
  /** Kyat */
  | 'MMK'
  /** Tugrik */
  | 'MNT'
  /** Pataca */
  | 'MOP'
  /** Ouguiya */
  | 'MRU'
  /** Mauritius Rupee */
  | 'MUR'
  /** Rufiyaa */
  | 'MVR'
  /** Kwacha */
  | 'MWK'
  /** Mexican Peso */
  | 'MXN'
  /** Malaysian Ringgit */
  | 'MYR'
  /** Mozambique Metical */
  | 'MZN'
  /** Namibia Dollar */
  | 'NAD'
  /** Naira */
  | 'NGN'
  /** Cordoba Oro */
  | 'NIO'
  /** Norwegian Krone */
  | 'NOK'
  /** Nepalese Rupee */
  | 'NPR'
  /** New Zealand Dollar */
  | 'NZD'
  /** Balboa */
  | 'PAB'
  /** Nuevo Sol */
  | 'PEN'
  /** Kina */
  | 'PGK'
  /** Philippine Peso */
  | 'PHP'
  /** Pakistan Rupee */
  | 'PKR'
  /** Zloty */
  | 'PLN'
  /** Guarani */
  | 'PYG'
  /** Qatari Rial */
  | 'QAR'
  /** Romanian Leu */
  | 'RON'
  /** Serbian Dinar */
  | 'RSD'
  /** Russian Ruble */
  | 'RUB'
  /** Rwanda Franc */
  | 'RWF'
  /** Saudi Riyal */
  | 'SAR'
  /** Solomon Islands Dollar */
  | 'SBD'
  /** Seychelles Rupee */
  | 'SCR'
  /** Swedish Krona */
  | 'SEK'
  /** Singapore Dollar */
  | 'SGD'
  /** Saint Helena Pound */
  | 'SHP'
  /** Leone */
  | 'SLL'
  /** Somali Shilling */
  | 'SOS'
  /** Surinam Dollar */
  | 'SRD'
  /** Lilangeni */
  | 'SZL'
  /** Baht */
  | 'THB'
  /** Somoni */
  | 'TJS'
  /** Pa’anga */
  | 'TOP'
  /** Turkish Lira */
  | 'TRY'
  /** Trinidad and Tobago Dollar */
  | 'TTD'
  /** New Taiwan Dollar */
  | 'TWD'
  /** Tanzanian Shilling */
  | 'TZS'
  /** Hryvnia */
  | 'UAH'
  /** Uganda Shilling */
  | 'UGX'
  /** US Dollar */
  | 'USD'
  /** Peso Uruguayo */
  | 'UYU'
  /** Uzbekistan Sum */
  | 'UZS'
  /** Dong */
  | 'VND'
  /** Vatu */
  | 'VUV'
  /** Tala */
  | 'WST'
  /** CFA Franc BEAC */
  | 'XAF'
  /** East Caribbean Dollar */
  | 'XCD'
  /** CFA Franc BCEAO */
  | 'XOF'
  /** CFP Franc */
  | 'XPF'
  /** Yemeni Rial */
  | 'YER'
  /** Rand */
  | 'ZAR'
  /** Zambian Kwacha */
  | 'ZMW';

/** Where does the FX rate come from */
export type CurrencyExchangeRateSourceType =
  /** Open Collective internal system, relying on caching and 3rd party APIs */
  | 'OPENCOLLECTIVE'
  /** PayPal API */
  | 'PAYPAL'
  /** User-provided exchange rate */
  | 'USER'
  /** Wise API */
  | 'WISE';

/** All supported expense types */
export type ExpenseType =
  /** Credit Card Charge: Payment done using an issued (virtual) credit card issued by your Fiscal Host. */
  | 'CHARGE'
  /** Funding Request: Request funding for a project or initiative. */
  | 'FUNDING_REQUEST'
  /** Grant: Request funding for a project or initiative. */
  | 'GRANT'
  /** Invoice: Charge for your time or get paid in advance. */
  | 'INVOICE'
  /** Platform billing: expense generated by Open Collective to charge for platform subscriptions */
  | 'PLATFORM_BILLING'
  /** Receipt: Get paid back for a purchase already made. */
  | 'RECEIPT'
  /** Settlement: expense generated by Open Collective to collect money owed by Fiscal Hosts. */
  | 'SETTLEMENT'
  /** Unclassified expense */
  | 'UNCLASSIFIED';

export type PaymentMethodService = 'OPENCOLLECTIVE' | 'PAYPAL' | 'STRIPE' | 'THEGIVINGBLOCK' | 'WISE';

export type PaymentMethodType =
  | 'ADAPTIVE'
  | 'ALIPAY'
  | 'BACS_DEBIT'
  | 'BANCONTACT'
  | 'BANK_TRANSFER'
  | 'COLLECTIVE'
  | 'CREDITCARD'
  | 'CRYPTO'
  | 'DEFAULT'
  | 'GIFTCARD'
  | 'HOST'
  | 'LINK'
  | 'MANUAL'
  | 'PAYMENT'
  | 'PAYMENT_INTENT'
  | 'PAYOUT'
  | 'PREPAID'
  | 'SEPA_DEBIT'
  | 'SUBSCRIPTION'
  | 'SWISH'
  | 'US_BANK_ACCOUNT'
  | 'VIRTUAL_CARD'
  | 'adaptive'
  | 'alipay'
  | 'bacs_debit'
  | 'bancontact'
  | 'bank_transfer'
  | 'collective'
  | 'creditcard'
  | 'crypto'
  | 'default'
  | 'giftcard'
  | 'host'
  | 'link'
  | 'manual'
  | 'payment'
  | 'paymentintent'
  | 'payout'
  | 'prepaid'
  | 'sepa_debit'
  | 'subscription'
  | 'swish'
  | 'us_bank_account'
  | 'virtual_card';

/** The type of a tax like GST, VAT, etc */
export type TaxType =
  /** New Zealand Good and Services Tax */
  | 'GST'
  /** European Value Added Tax */
  | 'VAT';

export type TierType = 'DONATION' | 'MEMBERSHIP' | 'PRODUCT' | 'SERVICE' | 'TICKET' | 'TIER';

export type TransactionKind =
  | 'ADDED_FUNDS'
  | 'APPLICATION_FEE'
  | 'BALANCE_TRANSFER'
  | 'CONTRIBUTION'
  | 'EXPENSE'
  | 'HOST_FEE'
  | 'HOST_FEE_SHARE'
  | 'HOST_FEE_SHARE_DEBT'
  | 'PAYMENT_PROCESSOR_COVER'
  | 'PAYMENT_PROCESSOR_DISPUTE_FEE'
  | 'PAYMENT_PROCESSOR_FEE'
  | 'PLATFORM_FEE'
  | 'PLATFORM_TIP'
  | 'PLATFORM_TIP_DEBT'
  | 'PREPAID_PAYMENT_METHOD'
  | 'TAX';

/** All transaction types */
export type TransactionType = 'CREDIT' | 'DEBIT';

export type ExpenseInvoiceQueryVariables = Exact<{
  expenseId: string;
}>;

export type ExpenseInvoiceQuery = {
  expense: {
    id: string;
    legacyId: number;
    description: string;
    currency: Currency;
    type: ExpenseType;
    invoiceInfo: string | null;
    amount: number;
    reference: string | null;
    createdAt: any;
    permissions: { canSeeInvoiceInfo: boolean };
    taxes: Array<{ id: string; type: TaxType; rate: number; idNumber: string | null }>;
    account:
      | {
          id: string;
          type: AccountType;
          name: string | null;
          legalName: string | null;
          slug: string;
          imageUrl: string | null;
          settings: any;
          location: { address: string | null; country: string | null } | null;
        }
      | {
          id: string;
          type: AccountType;
          name: string | null;
          legalName: string | null;
          slug: string;
          imageUrl: string | null;
          settings: any;
          host: {
            id: string;
            name: string | null;
            legalName: string | null;
            slug: string;
            type: AccountType;
            expensePolicy: string | null;
            settings: any;
            location: { address: string | null; country: string | null } | null;
          } | null;
          location: { address: string | null; country: string | null } | null;
        }
      | {
          id: string;
          type: AccountType;
          name: string | null;
          legalName: string | null;
          slug: string;
          imageUrl: string | null;
          settings: any;
          host: {
            id: string;
            name: string | null;
            legalName: string | null;
            slug: string;
            type: AccountType;
            expensePolicy: string | null;
            settings: any;
            location: { address: string | null; country: string | null } | null;
          } | null;
          location: { address: string | null; country: string | null } | null;
        }
      | {
          id: string;
          type: AccountType;
          name: string | null;
          legalName: string | null;
          slug: string;
          imageUrl: string | null;
          settings: any;
          host: {
            id: string;
            name: string | null;
            legalName: string | null;
            slug: string;
            type: AccountType;
            expensePolicy: string | null;
            settings: any;
            location: { address: string | null; country: string | null } | null;
          } | null;
          location: { address: string | null; country: string | null } | null;
        }
      | {
          id: string;
          type: AccountType;
          name: string | null;
          legalName: string | null;
          slug: string;
          imageUrl: string | null;
          settings: any;
          location: { address: string | null; country: string | null } | null;
        }
      | {
          id: string;
          type: AccountType;
          name: string | null;
          legalName: string | null;
          slug: string;
          imageUrl: string | null;
          settings: any;
          location: { address: string | null; country: string | null } | null;
        }
      | {
          id: string;
          type: AccountType;
          name: string | null;
          legalName: string | null;
          slug: string;
          imageUrl: string | null;
          settings: any;
          location: { address: string | null; country: string | null } | null;
        }
      | {
          id: string;
          type: AccountType;
          name: string | null;
          legalName: string | null;
          slug: string;
          imageUrl: string | null;
          settings: any;
          host: {
            id: string;
            name: string | null;
            legalName: string | null;
            slug: string;
            type: AccountType;
            expensePolicy: string | null;
            settings: any;
            location: { address: string | null; country: string | null } | null;
          } | null;
          location: { address: string | null; country: string | null } | null;
        }
      | {
          id: string;
          type: AccountType;
          name: string | null;
          legalName: string | null;
          slug: string;
          imageUrl: string | null;
          settings: any;
          host: {
            id: string;
            name: string | null;
            legalName: string | null;
            slug: string;
            type: AccountType;
            expensePolicy: string | null;
            settings: any;
            location: { address: string | null; country: string | null } | null;
          } | null;
          location: { address: string | null; country: string | null } | null;
        }
      | {
          id: string;
          type: AccountType;
          name: string | null;
          legalName: string | null;
          slug: string;
          imageUrl: string | null;
          settings: any;
          location: { address: string | null; country: string | null } | null;
        };
    payee:
      | {
          id: string;
          type: AccountType;
          name: string | null;
          legalName: string | null;
          slug: string;
          imageUrl: string | null;
        }
      | {
          id: string;
          type: AccountType;
          name: string | null;
          legalName: string | null;
          slug: string;
          imageUrl: string | null;
          host: {
            id: string;
            name: string | null;
            legalName: string | null;
            slug: string;
            type: AccountType;
            expensePolicy: string | null;
            location: { address: string | null; country: string | null } | null;
          } | null;
        }
      | {
          id: string;
          type: AccountType;
          name: string | null;
          legalName: string | null;
          slug: string;
          imageUrl: string | null;
          host: {
            id: string;
            name: string | null;
            legalName: string | null;
            slug: string;
            type: AccountType;
            expensePolicy: string | null;
            location: { address: string | null; country: string | null } | null;
          } | null;
        }
      | {
          id: string;
          type: AccountType;
          name: string | null;
          legalName: string | null;
          slug: string;
          imageUrl: string | null;
          host: {
            id: string;
            name: string | null;
            legalName: string | null;
            slug: string;
            type: AccountType;
            expensePolicy: string | null;
            location: { address: string | null; country: string | null } | null;
          } | null;
        }
      | {
          id: string;
          type: AccountType;
          name: string | null;
          legalName: string | null;
          slug: string;
          imageUrl: string | null;
        }
      | {
          id: string;
          type: AccountType;
          name: string | null;
          legalName: string | null;
          slug: string;
          imageUrl: string | null;
        }
      | {
          id: string;
          type: AccountType;
          name: string | null;
          legalName: string | null;
          slug: string;
          imageUrl: string | null;
        }
      | {
          id: string;
          type: AccountType;
          name: string | null;
          legalName: string | null;
          slug: string;
          imageUrl: string | null;
          host: {
            id: string;
            name: string | null;
            legalName: string | null;
            slug: string;
            type: AccountType;
            expensePolicy: string | null;
            location: { address: string | null; country: string | null } | null;
          } | null;
        }
      | {
          id: string;
          type: AccountType;
          name: string | null;
          legalName: string | null;
          slug: string;
          imageUrl: string | null;
          host: {
            id: string;
            name: string | null;
            legalName: string | null;
            slug: string;
            type: AccountType;
            expensePolicy: string | null;
            location: { address: string | null; country: string | null } | null;
          } | null;
        }
      | {
          id: string;
          type: AccountType;
          name: string | null;
          legalName: string | null;
          slug: string;
          imageUrl: string | null;
        };
    payeeLocation: { address: string | null; country: string | null } | null;
    items: Array<{
      id: string;
      description: string | null;
      incurredAt: any;
      url: any;
      amountV2: {
        valueInCents: number | null;
        currency: Currency | null;
        exchangeRate: {
          fromCurrency: Currency;
          toCurrency: Currency;
          value: number;
          date: any;
          isApproximate: boolean;
          source: CurrencyExchangeRateSourceType;
        } | null;
      };
    }>;
  } | null;
};

type ReceiptTransactionHostFieldsFragment_Bot_Fragment = {
  id: string;
  slug: string;
  name: string | null;
  legalName: string | null;
  currency: Currency;
  imageUrl: string | null;
  website: string | null;
  settings: any;
  type: AccountType;
  location: { name: string | null; address: string | null; country: string | null } | null;
};

type ReceiptTransactionHostFieldsFragment_Collective_Fragment = {
  id: string;
  slug: string;
  name: string | null;
  legalName: string | null;
  currency: Currency;
  imageUrl: string | null;
  website: string | null;
  settings: any;
  type: AccountType;
  location: { name: string | null; address: string | null; country: string | null } | null;
};

type ReceiptTransactionHostFieldsFragment_Event_Fragment = {
  id: string;
  slug: string;
  name: string | null;
  legalName: string | null;
  currency: Currency;
  imageUrl: string | null;
  website: string | null;
  settings: any;
  type: AccountType;
  location: { name: string | null; address: string | null; country: string | null } | null;
};

type ReceiptTransactionHostFieldsFragment_Fund_Fragment = {
  id: string;
  slug: string;
  name: string | null;
  legalName: string | null;
  currency: Currency;
  imageUrl: string | null;
  website: string | null;
  settings: any;
  type: AccountType;
  location: { name: string | null; address: string | null; country: string | null } | null;
};

type ReceiptTransactionHostFieldsFragment_Host_Fragment = {
  id: string;
  slug: string;
  name: string | null;
  legalName: string | null;
  currency: Currency;
  imageUrl: string | null;
  website: string | null;
  settings: any;
  type: AccountType;
  location: { name: string | null; address: string | null; country: string | null } | null;
};

type ReceiptTransactionHostFieldsFragment_Individual_Fragment = {
  id: string;
  slug: string;
  name: string | null;
  legalName: string | null;
  currency: Currency;
  imageUrl: string | null;
  website: string | null;
  settings: any;
  type: AccountType;
  location: { name: string | null; address: string | null; country: string | null } | null;
};

type ReceiptTransactionHostFieldsFragment_Organization_Fragment = {
  id: string;
  slug: string;
  name: string | null;
  legalName: string | null;
  currency: Currency;
  imageUrl: string | null;
  website: string | null;
  settings: any;
  type: AccountType;
  location: { name: string | null; address: string | null; country: string | null } | null;
};

type ReceiptTransactionHostFieldsFragment_Platform_Fragment = {
  id: string;
  slug: string;
  name: string | null;
  legalName: string | null;
  currency: Currency;
  imageUrl: string | null;
  website: string | null;
  settings: any;
  type: AccountType;
  location: { name: string | null; address: string | null; country: string | null } | null;
};

type ReceiptTransactionHostFieldsFragment_Project_Fragment = {
  id: string;
  slug: string;
  name: string | null;
  legalName: string | null;
  currency: Currency;
  imageUrl: string | null;
  website: string | null;
  settings: any;
  type: AccountType;
  location: { name: string | null; address: string | null; country: string | null } | null;
};

type ReceiptTransactionHostFieldsFragment_Vendor_Fragment = {
  id: string;
  slug: string;
  name: string | null;
  legalName: string | null;
  currency: Currency;
  imageUrl: string | null;
  website: string | null;
  settings: any;
  type: AccountType;
  location: { name: string | null; address: string | null; country: string | null } | null;
};

export type ReceiptTransactionHostFieldsFragmentFragment =
  | ReceiptTransactionHostFieldsFragment_Bot_Fragment
  | ReceiptTransactionHostFieldsFragment_Collective_Fragment
  | ReceiptTransactionHostFieldsFragment_Event_Fragment
  | ReceiptTransactionHostFieldsFragment_Fund_Fragment
  | ReceiptTransactionHostFieldsFragment_Host_Fragment
  | ReceiptTransactionHostFieldsFragment_Individual_Fragment
  | ReceiptTransactionHostFieldsFragment_Organization_Fragment
  | ReceiptTransactionHostFieldsFragment_Platform_Fragment
  | ReceiptTransactionHostFieldsFragment_Project_Fragment
  | ReceiptTransactionHostFieldsFragment_Vendor_Fragment;

type ReceiptTransactionFragment_Credit_Fragment = {
  id: string;
  type: TransactionType;
  kind: TransactionKind | null;
  createdAt: any;
  clearedAt: any;
  description: string | null;
  hostCurrencyFxRate: number | null;
  invoiceTemplate: string | null;
  isRefund: boolean | null;
  host:
    | {
        id: string;
        slug: string;
        name: string | null;
        legalName: string | null;
        currency: Currency;
        imageUrl: string | null;
        website: string | null;
        settings: any;
        type: AccountType;
        location: { name: string | null; address: string | null; country: string | null } | null;
      }
    | {
        id: string;
        slug: string;
        name: string | null;
        legalName: string | null;
        currency: Currency;
        imageUrl: string | null;
        website: string | null;
        settings: any;
        type: AccountType;
        location: { name: string | null; address: string | null; country: string | null } | null;
      }
    | {
        id: string;
        slug: string;
        name: string | null;
        legalName: string | null;
        currency: Currency;
        imageUrl: string | null;
        website: string | null;
        settings: any;
        type: AccountType;
        location: { name: string | null; address: string | null; country: string | null } | null;
      }
    | {
        id: string;
        slug: string;
        name: string | null;
        legalName: string | null;
        currency: Currency;
        imageUrl: string | null;
        website: string | null;
        settings: any;
        type: AccountType;
        location: { name: string | null; address: string | null; country: string | null } | null;
      }
    | {
        id: string;
        slug: string;
        name: string | null;
        legalName: string | null;
        currency: Currency;
        imageUrl: string | null;
        website: string | null;
        settings: any;
        type: AccountType;
        location: { name: string | null; address: string | null; country: string | null } | null;
      }
    | {
        id: string;
        slug: string;
        name: string | null;
        legalName: string | null;
        currency: Currency;
        imageUrl: string | null;
        website: string | null;
        settings: any;
        type: AccountType;
        location: { name: string | null; address: string | null; country: string | null } | null;
      }
    | {
        id: string;
        slug: string;
        name: string | null;
        legalName: string | null;
        currency: Currency;
        imageUrl: string | null;
        website: string | null;
        settings: any;
        type: AccountType;
        location: { name: string | null; address: string | null; country: string | null } | null;
      }
    | {
        id: string;
        slug: string;
        name: string | null;
        legalName: string | null;
        currency: Currency;
        imageUrl: string | null;
        website: string | null;
        settings: any;
        type: AccountType;
        location: { name: string | null; address: string | null; country: string | null } | null;
      }
    | {
        id: string;
        slug: string;
        name: string | null;
        legalName: string | null;
        currency: Currency;
        imageUrl: string | null;
        website: string | null;
        settings: any;
        type: AccountType;
        location: { name: string | null; address: string | null; country: string | null } | null;
      }
    | {
        id: string;
        slug: string;
        name: string | null;
        legalName: string | null;
        currency: Currency;
        imageUrl: string | null;
        website: string | null;
        settings: any;
        type: AccountType;
        location: { name: string | null; address: string | null; country: string | null } | null;
      }
    | null;
  oppositeTransaction:
    | {
        host:
          | {
              id: string;
              slug: string;
              name: string | null;
              legalName: string | null;
              currency: Currency;
              imageUrl: string | null;
              website: string | null;
              settings: any;
              type: AccountType;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              id: string;
              slug: string;
              name: string | null;
              legalName: string | null;
              currency: Currency;
              imageUrl: string | null;
              website: string | null;
              settings: any;
              type: AccountType;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              id: string;
              slug: string;
              name: string | null;
              legalName: string | null;
              currency: Currency;
              imageUrl: string | null;
              website: string | null;
              settings: any;
              type: AccountType;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              id: string;
              slug: string;
              name: string | null;
              legalName: string | null;
              currency: Currency;
              imageUrl: string | null;
              website: string | null;
              settings: any;
              type: AccountType;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              id: string;
              slug: string;
              name: string | null;
              legalName: string | null;
              currency: Currency;
              imageUrl: string | null;
              website: string | null;
              settings: any;
              type: AccountType;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              id: string;
              slug: string;
              name: string | null;
              legalName: string | null;
              currency: Currency;
              imageUrl: string | null;
              website: string | null;
              settings: any;
              type: AccountType;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              id: string;
              slug: string;
              name: string | null;
              legalName: string | null;
              currency: Currency;
              imageUrl: string | null;
              website: string | null;
              settings: any;
              type: AccountType;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              id: string;
              slug: string;
              name: string | null;
              legalName: string | null;
              currency: Currency;
              imageUrl: string | null;
              website: string | null;
              settings: any;
              type: AccountType;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              id: string;
              slug: string;
              name: string | null;
              legalName: string | null;
              currency: Currency;
              imageUrl: string | null;
              website: string | null;
              settings: any;
              type: AccountType;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              id: string;
              slug: string;
              name: string | null;
              legalName: string | null;
              currency: Currency;
              imageUrl: string | null;
              website: string | null;
              settings: any;
              type: AccountType;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | null;
      }
    | {
        host:
          | {
              id: string;
              slug: string;
              name: string | null;
              legalName: string | null;
              currency: Currency;
              imageUrl: string | null;
              website: string | null;
              settings: any;
              type: AccountType;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              id: string;
              slug: string;
              name: string | null;
              legalName: string | null;
              currency: Currency;
              imageUrl: string | null;
              website: string | null;
              settings: any;
              type: AccountType;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              id: string;
              slug: string;
              name: string | null;
              legalName: string | null;
              currency: Currency;
              imageUrl: string | null;
              website: string | null;
              settings: any;
              type: AccountType;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              id: string;
              slug: string;
              name: string | null;
              legalName: string | null;
              currency: Currency;
              imageUrl: string | null;
              website: string | null;
              settings: any;
              type: AccountType;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              id: string;
              slug: string;
              name: string | null;
              legalName: string | null;
              currency: Currency;
              imageUrl: string | null;
              website: string | null;
              settings: any;
              type: AccountType;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              id: string;
              slug: string;
              name: string | null;
              legalName: string | null;
              currency: Currency;
              imageUrl: string | null;
              website: string | null;
              settings: any;
              type: AccountType;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              id: string;
              slug: string;
              name: string | null;
              legalName: string | null;
              currency: Currency;
              imageUrl: string | null;
              website: string | null;
              settings: any;
              type: AccountType;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              id: string;
              slug: string;
              name: string | null;
              legalName: string | null;
              currency: Currency;
              imageUrl: string | null;
              website: string | null;
              settings: any;
              type: AccountType;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              id: string;
              slug: string;
              name: string | null;
              legalName: string | null;
              currency: Currency;
              imageUrl: string | null;
              website: string | null;
              settings: any;
              type: AccountType;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              id: string;
              slug: string;
              name: string | null;
              legalName: string | null;
              currency: Currency;
              imageUrl: string | null;
              website: string | null;
              settings: any;
              type: AccountType;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | null;
      }
    | null;
  amount: { valueInCents: number | null; currency: Currency | null };
  amountInHostCurrency: { valueInCents: number | null; currency: Currency | null };
  netAmount: { valueInCents: number | null; currency: Currency | null };
  taxAmount: { valueInCents: number | null; currency: Currency | null };
  taxInfo: { type: TaxType; rate: number } | null;
  paymentMethod: {
    id: string | null;
    type: PaymentMethodType | null;
    service: PaymentMethodService | null;
    name: string | null;
  } | null;
  fromAccount:
    | {
        id: string;
        slug: string;
        name: string | null;
        legalName: string | null;
        type: AccountType;
        settings: any;
        location: { name: string | null; address: string | null; country: string | null } | null;
      }
    | {
        id: string;
        slug: string;
        name: string | null;
        legalName: string | null;
        type: AccountType;
        settings: any;
        host: {
          id: string;
          name: string | null;
          legalName: string | null;
          slug: string;
          type: AccountType;
          expensePolicy: string | null;
          settings: any;
          location: { address: string | null; country: string | null } | null;
        } | null;
        location: { name: string | null; address: string | null; country: string | null } | null;
      }
    | {
        id: string;
        slug: string;
        name: string | null;
        legalName: string | null;
        type: AccountType;
        settings: any;
        host: {
          id: string;
          name: string | null;
          legalName: string | null;
          slug: string;
          type: AccountType;
          expensePolicy: string | null;
          settings: any;
          location: { address: string | null; country: string | null } | null;
        } | null;
        location: { name: string | null; address: string | null; country: string | null } | null;
      }
    | {
        id: string;
        slug: string;
        name: string | null;
        legalName: string | null;
        type: AccountType;
        settings: any;
        host: {
          id: string;
          name: string | null;
          legalName: string | null;
          slug: string;
          type: AccountType;
          expensePolicy: string | null;
          settings: any;
          location: { address: string | null; country: string | null } | null;
        } | null;
        location: { name: string | null; address: string | null; country: string | null } | null;
      }
    | {
        id: string;
        slug: string;
        name: string | null;
        legalName: string | null;
        type: AccountType;
        settings: any;
        location: { name: string | null; address: string | null; country: string | null } | null;
      }
    | {
        id: string;
        slug: string;
        name: string | null;
        legalName: string | null;
        type: AccountType;
        settings: any;
        location: { name: string | null; address: string | null; country: string | null } | null;
      }
    | {
        id: string;
        slug: string;
        name: string | null;
        legalName: string | null;
        type: AccountType;
        settings: any;
        location: { name: string | null; address: string | null; country: string | null } | null;
      }
    | {
        id: string;
        slug: string;
        name: string | null;
        legalName: string | null;
        type: AccountType;
        settings: any;
        host: {
          id: string;
          name: string | null;
          legalName: string | null;
          slug: string;
          type: AccountType;
          expensePolicy: string | null;
          settings: any;
          location: { address: string | null; country: string | null } | null;
        } | null;
        location: { name: string | null; address: string | null; country: string | null } | null;
      }
    | {
        id: string;
        slug: string;
        name: string | null;
        legalName: string | null;
        type: AccountType;
        settings: any;
        host: {
          id: string;
          name: string | null;
          legalName: string | null;
          slug: string;
          type: AccountType;
          expensePolicy: string | null;
          settings: any;
          location: { address: string | null; country: string | null } | null;
        } | null;
        location: { name: string | null; address: string | null; country: string | null } | null;
      }
    | {
        id: string;
        slug: string;
        name: string | null;
        legalName: string | null;
        type: AccountType;
        settings: any;
        location: { name: string | null; address: string | null; country: string | null } | null;
      }
    | null;
  toAccount:
    | {
        id: string;
        slug: string;
        legalName: string | null;
        name: string | null;
        type: AccountType;
        settings: any;
        location: { name: string | null; address: string | null; country: string | null } | null;
      }
    | {
        id: string;
        slug: string;
        legalName: string | null;
        name: string | null;
        type: AccountType;
        settings: any;
        location: { name: string | null; address: string | null; country: string | null } | null;
      }
    | {
        startsAt: any;
        endsAt: any;
        timezone: string | null;
        id: string;
        slug: string;
        legalName: string | null;
        name: string | null;
        type: AccountType;
        settings: any;
        location: { name: string | null; address: string | null; country: string | null } | null;
      }
    | {
        id: string;
        slug: string;
        legalName: string | null;
        name: string | null;
        type: AccountType;
        settings: any;
        location: { name: string | null; address: string | null; country: string | null } | null;
      }
    | {
        id: string;
        slug: string;
        legalName: string | null;
        name: string | null;
        type: AccountType;
        settings: any;
        location: { name: string | null; address: string | null; country: string | null } | null;
      }
    | {
        id: string;
        slug: string;
        legalName: string | null;
        name: string | null;
        type: AccountType;
        settings: any;
        location: { name: string | null; address: string | null; country: string | null } | null;
      }
    | {
        id: string;
        slug: string;
        legalName: string | null;
        name: string | null;
        type: AccountType;
        settings: any;
        location: { name: string | null; address: string | null; country: string | null } | null;
      }
    | {
        id: string;
        slug: string;
        legalName: string | null;
        name: string | null;
        type: AccountType;
        settings: any;
        location: { name: string | null; address: string | null; country: string | null } | null;
      }
    | {
        id: string;
        slug: string;
        legalName: string | null;
        name: string | null;
        type: AccountType;
        settings: any;
        location: { name: string | null; address: string | null; country: string | null } | null;
      }
    | {
        id: string;
        slug: string;
        legalName: string | null;
        name: string | null;
        type: AccountType;
        settings: any;
        location: { name: string | null; address: string | null; country: string | null } | null;
      }
    | null;
  giftCardEmitterAccount:
    | { id: string; slug: string; name: string | null; legalName: string | null; type: AccountType }
    | { id: string; slug: string; name: string | null; legalName: string | null; type: AccountType }
    | { id: string; slug: string; name: string | null; legalName: string | null; type: AccountType }
    | { id: string; slug: string; name: string | null; legalName: string | null; type: AccountType }
    | { id: string; slug: string; name: string | null; legalName: string | null; type: AccountType }
    | { id: string; slug: string; name: string | null; legalName: string | null; type: AccountType }
    | { id: string; slug: string; name: string | null; legalName: string | null; type: AccountType }
    | { id: string; slug: string; name: string | null; legalName: string | null; type: AccountType }
    | { id: string; slug: string; name: string | null; legalName: string | null; type: AccountType }
    | { id: string; slug: string; name: string | null; legalName: string | null; type: AccountType }
    | null;
  refundTransaction: { id: string } | { id: string } | null;
  order: {
    id: string;
    legacyId: number;
    data: any;
    quantity: number | null;
    tax: { id: string; type: TaxType; rate: number; percentage: number } | null;
    tier: { id: string; type: TierType; invoiceTemplate: string | null } | null;
  } | null;
};

type ReceiptTransactionFragment_Debit_Fragment = {
  id: string;
  type: TransactionType;
  kind: TransactionKind | null;
  createdAt: any;
  clearedAt: any;
  description: string | null;
  hostCurrencyFxRate: number | null;
  invoiceTemplate: string | null;
  isRefund: boolean | null;
  host:
    | {
        id: string;
        slug: string;
        name: string | null;
        legalName: string | null;
        currency: Currency;
        imageUrl: string | null;
        website: string | null;
        settings: any;
        type: AccountType;
        location: { name: string | null; address: string | null; country: string | null } | null;
      }
    | {
        id: string;
        slug: string;
        name: string | null;
        legalName: string | null;
        currency: Currency;
        imageUrl: string | null;
        website: string | null;
        settings: any;
        type: AccountType;
        location: { name: string | null; address: string | null; country: string | null } | null;
      }
    | {
        id: string;
        slug: string;
        name: string | null;
        legalName: string | null;
        currency: Currency;
        imageUrl: string | null;
        website: string | null;
        settings: any;
        type: AccountType;
        location: { name: string | null; address: string | null; country: string | null } | null;
      }
    | {
        id: string;
        slug: string;
        name: string | null;
        legalName: string | null;
        currency: Currency;
        imageUrl: string | null;
        website: string | null;
        settings: any;
        type: AccountType;
        location: { name: string | null; address: string | null; country: string | null } | null;
      }
    | {
        id: string;
        slug: string;
        name: string | null;
        legalName: string | null;
        currency: Currency;
        imageUrl: string | null;
        website: string | null;
        settings: any;
        type: AccountType;
        location: { name: string | null; address: string | null; country: string | null } | null;
      }
    | {
        id: string;
        slug: string;
        name: string | null;
        legalName: string | null;
        currency: Currency;
        imageUrl: string | null;
        website: string | null;
        settings: any;
        type: AccountType;
        location: { name: string | null; address: string | null; country: string | null } | null;
      }
    | {
        id: string;
        slug: string;
        name: string | null;
        legalName: string | null;
        currency: Currency;
        imageUrl: string | null;
        website: string | null;
        settings: any;
        type: AccountType;
        location: { name: string | null; address: string | null; country: string | null } | null;
      }
    | {
        id: string;
        slug: string;
        name: string | null;
        legalName: string | null;
        currency: Currency;
        imageUrl: string | null;
        website: string | null;
        settings: any;
        type: AccountType;
        location: { name: string | null; address: string | null; country: string | null } | null;
      }
    | {
        id: string;
        slug: string;
        name: string | null;
        legalName: string | null;
        currency: Currency;
        imageUrl: string | null;
        website: string | null;
        settings: any;
        type: AccountType;
        location: { name: string | null; address: string | null; country: string | null } | null;
      }
    | {
        id: string;
        slug: string;
        name: string | null;
        legalName: string | null;
        currency: Currency;
        imageUrl: string | null;
        website: string | null;
        settings: any;
        type: AccountType;
        location: { name: string | null; address: string | null; country: string | null } | null;
      }
    | null;
  oppositeTransaction:
    | {
        host:
          | {
              id: string;
              slug: string;
              name: string | null;
              legalName: string | null;
              currency: Currency;
              imageUrl: string | null;
              website: string | null;
              settings: any;
              type: AccountType;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              id: string;
              slug: string;
              name: string | null;
              legalName: string | null;
              currency: Currency;
              imageUrl: string | null;
              website: string | null;
              settings: any;
              type: AccountType;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              id: string;
              slug: string;
              name: string | null;
              legalName: string | null;
              currency: Currency;
              imageUrl: string | null;
              website: string | null;
              settings: any;
              type: AccountType;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              id: string;
              slug: string;
              name: string | null;
              legalName: string | null;
              currency: Currency;
              imageUrl: string | null;
              website: string | null;
              settings: any;
              type: AccountType;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              id: string;
              slug: string;
              name: string | null;
              legalName: string | null;
              currency: Currency;
              imageUrl: string | null;
              website: string | null;
              settings: any;
              type: AccountType;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              id: string;
              slug: string;
              name: string | null;
              legalName: string | null;
              currency: Currency;
              imageUrl: string | null;
              website: string | null;
              settings: any;
              type: AccountType;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              id: string;
              slug: string;
              name: string | null;
              legalName: string | null;
              currency: Currency;
              imageUrl: string | null;
              website: string | null;
              settings: any;
              type: AccountType;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              id: string;
              slug: string;
              name: string | null;
              legalName: string | null;
              currency: Currency;
              imageUrl: string | null;
              website: string | null;
              settings: any;
              type: AccountType;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              id: string;
              slug: string;
              name: string | null;
              legalName: string | null;
              currency: Currency;
              imageUrl: string | null;
              website: string | null;
              settings: any;
              type: AccountType;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              id: string;
              slug: string;
              name: string | null;
              legalName: string | null;
              currency: Currency;
              imageUrl: string | null;
              website: string | null;
              settings: any;
              type: AccountType;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | null;
      }
    | {
        host:
          | {
              id: string;
              slug: string;
              name: string | null;
              legalName: string | null;
              currency: Currency;
              imageUrl: string | null;
              website: string | null;
              settings: any;
              type: AccountType;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              id: string;
              slug: string;
              name: string | null;
              legalName: string | null;
              currency: Currency;
              imageUrl: string | null;
              website: string | null;
              settings: any;
              type: AccountType;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              id: string;
              slug: string;
              name: string | null;
              legalName: string | null;
              currency: Currency;
              imageUrl: string | null;
              website: string | null;
              settings: any;
              type: AccountType;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              id: string;
              slug: string;
              name: string | null;
              legalName: string | null;
              currency: Currency;
              imageUrl: string | null;
              website: string | null;
              settings: any;
              type: AccountType;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              id: string;
              slug: string;
              name: string | null;
              legalName: string | null;
              currency: Currency;
              imageUrl: string | null;
              website: string | null;
              settings: any;
              type: AccountType;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              id: string;
              slug: string;
              name: string | null;
              legalName: string | null;
              currency: Currency;
              imageUrl: string | null;
              website: string | null;
              settings: any;
              type: AccountType;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              id: string;
              slug: string;
              name: string | null;
              legalName: string | null;
              currency: Currency;
              imageUrl: string | null;
              website: string | null;
              settings: any;
              type: AccountType;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              id: string;
              slug: string;
              name: string | null;
              legalName: string | null;
              currency: Currency;
              imageUrl: string | null;
              website: string | null;
              settings: any;
              type: AccountType;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              id: string;
              slug: string;
              name: string | null;
              legalName: string | null;
              currency: Currency;
              imageUrl: string | null;
              website: string | null;
              settings: any;
              type: AccountType;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              id: string;
              slug: string;
              name: string | null;
              legalName: string | null;
              currency: Currency;
              imageUrl: string | null;
              website: string | null;
              settings: any;
              type: AccountType;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | null;
      }
    | null;
  amount: { valueInCents: number | null; currency: Currency | null };
  amountInHostCurrency: { valueInCents: number | null; currency: Currency | null };
  netAmount: { valueInCents: number | null; currency: Currency | null };
  taxAmount: { valueInCents: number | null; currency: Currency | null };
  taxInfo: { type: TaxType; rate: number } | null;
  paymentMethod: {
    id: string | null;
    type: PaymentMethodType | null;
    service: PaymentMethodService | null;
    name: string | null;
  } | null;
  fromAccount:
    | {
        id: string;
        slug: string;
        name: string | null;
        legalName: string | null;
        type: AccountType;
        settings: any;
        location: { name: string | null; address: string | null; country: string | null } | null;
      }
    | {
        id: string;
        slug: string;
        name: string | null;
        legalName: string | null;
        type: AccountType;
        settings: any;
        host: {
          id: string;
          name: string | null;
          legalName: string | null;
          slug: string;
          type: AccountType;
          expensePolicy: string | null;
          settings: any;
          location: { address: string | null; country: string | null } | null;
        } | null;
        location: { name: string | null; address: string | null; country: string | null } | null;
      }
    | {
        id: string;
        slug: string;
        name: string | null;
        legalName: string | null;
        type: AccountType;
        settings: any;
        host: {
          id: string;
          name: string | null;
          legalName: string | null;
          slug: string;
          type: AccountType;
          expensePolicy: string | null;
          settings: any;
          location: { address: string | null; country: string | null } | null;
        } | null;
        location: { name: string | null; address: string | null; country: string | null } | null;
      }
    | {
        id: string;
        slug: string;
        name: string | null;
        legalName: string | null;
        type: AccountType;
        settings: any;
        host: {
          id: string;
          name: string | null;
          legalName: string | null;
          slug: string;
          type: AccountType;
          expensePolicy: string | null;
          settings: any;
          location: { address: string | null; country: string | null } | null;
        } | null;
        location: { name: string | null; address: string | null; country: string | null } | null;
      }
    | {
        id: string;
        slug: string;
        name: string | null;
        legalName: string | null;
        type: AccountType;
        settings: any;
        location: { name: string | null; address: string | null; country: string | null } | null;
      }
    | {
        id: string;
        slug: string;
        name: string | null;
        legalName: string | null;
        type: AccountType;
        settings: any;
        location: { name: string | null; address: string | null; country: string | null } | null;
      }
    | {
        id: string;
        slug: string;
        name: string | null;
        legalName: string | null;
        type: AccountType;
        settings: any;
        location: { name: string | null; address: string | null; country: string | null } | null;
      }
    | {
        id: string;
        slug: string;
        name: string | null;
        legalName: string | null;
        type: AccountType;
        settings: any;
        host: {
          id: string;
          name: string | null;
          legalName: string | null;
          slug: string;
          type: AccountType;
          expensePolicy: string | null;
          settings: any;
          location: { address: string | null; country: string | null } | null;
        } | null;
        location: { name: string | null; address: string | null; country: string | null } | null;
      }
    | {
        id: string;
        slug: string;
        name: string | null;
        legalName: string | null;
        type: AccountType;
        settings: any;
        host: {
          id: string;
          name: string | null;
          legalName: string | null;
          slug: string;
          type: AccountType;
          expensePolicy: string | null;
          settings: any;
          location: { address: string | null; country: string | null } | null;
        } | null;
        location: { name: string | null; address: string | null; country: string | null } | null;
      }
    | {
        id: string;
        slug: string;
        name: string | null;
        legalName: string | null;
        type: AccountType;
        settings: any;
        location: { name: string | null; address: string | null; country: string | null } | null;
      }
    | null;
  toAccount:
    | {
        id: string;
        slug: string;
        legalName: string | null;
        name: string | null;
        type: AccountType;
        settings: any;
        location: { name: string | null; address: string | null; country: string | null } | null;
      }
    | {
        id: string;
        slug: string;
        legalName: string | null;
        name: string | null;
        type: AccountType;
        settings: any;
        location: { name: string | null; address: string | null; country: string | null } | null;
      }
    | {
        startsAt: any;
        endsAt: any;
        timezone: string | null;
        id: string;
        slug: string;
        legalName: string | null;
        name: string | null;
        type: AccountType;
        settings: any;
        location: { name: string | null; address: string | null; country: string | null } | null;
      }
    | {
        id: string;
        slug: string;
        legalName: string | null;
        name: string | null;
        type: AccountType;
        settings: any;
        location: { name: string | null; address: string | null; country: string | null } | null;
      }
    | {
        id: string;
        slug: string;
        legalName: string | null;
        name: string | null;
        type: AccountType;
        settings: any;
        location: { name: string | null; address: string | null; country: string | null } | null;
      }
    | {
        id: string;
        slug: string;
        legalName: string | null;
        name: string | null;
        type: AccountType;
        settings: any;
        location: { name: string | null; address: string | null; country: string | null } | null;
      }
    | {
        id: string;
        slug: string;
        legalName: string | null;
        name: string | null;
        type: AccountType;
        settings: any;
        location: { name: string | null; address: string | null; country: string | null } | null;
      }
    | {
        id: string;
        slug: string;
        legalName: string | null;
        name: string | null;
        type: AccountType;
        settings: any;
        location: { name: string | null; address: string | null; country: string | null } | null;
      }
    | {
        id: string;
        slug: string;
        legalName: string | null;
        name: string | null;
        type: AccountType;
        settings: any;
        location: { name: string | null; address: string | null; country: string | null } | null;
      }
    | {
        id: string;
        slug: string;
        legalName: string | null;
        name: string | null;
        type: AccountType;
        settings: any;
        location: { name: string | null; address: string | null; country: string | null } | null;
      }
    | null;
  giftCardEmitterAccount:
    | { id: string; slug: string; name: string | null; legalName: string | null; type: AccountType }
    | { id: string; slug: string; name: string | null; legalName: string | null; type: AccountType }
    | { id: string; slug: string; name: string | null; legalName: string | null; type: AccountType }
    | { id: string; slug: string; name: string | null; legalName: string | null; type: AccountType }
    | { id: string; slug: string; name: string | null; legalName: string | null; type: AccountType }
    | { id: string; slug: string; name: string | null; legalName: string | null; type: AccountType }
    | { id: string; slug: string; name: string | null; legalName: string | null; type: AccountType }
    | { id: string; slug: string; name: string | null; legalName: string | null; type: AccountType }
    | { id: string; slug: string; name: string | null; legalName: string | null; type: AccountType }
    | { id: string; slug: string; name: string | null; legalName: string | null; type: AccountType }
    | null;
  refundTransaction: { id: string } | { id: string } | null;
  order: {
    id: string;
    legacyId: number;
    data: any;
    quantity: number | null;
    tax: { id: string; type: TaxType; rate: number; percentage: number } | null;
    tier: { id: string; type: TierType; invoiceTemplate: string | null } | null;
  } | null;
};

export type ReceiptTransactionFragmentFragment =
  ReceiptTransactionFragment_Credit_Fragment | ReceiptTransactionFragment_Debit_Fragment;

export type TransactionInvoiceQueryVariables = Exact<{
  transactionId: string;
}>;

export type TransactionInvoiceQuery = {
  transaction:
    | {
        id: string;
        type: TransactionType;
        kind: TransactionKind | null;
        createdAt: any;
        clearedAt: any;
        description: string | null;
        hostCurrencyFxRate: number | null;
        invoiceTemplate: string | null;
        isRefund: boolean | null;
        permissions: { canDownloadInvoice: boolean };
        host:
          | {
              id: string;
              slug: string;
              name: string | null;
              legalName: string | null;
              currency: Currency;
              imageUrl: string | null;
              website: string | null;
              settings: any;
              type: AccountType;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              id: string;
              slug: string;
              name: string | null;
              legalName: string | null;
              currency: Currency;
              imageUrl: string | null;
              website: string | null;
              settings: any;
              type: AccountType;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              id: string;
              slug: string;
              name: string | null;
              legalName: string | null;
              currency: Currency;
              imageUrl: string | null;
              website: string | null;
              settings: any;
              type: AccountType;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              id: string;
              slug: string;
              name: string | null;
              legalName: string | null;
              currency: Currency;
              imageUrl: string | null;
              website: string | null;
              settings: any;
              type: AccountType;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              id: string;
              slug: string;
              name: string | null;
              legalName: string | null;
              currency: Currency;
              imageUrl: string | null;
              website: string | null;
              settings: any;
              type: AccountType;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              id: string;
              slug: string;
              name: string | null;
              legalName: string | null;
              currency: Currency;
              imageUrl: string | null;
              website: string | null;
              settings: any;
              type: AccountType;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              id: string;
              slug: string;
              name: string | null;
              legalName: string | null;
              currency: Currency;
              imageUrl: string | null;
              website: string | null;
              settings: any;
              type: AccountType;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              id: string;
              slug: string;
              name: string | null;
              legalName: string | null;
              currency: Currency;
              imageUrl: string | null;
              website: string | null;
              settings: any;
              type: AccountType;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              id: string;
              slug: string;
              name: string | null;
              legalName: string | null;
              currency: Currency;
              imageUrl: string | null;
              website: string | null;
              settings: any;
              type: AccountType;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              id: string;
              slug: string;
              name: string | null;
              legalName: string | null;
              currency: Currency;
              imageUrl: string | null;
              website: string | null;
              settings: any;
              type: AccountType;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | null;
        oppositeTransaction:
          | {
              host:
                | {
                    id: string;
                    slug: string;
                    name: string | null;
                    legalName: string | null;
                    currency: Currency;
                    imageUrl: string | null;
                    website: string | null;
                    settings: any;
                    type: AccountType;
                    location: { name: string | null; address: string | null; country: string | null } | null;
                  }
                | {
                    id: string;
                    slug: string;
                    name: string | null;
                    legalName: string | null;
                    currency: Currency;
                    imageUrl: string | null;
                    website: string | null;
                    settings: any;
                    type: AccountType;
                    location: { name: string | null; address: string | null; country: string | null } | null;
                  }
                | {
                    id: string;
                    slug: string;
                    name: string | null;
                    legalName: string | null;
                    currency: Currency;
                    imageUrl: string | null;
                    website: string | null;
                    settings: any;
                    type: AccountType;
                    location: { name: string | null; address: string | null; country: string | null } | null;
                  }
                | {
                    id: string;
                    slug: string;
                    name: string | null;
                    legalName: string | null;
                    currency: Currency;
                    imageUrl: string | null;
                    website: string | null;
                    settings: any;
                    type: AccountType;
                    location: { name: string | null; address: string | null; country: string | null } | null;
                  }
                | {
                    id: string;
                    slug: string;
                    name: string | null;
                    legalName: string | null;
                    currency: Currency;
                    imageUrl: string | null;
                    website: string | null;
                    settings: any;
                    type: AccountType;
                    location: { name: string | null; address: string | null; country: string | null } | null;
                  }
                | {
                    id: string;
                    slug: string;
                    name: string | null;
                    legalName: string | null;
                    currency: Currency;
                    imageUrl: string | null;
                    website: string | null;
                    settings: any;
                    type: AccountType;
                    location: { name: string | null; address: string | null; country: string | null } | null;
                  }
                | {
                    id: string;
                    slug: string;
                    name: string | null;
                    legalName: string | null;
                    currency: Currency;
                    imageUrl: string | null;
                    website: string | null;
                    settings: any;
                    type: AccountType;
                    location: { name: string | null; address: string | null; country: string | null } | null;
                  }
                | {
                    id: string;
                    slug: string;
                    name: string | null;
                    legalName: string | null;
                    currency: Currency;
                    imageUrl: string | null;
                    website: string | null;
                    settings: any;
                    type: AccountType;
                    location: { name: string | null; address: string | null; country: string | null } | null;
                  }
                | {
                    id: string;
                    slug: string;
                    name: string | null;
                    legalName: string | null;
                    currency: Currency;
                    imageUrl: string | null;
                    website: string | null;
                    settings: any;
                    type: AccountType;
                    location: { name: string | null; address: string | null; country: string | null } | null;
                  }
                | {
                    id: string;
                    slug: string;
                    name: string | null;
                    legalName: string | null;
                    currency: Currency;
                    imageUrl: string | null;
                    website: string | null;
                    settings: any;
                    type: AccountType;
                    location: { name: string | null; address: string | null; country: string | null } | null;
                  }
                | null;
            }
          | {
              host:
                | {
                    id: string;
                    slug: string;
                    name: string | null;
                    legalName: string | null;
                    currency: Currency;
                    imageUrl: string | null;
                    website: string | null;
                    settings: any;
                    type: AccountType;
                    location: { name: string | null; address: string | null; country: string | null } | null;
                  }
                | {
                    id: string;
                    slug: string;
                    name: string | null;
                    legalName: string | null;
                    currency: Currency;
                    imageUrl: string | null;
                    website: string | null;
                    settings: any;
                    type: AccountType;
                    location: { name: string | null; address: string | null; country: string | null } | null;
                  }
                | {
                    id: string;
                    slug: string;
                    name: string | null;
                    legalName: string | null;
                    currency: Currency;
                    imageUrl: string | null;
                    website: string | null;
                    settings: any;
                    type: AccountType;
                    location: { name: string | null; address: string | null; country: string | null } | null;
                  }
                | {
                    id: string;
                    slug: string;
                    name: string | null;
                    legalName: string | null;
                    currency: Currency;
                    imageUrl: string | null;
                    website: string | null;
                    settings: any;
                    type: AccountType;
                    location: { name: string | null; address: string | null; country: string | null } | null;
                  }
                | {
                    id: string;
                    slug: string;
                    name: string | null;
                    legalName: string | null;
                    currency: Currency;
                    imageUrl: string | null;
                    website: string | null;
                    settings: any;
                    type: AccountType;
                    location: { name: string | null; address: string | null; country: string | null } | null;
                  }
                | {
                    id: string;
                    slug: string;
                    name: string | null;
                    legalName: string | null;
                    currency: Currency;
                    imageUrl: string | null;
                    website: string | null;
                    settings: any;
                    type: AccountType;
                    location: { name: string | null; address: string | null; country: string | null } | null;
                  }
                | {
                    id: string;
                    slug: string;
                    name: string | null;
                    legalName: string | null;
                    currency: Currency;
                    imageUrl: string | null;
                    website: string | null;
                    settings: any;
                    type: AccountType;
                    location: { name: string | null; address: string | null; country: string | null } | null;
                  }
                | {
                    id: string;
                    slug: string;
                    name: string | null;
                    legalName: string | null;
                    currency: Currency;
                    imageUrl: string | null;
                    website: string | null;
                    settings: any;
                    type: AccountType;
                    location: { name: string | null; address: string | null; country: string | null } | null;
                  }
                | {
                    id: string;
                    slug: string;
                    name: string | null;
                    legalName: string | null;
                    currency: Currency;
                    imageUrl: string | null;
                    website: string | null;
                    settings: any;
                    type: AccountType;
                    location: { name: string | null; address: string | null; country: string | null } | null;
                  }
                | {
                    id: string;
                    slug: string;
                    name: string | null;
                    legalName: string | null;
                    currency: Currency;
                    imageUrl: string | null;
                    website: string | null;
                    settings: any;
                    type: AccountType;
                    location: { name: string | null; address: string | null; country: string | null } | null;
                  }
                | null;
            }
          | null;
        amount: { valueInCents: number | null; currency: Currency | null };
        amountInHostCurrency: { valueInCents: number | null; currency: Currency | null };
        netAmount: { valueInCents: number | null; currency: Currency | null };
        taxAmount: { valueInCents: number | null; currency: Currency | null };
        taxInfo: { type: TaxType; rate: number } | null;
        paymentMethod: {
          id: string | null;
          type: PaymentMethodType | null;
          service: PaymentMethodService | null;
          name: string | null;
        } | null;
        fromAccount:
          | {
              id: string;
              slug: string;
              name: string | null;
              legalName: string | null;
              type: AccountType;
              settings: any;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              id: string;
              slug: string;
              name: string | null;
              legalName: string | null;
              type: AccountType;
              settings: any;
              host: {
                id: string;
                name: string | null;
                legalName: string | null;
                slug: string;
                type: AccountType;
                expensePolicy: string | null;
                settings: any;
                location: { address: string | null; country: string | null } | null;
              } | null;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              id: string;
              slug: string;
              name: string | null;
              legalName: string | null;
              type: AccountType;
              settings: any;
              host: {
                id: string;
                name: string | null;
                legalName: string | null;
                slug: string;
                type: AccountType;
                expensePolicy: string | null;
                settings: any;
                location: { address: string | null; country: string | null } | null;
              } | null;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              id: string;
              slug: string;
              name: string | null;
              legalName: string | null;
              type: AccountType;
              settings: any;
              host: {
                id: string;
                name: string | null;
                legalName: string | null;
                slug: string;
                type: AccountType;
                expensePolicy: string | null;
                settings: any;
                location: { address: string | null; country: string | null } | null;
              } | null;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              id: string;
              slug: string;
              name: string | null;
              legalName: string | null;
              type: AccountType;
              settings: any;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              id: string;
              slug: string;
              name: string | null;
              legalName: string | null;
              type: AccountType;
              settings: any;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              id: string;
              slug: string;
              name: string | null;
              legalName: string | null;
              type: AccountType;
              settings: any;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              id: string;
              slug: string;
              name: string | null;
              legalName: string | null;
              type: AccountType;
              settings: any;
              host: {
                id: string;
                name: string | null;
                legalName: string | null;
                slug: string;
                type: AccountType;
                expensePolicy: string | null;
                settings: any;
                location: { address: string | null; country: string | null } | null;
              } | null;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              id: string;
              slug: string;
              name: string | null;
              legalName: string | null;
              type: AccountType;
              settings: any;
              host: {
                id: string;
                name: string | null;
                legalName: string | null;
                slug: string;
                type: AccountType;
                expensePolicy: string | null;
                settings: any;
                location: { address: string | null; country: string | null } | null;
              } | null;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              id: string;
              slug: string;
              name: string | null;
              legalName: string | null;
              type: AccountType;
              settings: any;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | null;
        toAccount:
          | {
              id: string;
              slug: string;
              legalName: string | null;
              name: string | null;
              type: AccountType;
              settings: any;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              id: string;
              slug: string;
              legalName: string | null;
              name: string | null;
              type: AccountType;
              settings: any;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              startsAt: any;
              endsAt: any;
              timezone: string | null;
              id: string;
              slug: string;
              legalName: string | null;
              name: string | null;
              type: AccountType;
              settings: any;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              id: string;
              slug: string;
              legalName: string | null;
              name: string | null;
              type: AccountType;
              settings: any;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              id: string;
              slug: string;
              legalName: string | null;
              name: string | null;
              type: AccountType;
              settings: any;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              id: string;
              slug: string;
              legalName: string | null;
              name: string | null;
              type: AccountType;
              settings: any;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              id: string;
              slug: string;
              legalName: string | null;
              name: string | null;
              type: AccountType;
              settings: any;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              id: string;
              slug: string;
              legalName: string | null;
              name: string | null;
              type: AccountType;
              settings: any;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              id: string;
              slug: string;
              legalName: string | null;
              name: string | null;
              type: AccountType;
              settings: any;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              id: string;
              slug: string;
              legalName: string | null;
              name: string | null;
              type: AccountType;
              settings: any;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | null;
        giftCardEmitterAccount:
          | { id: string; slug: string; name: string | null; legalName: string | null; type: AccountType }
          | { id: string; slug: string; name: string | null; legalName: string | null; type: AccountType }
          | { id: string; slug: string; name: string | null; legalName: string | null; type: AccountType }
          | { id: string; slug: string; name: string | null; legalName: string | null; type: AccountType }
          | { id: string; slug: string; name: string | null; legalName: string | null; type: AccountType }
          | { id: string; slug: string; name: string | null; legalName: string | null; type: AccountType }
          | { id: string; slug: string; name: string | null; legalName: string | null; type: AccountType }
          | { id: string; slug: string; name: string | null; legalName: string | null; type: AccountType }
          | { id: string; slug: string; name: string | null; legalName: string | null; type: AccountType }
          | { id: string; slug: string; name: string | null; legalName: string | null; type: AccountType }
          | null;
        refundTransaction: { id: string } | { id: string } | null;
        order: {
          id: string;
          legacyId: number;
          data: any;
          quantity: number | null;
          tax: { id: string; type: TaxType; rate: number; percentage: number } | null;
          tier: { id: string; type: TierType; invoiceTemplate: string | null } | null;
        } | null;
      }
    | {
        id: string;
        type: TransactionType;
        kind: TransactionKind | null;
        createdAt: any;
        clearedAt: any;
        description: string | null;
        hostCurrencyFxRate: number | null;
        invoiceTemplate: string | null;
        isRefund: boolean | null;
        oppositeTransaction:
          | {
              id: string;
              type: TransactionType;
              kind: TransactionKind | null;
              createdAt: any;
              clearedAt: any;
              description: string | null;
              hostCurrencyFxRate: number | null;
              invoiceTemplate: string | null;
              isRefund: boolean | null;
              permissions: { canDownloadInvoice: boolean };
              host:
                | {
                    id: string;
                    slug: string;
                    name: string | null;
                    legalName: string | null;
                    currency: Currency;
                    imageUrl: string | null;
                    website: string | null;
                    settings: any;
                    type: AccountType;
                    location: { name: string | null; address: string | null; country: string | null } | null;
                  }
                | {
                    id: string;
                    slug: string;
                    name: string | null;
                    legalName: string | null;
                    currency: Currency;
                    imageUrl: string | null;
                    website: string | null;
                    settings: any;
                    type: AccountType;
                    location: { name: string | null; address: string | null; country: string | null } | null;
                  }
                | {
                    id: string;
                    slug: string;
                    name: string | null;
                    legalName: string | null;
                    currency: Currency;
                    imageUrl: string | null;
                    website: string | null;
                    settings: any;
                    type: AccountType;
                    location: { name: string | null; address: string | null; country: string | null } | null;
                  }
                | {
                    id: string;
                    slug: string;
                    name: string | null;
                    legalName: string | null;
                    currency: Currency;
                    imageUrl: string | null;
                    website: string | null;
                    settings: any;
                    type: AccountType;
                    location: { name: string | null; address: string | null; country: string | null } | null;
                  }
                | {
                    id: string;
                    slug: string;
                    name: string | null;
                    legalName: string | null;
                    currency: Currency;
                    imageUrl: string | null;
                    website: string | null;
                    settings: any;
                    type: AccountType;
                    location: { name: string | null; address: string | null; country: string | null } | null;
                  }
                | {
                    id: string;
                    slug: string;
                    name: string | null;
                    legalName: string | null;
                    currency: Currency;
                    imageUrl: string | null;
                    website: string | null;
                    settings: any;
                    type: AccountType;
                    location: { name: string | null; address: string | null; country: string | null } | null;
                  }
                | {
                    id: string;
                    slug: string;
                    name: string | null;
                    legalName: string | null;
                    currency: Currency;
                    imageUrl: string | null;
                    website: string | null;
                    settings: any;
                    type: AccountType;
                    location: { name: string | null; address: string | null; country: string | null } | null;
                  }
                | {
                    id: string;
                    slug: string;
                    name: string | null;
                    legalName: string | null;
                    currency: Currency;
                    imageUrl: string | null;
                    website: string | null;
                    settings: any;
                    type: AccountType;
                    location: { name: string | null; address: string | null; country: string | null } | null;
                  }
                | {
                    id: string;
                    slug: string;
                    name: string | null;
                    legalName: string | null;
                    currency: Currency;
                    imageUrl: string | null;
                    website: string | null;
                    settings: any;
                    type: AccountType;
                    location: { name: string | null; address: string | null; country: string | null } | null;
                  }
                | {
                    id: string;
                    slug: string;
                    name: string | null;
                    legalName: string | null;
                    currency: Currency;
                    imageUrl: string | null;
                    website: string | null;
                    settings: any;
                    type: AccountType;
                    location: { name: string | null; address: string | null; country: string | null } | null;
                  }
                | null;
              oppositeTransaction:
                | {
                    host:
                      | {
                          id: string;
                          slug: string;
                          name: string | null;
                          legalName: string | null;
                          currency: Currency;
                          imageUrl: string | null;
                          website: string | null;
                          settings: any;
                          type: AccountType;
                          location: { name: string | null; address: string | null; country: string | null } | null;
                        }
                      | {
                          id: string;
                          slug: string;
                          name: string | null;
                          legalName: string | null;
                          currency: Currency;
                          imageUrl: string | null;
                          website: string | null;
                          settings: any;
                          type: AccountType;
                          location: { name: string | null; address: string | null; country: string | null } | null;
                        }
                      | {
                          id: string;
                          slug: string;
                          name: string | null;
                          legalName: string | null;
                          currency: Currency;
                          imageUrl: string | null;
                          website: string | null;
                          settings: any;
                          type: AccountType;
                          location: { name: string | null; address: string | null; country: string | null } | null;
                        }
                      | {
                          id: string;
                          slug: string;
                          name: string | null;
                          legalName: string | null;
                          currency: Currency;
                          imageUrl: string | null;
                          website: string | null;
                          settings: any;
                          type: AccountType;
                          location: { name: string | null; address: string | null; country: string | null } | null;
                        }
                      | {
                          id: string;
                          slug: string;
                          name: string | null;
                          legalName: string | null;
                          currency: Currency;
                          imageUrl: string | null;
                          website: string | null;
                          settings: any;
                          type: AccountType;
                          location: { name: string | null; address: string | null; country: string | null } | null;
                        }
                      | {
                          id: string;
                          slug: string;
                          name: string | null;
                          legalName: string | null;
                          currency: Currency;
                          imageUrl: string | null;
                          website: string | null;
                          settings: any;
                          type: AccountType;
                          location: { name: string | null; address: string | null; country: string | null } | null;
                        }
                      | {
                          id: string;
                          slug: string;
                          name: string | null;
                          legalName: string | null;
                          currency: Currency;
                          imageUrl: string | null;
                          website: string | null;
                          settings: any;
                          type: AccountType;
                          location: { name: string | null; address: string | null; country: string | null } | null;
                        }
                      | {
                          id: string;
                          slug: string;
                          name: string | null;
                          legalName: string | null;
                          currency: Currency;
                          imageUrl: string | null;
                          website: string | null;
                          settings: any;
                          type: AccountType;
                          location: { name: string | null; address: string | null; country: string | null } | null;
                        }
                      | {
                          id: string;
                          slug: string;
                          name: string | null;
                          legalName: string | null;
                          currency: Currency;
                          imageUrl: string | null;
                          website: string | null;
                          settings: any;
                          type: AccountType;
                          location: { name: string | null; address: string | null; country: string | null } | null;
                        }
                      | {
                          id: string;
                          slug: string;
                          name: string | null;
                          legalName: string | null;
                          currency: Currency;
                          imageUrl: string | null;
                          website: string | null;
                          settings: any;
                          type: AccountType;
                          location: { name: string | null; address: string | null; country: string | null } | null;
                        }
                      | null;
                  }
                | {
                    host:
                      | {
                          id: string;
                          slug: string;
                          name: string | null;
                          legalName: string | null;
                          currency: Currency;
                          imageUrl: string | null;
                          website: string | null;
                          settings: any;
                          type: AccountType;
                          location: { name: string | null; address: string | null; country: string | null } | null;
                        }
                      | {
                          id: string;
                          slug: string;
                          name: string | null;
                          legalName: string | null;
                          currency: Currency;
                          imageUrl: string | null;
                          website: string | null;
                          settings: any;
                          type: AccountType;
                          location: { name: string | null; address: string | null; country: string | null } | null;
                        }
                      | {
                          id: string;
                          slug: string;
                          name: string | null;
                          legalName: string | null;
                          currency: Currency;
                          imageUrl: string | null;
                          website: string | null;
                          settings: any;
                          type: AccountType;
                          location: { name: string | null; address: string | null; country: string | null } | null;
                        }
                      | {
                          id: string;
                          slug: string;
                          name: string | null;
                          legalName: string | null;
                          currency: Currency;
                          imageUrl: string | null;
                          website: string | null;
                          settings: any;
                          type: AccountType;
                          location: { name: string | null; address: string | null; country: string | null } | null;
                        }
                      | {
                          id: string;
                          slug: string;
                          name: string | null;
                          legalName: string | null;
                          currency: Currency;
                          imageUrl: string | null;
                          website: string | null;
                          settings: any;
                          type: AccountType;
                          location: { name: string | null; address: string | null; country: string | null } | null;
                        }
                      | {
                          id: string;
                          slug: string;
                          name: string | null;
                          legalName: string | null;
                          currency: Currency;
                          imageUrl: string | null;
                          website: string | null;
                          settings: any;
                          type: AccountType;
                          location: { name: string | null; address: string | null; country: string | null } | null;
                        }
                      | {
                          id: string;
                          slug: string;
                          name: string | null;
                          legalName: string | null;
                          currency: Currency;
                          imageUrl: string | null;
                          website: string | null;
                          settings: any;
                          type: AccountType;
                          location: { name: string | null; address: string | null; country: string | null } | null;
                        }
                      | {
                          id: string;
                          slug: string;
                          name: string | null;
                          legalName: string | null;
                          currency: Currency;
                          imageUrl: string | null;
                          website: string | null;
                          settings: any;
                          type: AccountType;
                          location: { name: string | null; address: string | null; country: string | null } | null;
                        }
                      | {
                          id: string;
                          slug: string;
                          name: string | null;
                          legalName: string | null;
                          currency: Currency;
                          imageUrl: string | null;
                          website: string | null;
                          settings: any;
                          type: AccountType;
                          location: { name: string | null; address: string | null; country: string | null } | null;
                        }
                      | {
                          id: string;
                          slug: string;
                          name: string | null;
                          legalName: string | null;
                          currency: Currency;
                          imageUrl: string | null;
                          website: string | null;
                          settings: any;
                          type: AccountType;
                          location: { name: string | null; address: string | null; country: string | null } | null;
                        }
                      | null;
                  }
                | null;
              amount: { valueInCents: number | null; currency: Currency | null };
              amountInHostCurrency: { valueInCents: number | null; currency: Currency | null };
              netAmount: { valueInCents: number | null; currency: Currency | null };
              taxAmount: { valueInCents: number | null; currency: Currency | null };
              taxInfo: { type: TaxType; rate: number } | null;
              paymentMethod: {
                id: string | null;
                type: PaymentMethodType | null;
                service: PaymentMethodService | null;
                name: string | null;
              } | null;
              fromAccount:
                | {
                    id: string;
                    slug: string;
                    name: string | null;
                    legalName: string | null;
                    type: AccountType;
                    settings: any;
                    location: { name: string | null; address: string | null; country: string | null } | null;
                  }
                | {
                    id: string;
                    slug: string;
                    name: string | null;
                    legalName: string | null;
                    type: AccountType;
                    settings: any;
                    host: {
                      id: string;
                      name: string | null;
                      legalName: string | null;
                      slug: string;
                      type: AccountType;
                      expensePolicy: string | null;
                      settings: any;
                      location: { address: string | null; country: string | null } | null;
                    } | null;
                    location: { name: string | null; address: string | null; country: string | null } | null;
                  }
                | {
                    id: string;
                    slug: string;
                    name: string | null;
                    legalName: string | null;
                    type: AccountType;
                    settings: any;
                    host: {
                      id: string;
                      name: string | null;
                      legalName: string | null;
                      slug: string;
                      type: AccountType;
                      expensePolicy: string | null;
                      settings: any;
                      location: { address: string | null; country: string | null } | null;
                    } | null;
                    location: { name: string | null; address: string | null; country: string | null } | null;
                  }
                | {
                    id: string;
                    slug: string;
                    name: string | null;
                    legalName: string | null;
                    type: AccountType;
                    settings: any;
                    host: {
                      id: string;
                      name: string | null;
                      legalName: string | null;
                      slug: string;
                      type: AccountType;
                      expensePolicy: string | null;
                      settings: any;
                      location: { address: string | null; country: string | null } | null;
                    } | null;
                    location: { name: string | null; address: string | null; country: string | null } | null;
                  }
                | {
                    id: string;
                    slug: string;
                    name: string | null;
                    legalName: string | null;
                    type: AccountType;
                    settings: any;
                    location: { name: string | null; address: string | null; country: string | null } | null;
                  }
                | {
                    id: string;
                    slug: string;
                    name: string | null;
                    legalName: string | null;
                    type: AccountType;
                    settings: any;
                    location: { name: string | null; address: string | null; country: string | null } | null;
                  }
                | {
                    id: string;
                    slug: string;
                    name: string | null;
                    legalName: string | null;
                    type: AccountType;
                    settings: any;
                    location: { name: string | null; address: string | null; country: string | null } | null;
                  }
                | {
                    id: string;
                    slug: string;
                    name: string | null;
                    legalName: string | null;
                    type: AccountType;
                    settings: any;
                    host: {
                      id: string;
                      name: string | null;
                      legalName: string | null;
                      slug: string;
                      type: AccountType;
                      expensePolicy: string | null;
                      settings: any;
                      location: { address: string | null; country: string | null } | null;
                    } | null;
                    location: { name: string | null; address: string | null; country: string | null } | null;
                  }
                | {
                    id: string;
                    slug: string;
                    name: string | null;
                    legalName: string | null;
                    type: AccountType;
                    settings: any;
                    host: {
                      id: string;
                      name: string | null;
                      legalName: string | null;
                      slug: string;
                      type: AccountType;
                      expensePolicy: string | null;
                      settings: any;
                      location: { address: string | null; country: string | null } | null;
                    } | null;
                    location: { name: string | null; address: string | null; country: string | null } | null;
                  }
                | {
                    id: string;
                    slug: string;
                    name: string | null;
                    legalName: string | null;
                    type: AccountType;
                    settings: any;
                    location: { name: string | null; address: string | null; country: string | null } | null;
                  }
                | null;
              toAccount:
                | {
                    id: string;
                    slug: string;
                    legalName: string | null;
                    name: string | null;
                    type: AccountType;
                    settings: any;
                    location: { name: string | null; address: string | null; country: string | null } | null;
                  }
                | {
                    id: string;
                    slug: string;
                    legalName: string | null;
                    name: string | null;
                    type: AccountType;
                    settings: any;
                    location: { name: string | null; address: string | null; country: string | null } | null;
                  }
                | {
                    startsAt: any;
                    endsAt: any;
                    timezone: string | null;
                    id: string;
                    slug: string;
                    legalName: string | null;
                    name: string | null;
                    type: AccountType;
                    settings: any;
                    location: { name: string | null; address: string | null; country: string | null } | null;
                  }
                | {
                    id: string;
                    slug: string;
                    legalName: string | null;
                    name: string | null;
                    type: AccountType;
                    settings: any;
                    location: { name: string | null; address: string | null; country: string | null } | null;
                  }
                | {
                    id: string;
                    slug: string;
                    legalName: string | null;
                    name: string | null;
                    type: AccountType;
                    settings: any;
                    location: { name: string | null; address: string | null; country: string | null } | null;
                  }
                | {
                    id: string;
                    slug: string;
                    legalName: string | null;
                    name: string | null;
                    type: AccountType;
                    settings: any;
                    location: { name: string | null; address: string | null; country: string | null } | null;
                  }
                | {
                    id: string;
                    slug: string;
                    legalName: string | null;
                    name: string | null;
                    type: AccountType;
                    settings: any;
                    location: { name: string | null; address: string | null; country: string | null } | null;
                  }
                | {
                    id: string;
                    slug: string;
                    legalName: string | null;
                    name: string | null;
                    type: AccountType;
                    settings: any;
                    location: { name: string | null; address: string | null; country: string | null } | null;
                  }
                | {
                    id: string;
                    slug: string;
                    legalName: string | null;
                    name: string | null;
                    type: AccountType;
                    settings: any;
                    location: { name: string | null; address: string | null; country: string | null } | null;
                  }
                | {
                    id: string;
                    slug: string;
                    legalName: string | null;
                    name: string | null;
                    type: AccountType;
                    settings: any;
                    location: { name: string | null; address: string | null; country: string | null } | null;
                  }
                | null;
              giftCardEmitterAccount:
                | { id: string; slug: string; name: string | null; legalName: string | null; type: AccountType }
                | { id: string; slug: string; name: string | null; legalName: string | null; type: AccountType }
                | { id: string; slug: string; name: string | null; legalName: string | null; type: AccountType }
                | { id: string; slug: string; name: string | null; legalName: string | null; type: AccountType }
                | { id: string; slug: string; name: string | null; legalName: string | null; type: AccountType }
                | { id: string; slug: string; name: string | null; legalName: string | null; type: AccountType }
                | { id: string; slug: string; name: string | null; legalName: string | null; type: AccountType }
                | { id: string; slug: string; name: string | null; legalName: string | null; type: AccountType }
                | { id: string; slug: string; name: string | null; legalName: string | null; type: AccountType }
                | { id: string; slug: string; name: string | null; legalName: string | null; type: AccountType }
                | null;
              refundTransaction: { id: string } | { id: string } | null;
              order: {
                id: string;
                legacyId: number;
                data: any;
                quantity: number | null;
                tax: { id: string; type: TaxType; rate: number; percentage: number } | null;
                tier: { id: string; type: TierType; invoiceTemplate: string | null } | null;
              } | null;
            }
          | {
              id: string;
              type: TransactionType;
              kind: TransactionKind | null;
              createdAt: any;
              clearedAt: any;
              description: string | null;
              hostCurrencyFxRate: number | null;
              invoiceTemplate: string | null;
              isRefund: boolean | null;
              permissions: { canDownloadInvoice: boolean };
              host:
                | {
                    id: string;
                    slug: string;
                    name: string | null;
                    legalName: string | null;
                    currency: Currency;
                    imageUrl: string | null;
                    website: string | null;
                    settings: any;
                    type: AccountType;
                    location: { name: string | null; address: string | null; country: string | null } | null;
                  }
                | {
                    id: string;
                    slug: string;
                    name: string | null;
                    legalName: string | null;
                    currency: Currency;
                    imageUrl: string | null;
                    website: string | null;
                    settings: any;
                    type: AccountType;
                    location: { name: string | null; address: string | null; country: string | null } | null;
                  }
                | {
                    id: string;
                    slug: string;
                    name: string | null;
                    legalName: string | null;
                    currency: Currency;
                    imageUrl: string | null;
                    website: string | null;
                    settings: any;
                    type: AccountType;
                    location: { name: string | null; address: string | null; country: string | null } | null;
                  }
                | {
                    id: string;
                    slug: string;
                    name: string | null;
                    legalName: string | null;
                    currency: Currency;
                    imageUrl: string | null;
                    website: string | null;
                    settings: any;
                    type: AccountType;
                    location: { name: string | null; address: string | null; country: string | null } | null;
                  }
                | {
                    id: string;
                    slug: string;
                    name: string | null;
                    legalName: string | null;
                    currency: Currency;
                    imageUrl: string | null;
                    website: string | null;
                    settings: any;
                    type: AccountType;
                    location: { name: string | null; address: string | null; country: string | null } | null;
                  }
                | {
                    id: string;
                    slug: string;
                    name: string | null;
                    legalName: string | null;
                    currency: Currency;
                    imageUrl: string | null;
                    website: string | null;
                    settings: any;
                    type: AccountType;
                    location: { name: string | null; address: string | null; country: string | null } | null;
                  }
                | {
                    id: string;
                    slug: string;
                    name: string | null;
                    legalName: string | null;
                    currency: Currency;
                    imageUrl: string | null;
                    website: string | null;
                    settings: any;
                    type: AccountType;
                    location: { name: string | null; address: string | null; country: string | null } | null;
                  }
                | {
                    id: string;
                    slug: string;
                    name: string | null;
                    legalName: string | null;
                    currency: Currency;
                    imageUrl: string | null;
                    website: string | null;
                    settings: any;
                    type: AccountType;
                    location: { name: string | null; address: string | null; country: string | null } | null;
                  }
                | {
                    id: string;
                    slug: string;
                    name: string | null;
                    legalName: string | null;
                    currency: Currency;
                    imageUrl: string | null;
                    website: string | null;
                    settings: any;
                    type: AccountType;
                    location: { name: string | null; address: string | null; country: string | null } | null;
                  }
                | {
                    id: string;
                    slug: string;
                    name: string | null;
                    legalName: string | null;
                    currency: Currency;
                    imageUrl: string | null;
                    website: string | null;
                    settings: any;
                    type: AccountType;
                    location: { name: string | null; address: string | null; country: string | null } | null;
                  }
                | null;
              oppositeTransaction:
                | {
                    host:
                      | {
                          id: string;
                          slug: string;
                          name: string | null;
                          legalName: string | null;
                          currency: Currency;
                          imageUrl: string | null;
                          website: string | null;
                          settings: any;
                          type: AccountType;
                          location: { name: string | null; address: string | null; country: string | null } | null;
                        }
                      | {
                          id: string;
                          slug: string;
                          name: string | null;
                          legalName: string | null;
                          currency: Currency;
                          imageUrl: string | null;
                          website: string | null;
                          settings: any;
                          type: AccountType;
                          location: { name: string | null; address: string | null; country: string | null } | null;
                        }
                      | {
                          id: string;
                          slug: string;
                          name: string | null;
                          legalName: string | null;
                          currency: Currency;
                          imageUrl: string | null;
                          website: string | null;
                          settings: any;
                          type: AccountType;
                          location: { name: string | null; address: string | null; country: string | null } | null;
                        }
                      | {
                          id: string;
                          slug: string;
                          name: string | null;
                          legalName: string | null;
                          currency: Currency;
                          imageUrl: string | null;
                          website: string | null;
                          settings: any;
                          type: AccountType;
                          location: { name: string | null; address: string | null; country: string | null } | null;
                        }
                      | {
                          id: string;
                          slug: string;
                          name: string | null;
                          legalName: string | null;
                          currency: Currency;
                          imageUrl: string | null;
                          website: string | null;
                          settings: any;
                          type: AccountType;
                          location: { name: string | null; address: string | null; country: string | null } | null;
                        }
                      | {
                          id: string;
                          slug: string;
                          name: string | null;
                          legalName: string | null;
                          currency: Currency;
                          imageUrl: string | null;
                          website: string | null;
                          settings: any;
                          type: AccountType;
                          location: { name: string | null; address: string | null; country: string | null } | null;
                        }
                      | {
                          id: string;
                          slug: string;
                          name: string | null;
                          legalName: string | null;
                          currency: Currency;
                          imageUrl: string | null;
                          website: string | null;
                          settings: any;
                          type: AccountType;
                          location: { name: string | null; address: string | null; country: string | null } | null;
                        }
                      | {
                          id: string;
                          slug: string;
                          name: string | null;
                          legalName: string | null;
                          currency: Currency;
                          imageUrl: string | null;
                          website: string | null;
                          settings: any;
                          type: AccountType;
                          location: { name: string | null; address: string | null; country: string | null } | null;
                        }
                      | {
                          id: string;
                          slug: string;
                          name: string | null;
                          legalName: string | null;
                          currency: Currency;
                          imageUrl: string | null;
                          website: string | null;
                          settings: any;
                          type: AccountType;
                          location: { name: string | null; address: string | null; country: string | null } | null;
                        }
                      | {
                          id: string;
                          slug: string;
                          name: string | null;
                          legalName: string | null;
                          currency: Currency;
                          imageUrl: string | null;
                          website: string | null;
                          settings: any;
                          type: AccountType;
                          location: { name: string | null; address: string | null; country: string | null } | null;
                        }
                      | null;
                  }
                | {
                    host:
                      | {
                          id: string;
                          slug: string;
                          name: string | null;
                          legalName: string | null;
                          currency: Currency;
                          imageUrl: string | null;
                          website: string | null;
                          settings: any;
                          type: AccountType;
                          location: { name: string | null; address: string | null; country: string | null } | null;
                        }
                      | {
                          id: string;
                          slug: string;
                          name: string | null;
                          legalName: string | null;
                          currency: Currency;
                          imageUrl: string | null;
                          website: string | null;
                          settings: any;
                          type: AccountType;
                          location: { name: string | null; address: string | null; country: string | null } | null;
                        }
                      | {
                          id: string;
                          slug: string;
                          name: string | null;
                          legalName: string | null;
                          currency: Currency;
                          imageUrl: string | null;
                          website: string | null;
                          settings: any;
                          type: AccountType;
                          location: { name: string | null; address: string | null; country: string | null } | null;
                        }
                      | {
                          id: string;
                          slug: string;
                          name: string | null;
                          legalName: string | null;
                          currency: Currency;
                          imageUrl: string | null;
                          website: string | null;
                          settings: any;
                          type: AccountType;
                          location: { name: string | null; address: string | null; country: string | null } | null;
                        }
                      | {
                          id: string;
                          slug: string;
                          name: string | null;
                          legalName: string | null;
                          currency: Currency;
                          imageUrl: string | null;
                          website: string | null;
                          settings: any;
                          type: AccountType;
                          location: { name: string | null; address: string | null; country: string | null } | null;
                        }
                      | {
                          id: string;
                          slug: string;
                          name: string | null;
                          legalName: string | null;
                          currency: Currency;
                          imageUrl: string | null;
                          website: string | null;
                          settings: any;
                          type: AccountType;
                          location: { name: string | null; address: string | null; country: string | null } | null;
                        }
                      | {
                          id: string;
                          slug: string;
                          name: string | null;
                          legalName: string | null;
                          currency: Currency;
                          imageUrl: string | null;
                          website: string | null;
                          settings: any;
                          type: AccountType;
                          location: { name: string | null; address: string | null; country: string | null } | null;
                        }
                      | {
                          id: string;
                          slug: string;
                          name: string | null;
                          legalName: string | null;
                          currency: Currency;
                          imageUrl: string | null;
                          website: string | null;
                          settings: any;
                          type: AccountType;
                          location: { name: string | null; address: string | null; country: string | null } | null;
                        }
                      | {
                          id: string;
                          slug: string;
                          name: string | null;
                          legalName: string | null;
                          currency: Currency;
                          imageUrl: string | null;
                          website: string | null;
                          settings: any;
                          type: AccountType;
                          location: { name: string | null; address: string | null; country: string | null } | null;
                        }
                      | {
                          id: string;
                          slug: string;
                          name: string | null;
                          legalName: string | null;
                          currency: Currency;
                          imageUrl: string | null;
                          website: string | null;
                          settings: any;
                          type: AccountType;
                          location: { name: string | null; address: string | null; country: string | null } | null;
                        }
                      | null;
                  }
                | null;
              amount: { valueInCents: number | null; currency: Currency | null };
              amountInHostCurrency: { valueInCents: number | null; currency: Currency | null };
              netAmount: { valueInCents: number | null; currency: Currency | null };
              taxAmount: { valueInCents: number | null; currency: Currency | null };
              taxInfo: { type: TaxType; rate: number } | null;
              paymentMethod: {
                id: string | null;
                type: PaymentMethodType | null;
                service: PaymentMethodService | null;
                name: string | null;
              } | null;
              fromAccount:
                | {
                    id: string;
                    slug: string;
                    name: string | null;
                    legalName: string | null;
                    type: AccountType;
                    settings: any;
                    location: { name: string | null; address: string | null; country: string | null } | null;
                  }
                | {
                    id: string;
                    slug: string;
                    name: string | null;
                    legalName: string | null;
                    type: AccountType;
                    settings: any;
                    host: {
                      id: string;
                      name: string | null;
                      legalName: string | null;
                      slug: string;
                      type: AccountType;
                      expensePolicy: string | null;
                      settings: any;
                      location: { address: string | null; country: string | null } | null;
                    } | null;
                    location: { name: string | null; address: string | null; country: string | null } | null;
                  }
                | {
                    id: string;
                    slug: string;
                    name: string | null;
                    legalName: string | null;
                    type: AccountType;
                    settings: any;
                    host: {
                      id: string;
                      name: string | null;
                      legalName: string | null;
                      slug: string;
                      type: AccountType;
                      expensePolicy: string | null;
                      settings: any;
                      location: { address: string | null; country: string | null } | null;
                    } | null;
                    location: { name: string | null; address: string | null; country: string | null } | null;
                  }
                | {
                    id: string;
                    slug: string;
                    name: string | null;
                    legalName: string | null;
                    type: AccountType;
                    settings: any;
                    host: {
                      id: string;
                      name: string | null;
                      legalName: string | null;
                      slug: string;
                      type: AccountType;
                      expensePolicy: string | null;
                      settings: any;
                      location: { address: string | null; country: string | null } | null;
                    } | null;
                    location: { name: string | null; address: string | null; country: string | null } | null;
                  }
                | {
                    id: string;
                    slug: string;
                    name: string | null;
                    legalName: string | null;
                    type: AccountType;
                    settings: any;
                    location: { name: string | null; address: string | null; country: string | null } | null;
                  }
                | {
                    id: string;
                    slug: string;
                    name: string | null;
                    legalName: string | null;
                    type: AccountType;
                    settings: any;
                    location: { name: string | null; address: string | null; country: string | null } | null;
                  }
                | {
                    id: string;
                    slug: string;
                    name: string | null;
                    legalName: string | null;
                    type: AccountType;
                    settings: any;
                    location: { name: string | null; address: string | null; country: string | null } | null;
                  }
                | {
                    id: string;
                    slug: string;
                    name: string | null;
                    legalName: string | null;
                    type: AccountType;
                    settings: any;
                    host: {
                      id: string;
                      name: string | null;
                      legalName: string | null;
                      slug: string;
                      type: AccountType;
                      expensePolicy: string | null;
                      settings: any;
                      location: { address: string | null; country: string | null } | null;
                    } | null;
                    location: { name: string | null; address: string | null; country: string | null } | null;
                  }
                | {
                    id: string;
                    slug: string;
                    name: string | null;
                    legalName: string | null;
                    type: AccountType;
                    settings: any;
                    host: {
                      id: string;
                      name: string | null;
                      legalName: string | null;
                      slug: string;
                      type: AccountType;
                      expensePolicy: string | null;
                      settings: any;
                      location: { address: string | null; country: string | null } | null;
                    } | null;
                    location: { name: string | null; address: string | null; country: string | null } | null;
                  }
                | {
                    id: string;
                    slug: string;
                    name: string | null;
                    legalName: string | null;
                    type: AccountType;
                    settings: any;
                    location: { name: string | null; address: string | null; country: string | null } | null;
                  }
                | null;
              toAccount:
                | {
                    id: string;
                    slug: string;
                    legalName: string | null;
                    name: string | null;
                    type: AccountType;
                    settings: any;
                    location: { name: string | null; address: string | null; country: string | null } | null;
                  }
                | {
                    id: string;
                    slug: string;
                    legalName: string | null;
                    name: string | null;
                    type: AccountType;
                    settings: any;
                    location: { name: string | null; address: string | null; country: string | null } | null;
                  }
                | {
                    startsAt: any;
                    endsAt: any;
                    timezone: string | null;
                    id: string;
                    slug: string;
                    legalName: string | null;
                    name: string | null;
                    type: AccountType;
                    settings: any;
                    location: { name: string | null; address: string | null; country: string | null } | null;
                  }
                | {
                    id: string;
                    slug: string;
                    legalName: string | null;
                    name: string | null;
                    type: AccountType;
                    settings: any;
                    location: { name: string | null; address: string | null; country: string | null } | null;
                  }
                | {
                    id: string;
                    slug: string;
                    legalName: string | null;
                    name: string | null;
                    type: AccountType;
                    settings: any;
                    location: { name: string | null; address: string | null; country: string | null } | null;
                  }
                | {
                    id: string;
                    slug: string;
                    legalName: string | null;
                    name: string | null;
                    type: AccountType;
                    settings: any;
                    location: { name: string | null; address: string | null; country: string | null } | null;
                  }
                | {
                    id: string;
                    slug: string;
                    legalName: string | null;
                    name: string | null;
                    type: AccountType;
                    settings: any;
                    location: { name: string | null; address: string | null; country: string | null } | null;
                  }
                | {
                    id: string;
                    slug: string;
                    legalName: string | null;
                    name: string | null;
                    type: AccountType;
                    settings: any;
                    location: { name: string | null; address: string | null; country: string | null } | null;
                  }
                | {
                    id: string;
                    slug: string;
                    legalName: string | null;
                    name: string | null;
                    type: AccountType;
                    settings: any;
                    location: { name: string | null; address: string | null; country: string | null } | null;
                  }
                | {
                    id: string;
                    slug: string;
                    legalName: string | null;
                    name: string | null;
                    type: AccountType;
                    settings: any;
                    location: { name: string | null; address: string | null; country: string | null } | null;
                  }
                | null;
              giftCardEmitterAccount:
                | { id: string; slug: string; name: string | null; legalName: string | null; type: AccountType }
                | { id: string; slug: string; name: string | null; legalName: string | null; type: AccountType }
                | { id: string; slug: string; name: string | null; legalName: string | null; type: AccountType }
                | { id: string; slug: string; name: string | null; legalName: string | null; type: AccountType }
                | { id: string; slug: string; name: string | null; legalName: string | null; type: AccountType }
                | { id: string; slug: string; name: string | null; legalName: string | null; type: AccountType }
                | { id: string; slug: string; name: string | null; legalName: string | null; type: AccountType }
                | { id: string; slug: string; name: string | null; legalName: string | null; type: AccountType }
                | { id: string; slug: string; name: string | null; legalName: string | null; type: AccountType }
                | { id: string; slug: string; name: string | null; legalName: string | null; type: AccountType }
                | null;
              refundTransaction: { id: string } | { id: string } | null;
              order: {
                id: string;
                legacyId: number;
                data: any;
                quantity: number | null;
                tax: { id: string; type: TaxType; rate: number; percentage: number } | null;
                tier: { id: string; type: TierType; invoiceTemplate: string | null } | null;
              } | null;
            }
          | null;
        permissions: { canDownloadInvoice: boolean };
        host:
          | {
              id: string;
              slug: string;
              name: string | null;
              legalName: string | null;
              currency: Currency;
              imageUrl: string | null;
              website: string | null;
              settings: any;
              type: AccountType;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              id: string;
              slug: string;
              name: string | null;
              legalName: string | null;
              currency: Currency;
              imageUrl: string | null;
              website: string | null;
              settings: any;
              type: AccountType;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              id: string;
              slug: string;
              name: string | null;
              legalName: string | null;
              currency: Currency;
              imageUrl: string | null;
              website: string | null;
              settings: any;
              type: AccountType;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              id: string;
              slug: string;
              name: string | null;
              legalName: string | null;
              currency: Currency;
              imageUrl: string | null;
              website: string | null;
              settings: any;
              type: AccountType;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              id: string;
              slug: string;
              name: string | null;
              legalName: string | null;
              currency: Currency;
              imageUrl: string | null;
              website: string | null;
              settings: any;
              type: AccountType;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              id: string;
              slug: string;
              name: string | null;
              legalName: string | null;
              currency: Currency;
              imageUrl: string | null;
              website: string | null;
              settings: any;
              type: AccountType;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              id: string;
              slug: string;
              name: string | null;
              legalName: string | null;
              currency: Currency;
              imageUrl: string | null;
              website: string | null;
              settings: any;
              type: AccountType;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              id: string;
              slug: string;
              name: string | null;
              legalName: string | null;
              currency: Currency;
              imageUrl: string | null;
              website: string | null;
              settings: any;
              type: AccountType;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              id: string;
              slug: string;
              name: string | null;
              legalName: string | null;
              currency: Currency;
              imageUrl: string | null;
              website: string | null;
              settings: any;
              type: AccountType;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              id: string;
              slug: string;
              name: string | null;
              legalName: string | null;
              currency: Currency;
              imageUrl: string | null;
              website: string | null;
              settings: any;
              type: AccountType;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | null;
        amount: { valueInCents: number | null; currency: Currency | null };
        amountInHostCurrency: { valueInCents: number | null; currency: Currency | null };
        netAmount: { valueInCents: number | null; currency: Currency | null };
        taxAmount: { valueInCents: number | null; currency: Currency | null };
        taxInfo: { type: TaxType; rate: number } | null;
        paymentMethod: {
          id: string | null;
          type: PaymentMethodType | null;
          service: PaymentMethodService | null;
          name: string | null;
        } | null;
        fromAccount:
          | {
              id: string;
              slug: string;
              name: string | null;
              legalName: string | null;
              type: AccountType;
              settings: any;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              id: string;
              slug: string;
              name: string | null;
              legalName: string | null;
              type: AccountType;
              settings: any;
              host: {
                id: string;
                name: string | null;
                legalName: string | null;
                slug: string;
                type: AccountType;
                expensePolicy: string | null;
                settings: any;
                location: { address: string | null; country: string | null } | null;
              } | null;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              id: string;
              slug: string;
              name: string | null;
              legalName: string | null;
              type: AccountType;
              settings: any;
              host: {
                id: string;
                name: string | null;
                legalName: string | null;
                slug: string;
                type: AccountType;
                expensePolicy: string | null;
                settings: any;
                location: { address: string | null; country: string | null } | null;
              } | null;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              id: string;
              slug: string;
              name: string | null;
              legalName: string | null;
              type: AccountType;
              settings: any;
              host: {
                id: string;
                name: string | null;
                legalName: string | null;
                slug: string;
                type: AccountType;
                expensePolicy: string | null;
                settings: any;
                location: { address: string | null; country: string | null } | null;
              } | null;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              id: string;
              slug: string;
              name: string | null;
              legalName: string | null;
              type: AccountType;
              settings: any;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              id: string;
              slug: string;
              name: string | null;
              legalName: string | null;
              type: AccountType;
              settings: any;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              id: string;
              slug: string;
              name: string | null;
              legalName: string | null;
              type: AccountType;
              settings: any;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              id: string;
              slug: string;
              name: string | null;
              legalName: string | null;
              type: AccountType;
              settings: any;
              host: {
                id: string;
                name: string | null;
                legalName: string | null;
                slug: string;
                type: AccountType;
                expensePolicy: string | null;
                settings: any;
                location: { address: string | null; country: string | null } | null;
              } | null;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              id: string;
              slug: string;
              name: string | null;
              legalName: string | null;
              type: AccountType;
              settings: any;
              host: {
                id: string;
                name: string | null;
                legalName: string | null;
                slug: string;
                type: AccountType;
                expensePolicy: string | null;
                settings: any;
                location: { address: string | null; country: string | null } | null;
              } | null;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              id: string;
              slug: string;
              name: string | null;
              legalName: string | null;
              type: AccountType;
              settings: any;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | null;
        toAccount:
          | {
              id: string;
              slug: string;
              legalName: string | null;
              name: string | null;
              type: AccountType;
              settings: any;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              id: string;
              slug: string;
              legalName: string | null;
              name: string | null;
              type: AccountType;
              settings: any;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              startsAt: any;
              endsAt: any;
              timezone: string | null;
              id: string;
              slug: string;
              legalName: string | null;
              name: string | null;
              type: AccountType;
              settings: any;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              id: string;
              slug: string;
              legalName: string | null;
              name: string | null;
              type: AccountType;
              settings: any;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              id: string;
              slug: string;
              legalName: string | null;
              name: string | null;
              type: AccountType;
              settings: any;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              id: string;
              slug: string;
              legalName: string | null;
              name: string | null;
              type: AccountType;
              settings: any;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              id: string;
              slug: string;
              legalName: string | null;
              name: string | null;
              type: AccountType;
              settings: any;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              id: string;
              slug: string;
              legalName: string | null;
              name: string | null;
              type: AccountType;
              settings: any;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              id: string;
              slug: string;
              legalName: string | null;
              name: string | null;
              type: AccountType;
              settings: any;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | {
              id: string;
              slug: string;
              legalName: string | null;
              name: string | null;
              type: AccountType;
              settings: any;
              location: { name: string | null; address: string | null; country: string | null } | null;
            }
          | null;
        giftCardEmitterAccount:
          | { id: string; slug: string; name: string | null; legalName: string | null; type: AccountType }
          | { id: string; slug: string; name: string | null; legalName: string | null; type: AccountType }
          | { id: string; slug: string; name: string | null; legalName: string | null; type: AccountType }
          | { id: string; slug: string; name: string | null; legalName: string | null; type: AccountType }
          | { id: string; slug: string; name: string | null; legalName: string | null; type: AccountType }
          | { id: string; slug: string; name: string | null; legalName: string | null; type: AccountType }
          | { id: string; slug: string; name: string | null; legalName: string | null; type: AccountType }
          | { id: string; slug: string; name: string | null; legalName: string | null; type: AccountType }
          | { id: string; slug: string; name: string | null; legalName: string | null; type: AccountType }
          | { id: string; slug: string; name: string | null; legalName: string | null; type: AccountType }
          | null;
        refundTransaction: { id: string } | { id: string } | null;
        order: {
          id: string;
          legacyId: number;
          data: any;
          quantity: number | null;
          tax: { id: string; type: TaxType; rate: number; percentage: number } | null;
          tier: { id: string; type: TierType; invoiceTemplate: string | null } | null;
        } | null;
      }
    | null;
};

export type InvoiceByDateRangeQueryVariables = Exact<{
  fromCollectiveSlug: string;
  hostSlug: string;
  dateFrom: any;
  dateTo: any;
  hasExpense?: boolean | null | undefined;
}>;

export type InvoiceByDateRangeQuery = {
  host: {
    id: string;
    slug: string;
    name: string | null;
    legalName: string | null;
    currency: Currency;
    imageUrl: string | null;
    website: string | null;
    settings: any;
    type: AccountType;
    location: { name: string | null; address: string | null; country: string | null } | null;
  } | null;
  fromAccount:
    | {
        id: string;
        slug: string;
        name: string | null;
        legalName: string | null;
        currency: Currency;
        type: AccountType;
        settings: any;
        permissions: { canDownloadPaymentReceipts: { allowed: boolean } };
        location: { name: string | null; address: string | null; country: string | null } | null;
      }
    | {
        id: string;
        slug: string;
        name: string | null;
        legalName: string | null;
        currency: Currency;
        type: AccountType;
        settings: any;
        permissions: { canDownloadPaymentReceipts: { allowed: boolean } };
        location: { name: string | null; address: string | null; country: string | null } | null;
      }
    | {
        id: string;
        slug: string;
        name: string | null;
        legalName: string | null;
        currency: Currency;
        type: AccountType;
        settings: any;
        permissions: { canDownloadPaymentReceipts: { allowed: boolean } };
        location: { name: string | null; address: string | null; country: string | null } | null;
      }
    | {
        id: string;
        slug: string;
        name: string | null;
        legalName: string | null;
        currency: Currency;
        type: AccountType;
        settings: any;
        permissions: { canDownloadPaymentReceipts: { allowed: boolean } };
        location: { name: string | null; address: string | null; country: string | null } | null;
      }
    | {
        id: string;
        slug: string;
        name: string | null;
        legalName: string | null;
        currency: Currency;
        type: AccountType;
        settings: any;
        permissions: { canDownloadPaymentReceipts: { allowed: boolean } };
        location: { name: string | null; address: string | null; country: string | null } | null;
      }
    | {
        id: string;
        slug: string;
        name: string | null;
        legalName: string | null;
        currency: Currency;
        type: AccountType;
        settings: any;
        permissions: { canDownloadPaymentReceipts: { allowed: boolean } };
        location: { name: string | null; address: string | null; country: string | null } | null;
      }
    | {
        id: string;
        slug: string;
        name: string | null;
        legalName: string | null;
        currency: Currency;
        type: AccountType;
        settings: any;
        permissions: { canDownloadPaymentReceipts: { allowed: boolean } };
        location: { name: string | null; address: string | null; country: string | null } | null;
      }
    | {
        id: string;
        slug: string;
        name: string | null;
        legalName: string | null;
        currency: Currency;
        type: AccountType;
        settings: any;
        permissions: { canDownloadPaymentReceipts: { allowed: boolean } };
        location: { name: string | null; address: string | null; country: string | null } | null;
      }
    | {
        id: string;
        slug: string;
        name: string | null;
        legalName: string | null;
        currency: Currency;
        type: AccountType;
        settings: any;
        permissions: { canDownloadPaymentReceipts: { allowed: boolean } };
        location: { name: string | null; address: string | null; country: string | null } | null;
      }
    | {
        id: string;
        slug: string;
        name: string | null;
        legalName: string | null;
        currency: Currency;
        type: AccountType;
        settings: any;
        permissions: { canDownloadPaymentReceipts: { allowed: boolean } };
        location: { name: string | null; address: string | null; country: string | null } | null;
      }
    | null;
  transactions: {
    totalCount: number | null;
    nodes: Array<
      | {
          id: string;
          type: TransactionType;
          kind: TransactionKind | null;
          createdAt: any;
          clearedAt: any;
          description: string | null;
          hostCurrencyFxRate: number | null;
          invoiceTemplate: string | null;
          isRefund: boolean | null;
          host:
            | {
                id: string;
                slug: string;
                name: string | null;
                legalName: string | null;
                currency: Currency;
                imageUrl: string | null;
                website: string | null;
                settings: any;
                type: AccountType;
                location: { name: string | null; address: string | null; country: string | null } | null;
              }
            | {
                id: string;
                slug: string;
                name: string | null;
                legalName: string | null;
                currency: Currency;
                imageUrl: string | null;
                website: string | null;
                settings: any;
                type: AccountType;
                location: { name: string | null; address: string | null; country: string | null } | null;
              }
            | {
                id: string;
                slug: string;
                name: string | null;
                legalName: string | null;
                currency: Currency;
                imageUrl: string | null;
                website: string | null;
                settings: any;
                type: AccountType;
                location: { name: string | null; address: string | null; country: string | null } | null;
              }
            | {
                id: string;
                slug: string;
                name: string | null;
                legalName: string | null;
                currency: Currency;
                imageUrl: string | null;
                website: string | null;
                settings: any;
                type: AccountType;
                location: { name: string | null; address: string | null; country: string | null } | null;
              }
            | {
                id: string;
                slug: string;
                name: string | null;
                legalName: string | null;
                currency: Currency;
                imageUrl: string | null;
                website: string | null;
                settings: any;
                type: AccountType;
                location: { name: string | null; address: string | null; country: string | null } | null;
              }
            | {
                id: string;
                slug: string;
                name: string | null;
                legalName: string | null;
                currency: Currency;
                imageUrl: string | null;
                website: string | null;
                settings: any;
                type: AccountType;
                location: { name: string | null; address: string | null; country: string | null } | null;
              }
            | {
                id: string;
                slug: string;
                name: string | null;
                legalName: string | null;
                currency: Currency;
                imageUrl: string | null;
                website: string | null;
                settings: any;
                type: AccountType;
                location: { name: string | null; address: string | null; country: string | null } | null;
              }
            | {
                id: string;
                slug: string;
                name: string | null;
                legalName: string | null;
                currency: Currency;
                imageUrl: string | null;
                website: string | null;
                settings: any;
                type: AccountType;
                location: { name: string | null; address: string | null; country: string | null } | null;
              }
            | {
                id: string;
                slug: string;
                name: string | null;
                legalName: string | null;
                currency: Currency;
                imageUrl: string | null;
                website: string | null;
                settings: any;
                type: AccountType;
                location: { name: string | null; address: string | null; country: string | null } | null;
              }
            | {
                id: string;
                slug: string;
                name: string | null;
                legalName: string | null;
                currency: Currency;
                imageUrl: string | null;
                website: string | null;
                settings: any;
                type: AccountType;
                location: { name: string | null; address: string | null; country: string | null } | null;
              }
            | null;
          oppositeTransaction:
            | {
                host:
                  | {
                      id: string;
                      slug: string;
                      name: string | null;
                      legalName: string | null;
                      currency: Currency;
                      imageUrl: string | null;
                      website: string | null;
                      settings: any;
                      type: AccountType;
                      location: { name: string | null; address: string | null; country: string | null } | null;
                    }
                  | {
                      id: string;
                      slug: string;
                      name: string | null;
                      legalName: string | null;
                      currency: Currency;
                      imageUrl: string | null;
                      website: string | null;
                      settings: any;
                      type: AccountType;
                      location: { name: string | null; address: string | null; country: string | null } | null;
                    }
                  | {
                      id: string;
                      slug: string;
                      name: string | null;
                      legalName: string | null;
                      currency: Currency;
                      imageUrl: string | null;
                      website: string | null;
                      settings: any;
                      type: AccountType;
                      location: { name: string | null; address: string | null; country: string | null } | null;
                    }
                  | {
                      id: string;
                      slug: string;
                      name: string | null;
                      legalName: string | null;
                      currency: Currency;
                      imageUrl: string | null;
                      website: string | null;
                      settings: any;
                      type: AccountType;
                      location: { name: string | null; address: string | null; country: string | null } | null;
                    }
                  | {
                      id: string;
                      slug: string;
                      name: string | null;
                      legalName: string | null;
                      currency: Currency;
                      imageUrl: string | null;
                      website: string | null;
                      settings: any;
                      type: AccountType;
                      location: { name: string | null; address: string | null; country: string | null } | null;
                    }
                  | {
                      id: string;
                      slug: string;
                      name: string | null;
                      legalName: string | null;
                      currency: Currency;
                      imageUrl: string | null;
                      website: string | null;
                      settings: any;
                      type: AccountType;
                      location: { name: string | null; address: string | null; country: string | null } | null;
                    }
                  | {
                      id: string;
                      slug: string;
                      name: string | null;
                      legalName: string | null;
                      currency: Currency;
                      imageUrl: string | null;
                      website: string | null;
                      settings: any;
                      type: AccountType;
                      location: { name: string | null; address: string | null; country: string | null } | null;
                    }
                  | {
                      id: string;
                      slug: string;
                      name: string | null;
                      legalName: string | null;
                      currency: Currency;
                      imageUrl: string | null;
                      website: string | null;
                      settings: any;
                      type: AccountType;
                      location: { name: string | null; address: string | null; country: string | null } | null;
                    }
                  | {
                      id: string;
                      slug: string;
                      name: string | null;
                      legalName: string | null;
                      currency: Currency;
                      imageUrl: string | null;
                      website: string | null;
                      settings: any;
                      type: AccountType;
                      location: { name: string | null; address: string | null; country: string | null } | null;
                    }
                  | {
                      id: string;
                      slug: string;
                      name: string | null;
                      legalName: string | null;
                      currency: Currency;
                      imageUrl: string | null;
                      website: string | null;
                      settings: any;
                      type: AccountType;
                      location: { name: string | null; address: string | null; country: string | null } | null;
                    }
                  | null;
              }
            | {
                host:
                  | {
                      id: string;
                      slug: string;
                      name: string | null;
                      legalName: string | null;
                      currency: Currency;
                      imageUrl: string | null;
                      website: string | null;
                      settings: any;
                      type: AccountType;
                      location: { name: string | null; address: string | null; country: string | null } | null;
                    }
                  | {
                      id: string;
                      slug: string;
                      name: string | null;
                      legalName: string | null;
                      currency: Currency;
                      imageUrl: string | null;
                      website: string | null;
                      settings: any;
                      type: AccountType;
                      location: { name: string | null; address: string | null; country: string | null } | null;
                    }
                  | {
                      id: string;
                      slug: string;
                      name: string | null;
                      legalName: string | null;
                      currency: Currency;
                      imageUrl: string | null;
                      website: string | null;
                      settings: any;
                      type: AccountType;
                      location: { name: string | null; address: string | null; country: string | null } | null;
                    }
                  | {
                      id: string;
                      slug: string;
                      name: string | null;
                      legalName: string | null;
                      currency: Currency;
                      imageUrl: string | null;
                      website: string | null;
                      settings: any;
                      type: AccountType;
                      location: { name: string | null; address: string | null; country: string | null } | null;
                    }
                  | {
                      id: string;
                      slug: string;
                      name: string | null;
                      legalName: string | null;
                      currency: Currency;
                      imageUrl: string | null;
                      website: string | null;
                      settings: any;
                      type: AccountType;
                      location: { name: string | null; address: string | null; country: string | null } | null;
                    }
                  | {
                      id: string;
                      slug: string;
                      name: string | null;
                      legalName: string | null;
                      currency: Currency;
                      imageUrl: string | null;
                      website: string | null;
                      settings: any;
                      type: AccountType;
                      location: { name: string | null; address: string | null; country: string | null } | null;
                    }
                  | {
                      id: string;
                      slug: string;
                      name: string | null;
                      legalName: string | null;
                      currency: Currency;
                      imageUrl: string | null;
                      website: string | null;
                      settings: any;
                      type: AccountType;
                      location: { name: string | null; address: string | null; country: string | null } | null;
                    }
                  | {
                      id: string;
                      slug: string;
                      name: string | null;
                      legalName: string | null;
                      currency: Currency;
                      imageUrl: string | null;
                      website: string | null;
                      settings: any;
                      type: AccountType;
                      location: { name: string | null; address: string | null; country: string | null } | null;
                    }
                  | {
                      id: string;
                      slug: string;
                      name: string | null;
                      legalName: string | null;
                      currency: Currency;
                      imageUrl: string | null;
                      website: string | null;
                      settings: any;
                      type: AccountType;
                      location: { name: string | null; address: string | null; country: string | null } | null;
                    }
                  | {
                      id: string;
                      slug: string;
                      name: string | null;
                      legalName: string | null;
                      currency: Currency;
                      imageUrl: string | null;
                      website: string | null;
                      settings: any;
                      type: AccountType;
                      location: { name: string | null; address: string | null; country: string | null } | null;
                    }
                  | null;
              }
            | null;
          amount: { valueInCents: number | null; currency: Currency | null };
          amountInHostCurrency: { valueInCents: number | null; currency: Currency | null };
          netAmount: { valueInCents: number | null; currency: Currency | null };
          taxAmount: { valueInCents: number | null; currency: Currency | null };
          taxInfo: { type: TaxType; rate: number } | null;
          paymentMethod: {
            id: string | null;
            type: PaymentMethodType | null;
            service: PaymentMethodService | null;
            name: string | null;
          } | null;
          fromAccount:
            | {
                id: string;
                slug: string;
                name: string | null;
                legalName: string | null;
                type: AccountType;
                settings: any;
                location: { name: string | null; address: string | null; country: string | null } | null;
              }
            | {
                id: string;
                slug: string;
                name: string | null;
                legalName: string | null;
                type: AccountType;
                settings: any;
                host: {
                  id: string;
                  name: string | null;
                  legalName: string | null;
                  slug: string;
                  type: AccountType;
                  expensePolicy: string | null;
                  settings: any;
                  location: { address: string | null; country: string | null } | null;
                } | null;
                location: { name: string | null; address: string | null; country: string | null } | null;
              }
            | {
                id: string;
                slug: string;
                name: string | null;
                legalName: string | null;
                type: AccountType;
                settings: any;
                host: {
                  id: string;
                  name: string | null;
                  legalName: string | null;
                  slug: string;
                  type: AccountType;
                  expensePolicy: string | null;
                  settings: any;
                  location: { address: string | null; country: string | null } | null;
                } | null;
                location: { name: string | null; address: string | null; country: string | null } | null;
              }
            | {
                id: string;
                slug: string;
                name: string | null;
                legalName: string | null;
                type: AccountType;
                settings: any;
                host: {
                  id: string;
                  name: string | null;
                  legalName: string | null;
                  slug: string;
                  type: AccountType;
                  expensePolicy: string | null;
                  settings: any;
                  location: { address: string | null; country: string | null } | null;
                } | null;
                location: { name: string | null; address: string | null; country: string | null } | null;
              }
            | {
                id: string;
                slug: string;
                name: string | null;
                legalName: string | null;
                type: AccountType;
                settings: any;
                location: { name: string | null; address: string | null; country: string | null } | null;
              }
            | {
                id: string;
                slug: string;
                name: string | null;
                legalName: string | null;
                type: AccountType;
                settings: any;
                location: { name: string | null; address: string | null; country: string | null } | null;
              }
            | {
                id: string;
                slug: string;
                name: string | null;
                legalName: string | null;
                type: AccountType;
                settings: any;
                location: { name: string | null; address: string | null; country: string | null } | null;
              }
            | {
                id: string;
                slug: string;
                name: string | null;
                legalName: string | null;
                type: AccountType;
                settings: any;
                host: {
                  id: string;
                  name: string | null;
                  legalName: string | null;
                  slug: string;
                  type: AccountType;
                  expensePolicy: string | null;
                  settings: any;
                  location: { address: string | null; country: string | null } | null;
                } | null;
                location: { name: string | null; address: string | null; country: string | null } | null;
              }
            | {
                id: string;
                slug: string;
                name: string | null;
                legalName: string | null;
                type: AccountType;
                settings: any;
                host: {
                  id: string;
                  name: string | null;
                  legalName: string | null;
                  slug: string;
                  type: AccountType;
                  expensePolicy: string | null;
                  settings: any;
                  location: { address: string | null; country: string | null } | null;
                } | null;
                location: { name: string | null; address: string | null; country: string | null } | null;
              }
            | {
                id: string;
                slug: string;
                name: string | null;
                legalName: string | null;
                type: AccountType;
                settings: any;
                location: { name: string | null; address: string | null; country: string | null } | null;
              }
            | null;
          toAccount:
            | {
                id: string;
                slug: string;
                legalName: string | null;
                name: string | null;
                type: AccountType;
                settings: any;
                location: { name: string | null; address: string | null; country: string | null } | null;
              }
            | {
                id: string;
                slug: string;
                legalName: string | null;
                name: string | null;
                type: AccountType;
                settings: any;
                location: { name: string | null; address: string | null; country: string | null } | null;
              }
            | {
                startsAt: any;
                endsAt: any;
                timezone: string | null;
                id: string;
                slug: string;
                legalName: string | null;
                name: string | null;
                type: AccountType;
                settings: any;
                location: { name: string | null; address: string | null; country: string | null } | null;
              }
            | {
                id: string;
                slug: string;
                legalName: string | null;
                name: string | null;
                type: AccountType;
                settings: any;
                location: { name: string | null; address: string | null; country: string | null } | null;
              }
            | {
                id: string;
                slug: string;
                legalName: string | null;
                name: string | null;
                type: AccountType;
                settings: any;
                location: { name: string | null; address: string | null; country: string | null } | null;
              }
            | {
                id: string;
                slug: string;
                legalName: string | null;
                name: string | null;
                type: AccountType;
                settings: any;
                location: { name: string | null; address: string | null; country: string | null } | null;
              }
            | {
                id: string;
                slug: string;
                legalName: string | null;
                name: string | null;
                type: AccountType;
                settings: any;
                location: { name: string | null; address: string | null; country: string | null } | null;
              }
            | {
                id: string;
                slug: string;
                legalName: string | null;
                name: string | null;
                type: AccountType;
                settings: any;
                location: { name: string | null; address: string | null; country: string | null } | null;
              }
            | {
                id: string;
                slug: string;
                legalName: string | null;
                name: string | null;
                type: AccountType;
                settings: any;
                location: { name: string | null; address: string | null; country: string | null } | null;
              }
            | {
                id: string;
                slug: string;
                legalName: string | null;
                name: string | null;
                type: AccountType;
                settings: any;
                location: { name: string | null; address: string | null; country: string | null } | null;
              }
            | null;
          giftCardEmitterAccount:
            | { id: string; slug: string; name: string | null; legalName: string | null; type: AccountType }
            | { id: string; slug: string; name: string | null; legalName: string | null; type: AccountType }
            | { id: string; slug: string; name: string | null; legalName: string | null; type: AccountType }
            | { id: string; slug: string; name: string | null; legalName: string | null; type: AccountType }
            | { id: string; slug: string; name: string | null; legalName: string | null; type: AccountType }
            | { id: string; slug: string; name: string | null; legalName: string | null; type: AccountType }
            | { id: string; slug: string; name: string | null; legalName: string | null; type: AccountType }
            | { id: string; slug: string; name: string | null; legalName: string | null; type: AccountType }
            | { id: string; slug: string; name: string | null; legalName: string | null; type: AccountType }
            | { id: string; slug: string; name: string | null; legalName: string | null; type: AccountType }
            | null;
          refundTransaction: { id: string } | { id: string } | null;
          order: {
            id: string;
            legacyId: number;
            data: any;
            quantity: number | null;
            tax: { id: string; type: TaxType; rate: number; percentage: number } | null;
            tier: { id: string; type: TierType; invoiceTemplate: string | null } | null;
          } | null;
        }
      | {
          id: string;
          type: TransactionType;
          kind: TransactionKind | null;
          createdAt: any;
          clearedAt: any;
          description: string | null;
          hostCurrencyFxRate: number | null;
          invoiceTemplate: string | null;
          isRefund: boolean | null;
          host:
            | {
                id: string;
                slug: string;
                name: string | null;
                legalName: string | null;
                currency: Currency;
                imageUrl: string | null;
                website: string | null;
                settings: any;
                type: AccountType;
                location: { name: string | null; address: string | null; country: string | null } | null;
              }
            | {
                id: string;
                slug: string;
                name: string | null;
                legalName: string | null;
                currency: Currency;
                imageUrl: string | null;
                website: string | null;
                settings: any;
                type: AccountType;
                location: { name: string | null; address: string | null; country: string | null } | null;
              }
            | {
                id: string;
                slug: string;
                name: string | null;
                legalName: string | null;
                currency: Currency;
                imageUrl: string | null;
                website: string | null;
                settings: any;
                type: AccountType;
                location: { name: string | null; address: string | null; country: string | null } | null;
              }
            | {
                id: string;
                slug: string;
                name: string | null;
                legalName: string | null;
                currency: Currency;
                imageUrl: string | null;
                website: string | null;
                settings: any;
                type: AccountType;
                location: { name: string | null; address: string | null; country: string | null } | null;
              }
            | {
                id: string;
                slug: string;
                name: string | null;
                legalName: string | null;
                currency: Currency;
                imageUrl: string | null;
                website: string | null;
                settings: any;
                type: AccountType;
                location: { name: string | null; address: string | null; country: string | null } | null;
              }
            | {
                id: string;
                slug: string;
                name: string | null;
                legalName: string | null;
                currency: Currency;
                imageUrl: string | null;
                website: string | null;
                settings: any;
                type: AccountType;
                location: { name: string | null; address: string | null; country: string | null } | null;
              }
            | {
                id: string;
                slug: string;
                name: string | null;
                legalName: string | null;
                currency: Currency;
                imageUrl: string | null;
                website: string | null;
                settings: any;
                type: AccountType;
                location: { name: string | null; address: string | null; country: string | null } | null;
              }
            | {
                id: string;
                slug: string;
                name: string | null;
                legalName: string | null;
                currency: Currency;
                imageUrl: string | null;
                website: string | null;
                settings: any;
                type: AccountType;
                location: { name: string | null; address: string | null; country: string | null } | null;
              }
            | {
                id: string;
                slug: string;
                name: string | null;
                legalName: string | null;
                currency: Currency;
                imageUrl: string | null;
                website: string | null;
                settings: any;
                type: AccountType;
                location: { name: string | null; address: string | null; country: string | null } | null;
              }
            | {
                id: string;
                slug: string;
                name: string | null;
                legalName: string | null;
                currency: Currency;
                imageUrl: string | null;
                website: string | null;
                settings: any;
                type: AccountType;
                location: { name: string | null; address: string | null; country: string | null } | null;
              }
            | null;
          oppositeTransaction:
            | {
                host:
                  | {
                      id: string;
                      slug: string;
                      name: string | null;
                      legalName: string | null;
                      currency: Currency;
                      imageUrl: string | null;
                      website: string | null;
                      settings: any;
                      type: AccountType;
                      location: { name: string | null; address: string | null; country: string | null } | null;
                    }
                  | {
                      id: string;
                      slug: string;
                      name: string | null;
                      legalName: string | null;
                      currency: Currency;
                      imageUrl: string | null;
                      website: string | null;
                      settings: any;
                      type: AccountType;
                      location: { name: string | null; address: string | null; country: string | null } | null;
                    }
                  | {
                      id: string;
                      slug: string;
                      name: string | null;
                      legalName: string | null;
                      currency: Currency;
                      imageUrl: string | null;
                      website: string | null;
                      settings: any;
                      type: AccountType;
                      location: { name: string | null; address: string | null; country: string | null } | null;
                    }
                  | {
                      id: string;
                      slug: string;
                      name: string | null;
                      legalName: string | null;
                      currency: Currency;
                      imageUrl: string | null;
                      website: string | null;
                      settings: any;
                      type: AccountType;
                      location: { name: string | null; address: string | null; country: string | null } | null;
                    }
                  | {
                      id: string;
                      slug: string;
                      name: string | null;
                      legalName: string | null;
                      currency: Currency;
                      imageUrl: string | null;
                      website: string | null;
                      settings: any;
                      type: AccountType;
                      location: { name: string | null; address: string | null; country: string | null } | null;
                    }
                  | {
                      id: string;
                      slug: string;
                      name: string | null;
                      legalName: string | null;
                      currency: Currency;
                      imageUrl: string | null;
                      website: string | null;
                      settings: any;
                      type: AccountType;
                      location: { name: string | null; address: string | null; country: string | null } | null;
                    }
                  | {
                      id: string;
                      slug: string;
                      name: string | null;
                      legalName: string | null;
                      currency: Currency;
                      imageUrl: string | null;
                      website: string | null;
                      settings: any;
                      type: AccountType;
                      location: { name: string | null; address: string | null; country: string | null } | null;
                    }
                  | {
                      id: string;
                      slug: string;
                      name: string | null;
                      legalName: string | null;
                      currency: Currency;
                      imageUrl: string | null;
                      website: string | null;
                      settings: any;
                      type: AccountType;
                      location: { name: string | null; address: string | null; country: string | null } | null;
                    }
                  | {
                      id: string;
                      slug: string;
                      name: string | null;
                      legalName: string | null;
                      currency: Currency;
                      imageUrl: string | null;
                      website: string | null;
                      settings: any;
                      type: AccountType;
                      location: { name: string | null; address: string | null; country: string | null } | null;
                    }
                  | {
                      id: string;
                      slug: string;
                      name: string | null;
                      legalName: string | null;
                      currency: Currency;
                      imageUrl: string | null;
                      website: string | null;
                      settings: any;
                      type: AccountType;
                      location: { name: string | null; address: string | null; country: string | null } | null;
                    }
                  | null;
              }
            | {
                host:
                  | {
                      id: string;
                      slug: string;
                      name: string | null;
                      legalName: string | null;
                      currency: Currency;
                      imageUrl: string | null;
                      website: string | null;
                      settings: any;
                      type: AccountType;
                      location: { name: string | null; address: string | null; country: string | null } | null;
                    }
                  | {
                      id: string;
                      slug: string;
                      name: string | null;
                      legalName: string | null;
                      currency: Currency;
                      imageUrl: string | null;
                      website: string | null;
                      settings: any;
                      type: AccountType;
                      location: { name: string | null; address: string | null; country: string | null } | null;
                    }
                  | {
                      id: string;
                      slug: string;
                      name: string | null;
                      legalName: string | null;
                      currency: Currency;
                      imageUrl: string | null;
                      website: string | null;
                      settings: any;
                      type: AccountType;
                      location: { name: string | null; address: string | null; country: string | null } | null;
                    }
                  | {
                      id: string;
                      slug: string;
                      name: string | null;
                      legalName: string | null;
                      currency: Currency;
                      imageUrl: string | null;
                      website: string | null;
                      settings: any;
                      type: AccountType;
                      location: { name: string | null; address: string | null; country: string | null } | null;
                    }
                  | {
                      id: string;
                      slug: string;
                      name: string | null;
                      legalName: string | null;
                      currency: Currency;
                      imageUrl: string | null;
                      website: string | null;
                      settings: any;
                      type: AccountType;
                      location: { name: string | null; address: string | null; country: string | null } | null;
                    }
                  | {
                      id: string;
                      slug: string;
                      name: string | null;
                      legalName: string | null;
                      currency: Currency;
                      imageUrl: string | null;
                      website: string | null;
                      settings: any;
                      type: AccountType;
                      location: { name: string | null; address: string | null; country: string | null } | null;
                    }
                  | {
                      id: string;
                      slug: string;
                      name: string | null;
                      legalName: string | null;
                      currency: Currency;
                      imageUrl: string | null;
                      website: string | null;
                      settings: any;
                      type: AccountType;
                      location: { name: string | null; address: string | null; country: string | null } | null;
                    }
                  | {
                      id: string;
                      slug: string;
                      name: string | null;
                      legalName: string | null;
                      currency: Currency;
                      imageUrl: string | null;
                      website: string | null;
                      settings: any;
                      type: AccountType;
                      location: { name: string | null; address: string | null; country: string | null } | null;
                    }
                  | {
                      id: string;
                      slug: string;
                      name: string | null;
                      legalName: string | null;
                      currency: Currency;
                      imageUrl: string | null;
                      website: string | null;
                      settings: any;
                      type: AccountType;
                      location: { name: string | null; address: string | null; country: string | null } | null;
                    }
                  | {
                      id: string;
                      slug: string;
                      name: string | null;
                      legalName: string | null;
                      currency: Currency;
                      imageUrl: string | null;
                      website: string | null;
                      settings: any;
                      type: AccountType;
                      location: { name: string | null; address: string | null; country: string | null } | null;
                    }
                  | null;
              }
            | null;
          amount: { valueInCents: number | null; currency: Currency | null };
          amountInHostCurrency: { valueInCents: number | null; currency: Currency | null };
          netAmount: { valueInCents: number | null; currency: Currency | null };
          taxAmount: { valueInCents: number | null; currency: Currency | null };
          taxInfo: { type: TaxType; rate: number } | null;
          paymentMethod: {
            id: string | null;
            type: PaymentMethodType | null;
            service: PaymentMethodService | null;
            name: string | null;
          } | null;
          fromAccount:
            | {
                id: string;
                slug: string;
                name: string | null;
                legalName: string | null;
                type: AccountType;
                settings: any;
                location: { name: string | null; address: string | null; country: string | null } | null;
              }
            | {
                id: string;
                slug: string;
                name: string | null;
                legalName: string | null;
                type: AccountType;
                settings: any;
                host: {
                  id: string;
                  name: string | null;
                  legalName: string | null;
                  slug: string;
                  type: AccountType;
                  expensePolicy: string | null;
                  settings: any;
                  location: { address: string | null; country: string | null } | null;
                } | null;
                location: { name: string | null; address: string | null; country: string | null } | null;
              }
            | {
                id: string;
                slug: string;
                name: string | null;
                legalName: string | null;
                type: AccountType;
                settings: any;
                host: {
                  id: string;
                  name: string | null;
                  legalName: string | null;
                  slug: string;
                  type: AccountType;
                  expensePolicy: string | null;
                  settings: any;
                  location: { address: string | null; country: string | null } | null;
                } | null;
                location: { name: string | null; address: string | null; country: string | null } | null;
              }
            | {
                id: string;
                slug: string;
                name: string | null;
                legalName: string | null;
                type: AccountType;
                settings: any;
                host: {
                  id: string;
                  name: string | null;
                  legalName: string | null;
                  slug: string;
                  type: AccountType;
                  expensePolicy: string | null;
                  settings: any;
                  location: { address: string | null; country: string | null } | null;
                } | null;
                location: { name: string | null; address: string | null; country: string | null } | null;
              }
            | {
                id: string;
                slug: string;
                name: string | null;
                legalName: string | null;
                type: AccountType;
                settings: any;
                location: { name: string | null; address: string | null; country: string | null } | null;
              }
            | {
                id: string;
                slug: string;
                name: string | null;
                legalName: string | null;
                type: AccountType;
                settings: any;
                location: { name: string | null; address: string | null; country: string | null } | null;
              }
            | {
                id: string;
                slug: string;
                name: string | null;
                legalName: string | null;
                type: AccountType;
                settings: any;
                location: { name: string | null; address: string | null; country: string | null } | null;
              }
            | {
                id: string;
                slug: string;
                name: string | null;
                legalName: string | null;
                type: AccountType;
                settings: any;
                host: {
                  id: string;
                  name: string | null;
                  legalName: string | null;
                  slug: string;
                  type: AccountType;
                  expensePolicy: string | null;
                  settings: any;
                  location: { address: string | null; country: string | null } | null;
                } | null;
                location: { name: string | null; address: string | null; country: string | null } | null;
              }
            | {
                id: string;
                slug: string;
                name: string | null;
                legalName: string | null;
                type: AccountType;
                settings: any;
                host: {
                  id: string;
                  name: string | null;
                  legalName: string | null;
                  slug: string;
                  type: AccountType;
                  expensePolicy: string | null;
                  settings: any;
                  location: { address: string | null; country: string | null } | null;
                } | null;
                location: { name: string | null; address: string | null; country: string | null } | null;
              }
            | {
                id: string;
                slug: string;
                name: string | null;
                legalName: string | null;
                type: AccountType;
                settings: any;
                location: { name: string | null; address: string | null; country: string | null } | null;
              }
            | null;
          toAccount:
            | {
                id: string;
                slug: string;
                legalName: string | null;
                name: string | null;
                type: AccountType;
                settings: any;
                location: { name: string | null; address: string | null; country: string | null } | null;
              }
            | {
                id: string;
                slug: string;
                legalName: string | null;
                name: string | null;
                type: AccountType;
                settings: any;
                location: { name: string | null; address: string | null; country: string | null } | null;
              }
            | {
                startsAt: any;
                endsAt: any;
                timezone: string | null;
                id: string;
                slug: string;
                legalName: string | null;
                name: string | null;
                type: AccountType;
                settings: any;
                location: { name: string | null; address: string | null; country: string | null } | null;
              }
            | {
                id: string;
                slug: string;
                legalName: string | null;
                name: string | null;
                type: AccountType;
                settings: any;
                location: { name: string | null; address: string | null; country: string | null } | null;
              }
            | {
                id: string;
                slug: string;
                legalName: string | null;
                name: string | null;
                type: AccountType;
                settings: any;
                location: { name: string | null; address: string | null; country: string | null } | null;
              }
            | {
                id: string;
                slug: string;
                legalName: string | null;
                name: string | null;
                type: AccountType;
                settings: any;
                location: { name: string | null; address: string | null; country: string | null } | null;
              }
            | {
                id: string;
                slug: string;
                legalName: string | null;
                name: string | null;
                type: AccountType;
                settings: any;
                location: { name: string | null; address: string | null; country: string | null } | null;
              }
            | {
                id: string;
                slug: string;
                legalName: string | null;
                name: string | null;
                type: AccountType;
                settings: any;
                location: { name: string | null; address: string | null; country: string | null } | null;
              }
            | {
                id: string;
                slug: string;
                legalName: string | null;
                name: string | null;
                type: AccountType;
                settings: any;
                location: { name: string | null; address: string | null; country: string | null } | null;
              }
            | {
                id: string;
                slug: string;
                legalName: string | null;
                name: string | null;
                type: AccountType;
                settings: any;
                location: { name: string | null; address: string | null; country: string | null } | null;
              }
            | null;
          giftCardEmitterAccount:
            | { id: string; slug: string; name: string | null; legalName: string | null; type: AccountType }
            | { id: string; slug: string; name: string | null; legalName: string | null; type: AccountType }
            | { id: string; slug: string; name: string | null; legalName: string | null; type: AccountType }
            | { id: string; slug: string; name: string | null; legalName: string | null; type: AccountType }
            | { id: string; slug: string; name: string | null; legalName: string | null; type: AccountType }
            | { id: string; slug: string; name: string | null; legalName: string | null; type: AccountType }
            | { id: string; slug: string; name: string | null; legalName: string | null; type: AccountType }
            | { id: string; slug: string; name: string | null; legalName: string | null; type: AccountType }
            | { id: string; slug: string; name: string | null; legalName: string | null; type: AccountType }
            | { id: string; slug: string; name: string | null; legalName: string | null; type: AccountType }
            | null;
          refundTransaction: { id: string } | { id: string } | null;
          order: {
            id: string;
            legacyId: number;
            data: any;
            quantity: number | null;
            tax: { id: string; type: TaxType; rate: number; percentage: number } | null;
            tier: { id: string; type: TierType; invoiceTemplate: string | null } | null;
          } | null;
        }
      | null
    > | null;
  };
};

export const ReceiptTransactionHostFieldsFragmentFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ReceiptTransactionHostFieldsFragment' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Account' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'legalName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'currency' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'imageUrl' },
            arguments: [
              { kind: 'Argument', name: { kind: 'Name', value: 'height' }, value: { kind: 'IntValue', value: '200' } },
            ],
          },
          { kind: 'Field', name: { kind: 'Name', value: 'website' } },
          { kind: 'Field', name: { kind: 'Name', value: 'settings' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'location' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'address' } },
                { kind: 'Field', name: { kind: 'Name', value: 'country' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ReceiptTransactionHostFieldsFragmentFragment, unknown>;
export const ReceiptTransactionFragmentFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ReceiptTransactionFragment' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Transaction' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'kind' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'clearedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'hostCurrencyFxRate' } },
          { kind: 'Field', name: { kind: 'Name', value: 'invoiceTemplate' } },
          { kind: 'Field', name: { kind: 'Name', value: 'isRefund' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'host' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'ReceiptTransactionHostFieldsFragment' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'oppositeTransaction' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'host' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'FragmentSpread', name: { kind: 'Name', value: 'ReceiptTransactionHostFieldsFragment' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'amount' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'valueInCents' } },
                { kind: 'Field', name: { kind: 'Name', value: 'currency' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'amountInHostCurrency' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'valueInCents' } },
                { kind: 'Field', name: { kind: 'Name', value: 'currency' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'netAmount' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'valueInCents' } },
                { kind: 'Field', name: { kind: 'Name', value: 'currency' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'taxAmount' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'valueInCents' } },
                { kind: 'Field', name: { kind: 'Name', value: 'currency' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'taxInfo' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                { kind: 'Field', name: { kind: 'Name', value: 'rate' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'paymentMethod' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                { kind: 'Field', name: { kind: 'Name', value: 'service' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'fromAccount' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'legalName' } },
                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                { kind: 'Field', name: { kind: 'Name', value: 'settings' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'location' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'address' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'country' } },
                    ],
                  },
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'AccountWithHost' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'host' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'legalName' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'expensePolicy' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'settings' } },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'location' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'Field', name: { kind: 'Name', value: 'address' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'country' } },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'toAccount' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                { kind: 'Field', name: { kind: 'Name', value: 'legalName' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                { kind: 'Field', name: { kind: 'Name', value: 'settings' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'location' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'address' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'country' } },
                    ],
                  },
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Event' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'startsAt' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'endsAt' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'timezone' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'giftCardEmitterAccount' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'legalName' } },
                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'isRefund' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'refundTransaction' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'id' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'order' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'legacyId' } },
                { kind: 'Field', name: { kind: 'Name', value: 'data' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'tax' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'rate' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'percentage' } },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'quantity' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'tier' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'invoiceTemplate' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ReceiptTransactionHostFieldsFragment' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Account' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'legalName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'currency' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'imageUrl' },
            arguments: [
              { kind: 'Argument', name: { kind: 'Name', value: 'height' }, value: { kind: 'IntValue', value: '200' } },
            ],
          },
          { kind: 'Field', name: { kind: 'Name', value: 'website' } },
          { kind: 'Field', name: { kind: 'Name', value: 'settings' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'location' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'address' } },
                { kind: 'Field', name: { kind: 'Name', value: 'country' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ReceiptTransactionFragmentFragment, unknown>;
export const ExpenseInvoiceDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'ExpenseInvoice' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'expenseId' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'expense' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'expense' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'id' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'expenseId' } },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'legacyId' } },
                { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                { kind: 'Field', name: { kind: 'Name', value: 'currency' } },
                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                { kind: 'Field', name: { kind: 'Name', value: 'invoiceInfo' } },
                { kind: 'Field', name: { kind: 'Name', value: 'amount' } },
                { kind: 'Field', name: { kind: 'Name', value: 'reference' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'permissions' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'Field', name: { kind: 'Name', value: 'canSeeInvoiceInfo' } }],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'taxes' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'rate' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'idNumber' } },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'account' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'legalName' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'imageUrl' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'settings' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'location' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'address' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'country' } },
                          ],
                        },
                      },
                      {
                        kind: 'InlineFragment',
                        typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'AccountWithHost' } },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'host' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'legalName' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'expensePolicy' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'settings' } },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'location' },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        { kind: 'Field', name: { kind: 'Name', value: 'address' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'country' } },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'payee' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'legalName' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'imageUrl' } },
                      {
                        kind: 'InlineFragment',
                        typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'AccountWithHost' } },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'host' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'legalName' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'expensePolicy' } },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'location' },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        { kind: 'Field', name: { kind: 'Name', value: 'address' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'country' } },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'payeeLocation' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'address' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'country' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'items' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'incurredAt' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'url' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'amountV2' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'valueInCents' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'currency' } },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'exchangeRate' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'Field', name: { kind: 'Name', value: 'fromCurrency' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'toCurrency' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'value' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'date' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'isApproximate' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'source' } },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ExpenseInvoiceQuery, ExpenseInvoiceQueryVariables>;
export const TransactionInvoiceDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'TransactionInvoice' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'transactionId' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'transaction' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'transactionId' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                { kind: 'Field', name: { kind: 'Name', value: 'kind' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'permissions' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'Field', name: { kind: 'Name', value: 'canDownloadInvoice' } }],
                  },
                },
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'ReceiptTransactionFragment' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Debit' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'oppositeTransaction' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'kind' } },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'permissions' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [{ kind: 'Field', name: { kind: 'Name', value: 'canDownloadInvoice' } }],
                              },
                            },
                            { kind: 'FragmentSpread', name: { kind: 'Name', value: 'ReceiptTransactionFragment' } },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ReceiptTransactionHostFieldsFragment' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Account' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'legalName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'currency' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'imageUrl' },
            arguments: [
              { kind: 'Argument', name: { kind: 'Name', value: 'height' }, value: { kind: 'IntValue', value: '200' } },
            ],
          },
          { kind: 'Field', name: { kind: 'Name', value: 'website' } },
          { kind: 'Field', name: { kind: 'Name', value: 'settings' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'location' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'address' } },
                { kind: 'Field', name: { kind: 'Name', value: 'country' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ReceiptTransactionFragment' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Transaction' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'kind' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'clearedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'hostCurrencyFxRate' } },
          { kind: 'Field', name: { kind: 'Name', value: 'invoiceTemplate' } },
          { kind: 'Field', name: { kind: 'Name', value: 'isRefund' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'host' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'ReceiptTransactionHostFieldsFragment' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'oppositeTransaction' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'host' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'FragmentSpread', name: { kind: 'Name', value: 'ReceiptTransactionHostFieldsFragment' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'amount' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'valueInCents' } },
                { kind: 'Field', name: { kind: 'Name', value: 'currency' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'amountInHostCurrency' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'valueInCents' } },
                { kind: 'Field', name: { kind: 'Name', value: 'currency' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'netAmount' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'valueInCents' } },
                { kind: 'Field', name: { kind: 'Name', value: 'currency' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'taxAmount' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'valueInCents' } },
                { kind: 'Field', name: { kind: 'Name', value: 'currency' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'taxInfo' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                { kind: 'Field', name: { kind: 'Name', value: 'rate' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'paymentMethod' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                { kind: 'Field', name: { kind: 'Name', value: 'service' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'fromAccount' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'legalName' } },
                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                { kind: 'Field', name: { kind: 'Name', value: 'settings' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'location' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'address' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'country' } },
                    ],
                  },
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'AccountWithHost' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'host' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'legalName' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'expensePolicy' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'settings' } },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'location' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'Field', name: { kind: 'Name', value: 'address' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'country' } },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'toAccount' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                { kind: 'Field', name: { kind: 'Name', value: 'legalName' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                { kind: 'Field', name: { kind: 'Name', value: 'settings' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'location' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'address' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'country' } },
                    ],
                  },
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Event' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'startsAt' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'endsAt' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'timezone' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'giftCardEmitterAccount' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'legalName' } },
                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'isRefund' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'refundTransaction' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'id' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'order' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'legacyId' } },
                { kind: 'Field', name: { kind: 'Name', value: 'data' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'tax' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'rate' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'percentage' } },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'quantity' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'tier' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'invoiceTemplate' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<TransactionInvoiceQuery, TransactionInvoiceQueryVariables>;
export const InvoiceByDateRangeDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'InvoiceByDateRange' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'fromCollectiveSlug' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'hostSlug' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'dateFrom' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'DateTime' } } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'dateTo' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'DateTime' } } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'hasExpense' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Boolean' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'host' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'slug' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'hostSlug' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'ReceiptTransactionHostFieldsFragment' } },
              ],
            },
          },
          {
            kind: 'Field',
            alias: { kind: 'Name', value: 'fromAccount' },
            name: { kind: 'Name', value: 'account' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'slug' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'fromCollectiveSlug' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'legalName' } },
                { kind: 'Field', name: { kind: 'Name', value: 'currency' } },
                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'permissions' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'canDownloadPaymentReceipts' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'Field', name: { kind: 'Name', value: 'allowed' } }],
                        },
                      },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'settings' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'location' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'address' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'country' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'transactions' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'fromAccount' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'slug' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'fromCollectiveSlug' } },
                    },
                  ],
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'host' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'slug' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'hostSlug' } },
                    },
                  ],
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'dateFrom' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'dateFrom' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'dateTo' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'dateTo' } },
              },
              { kind: 'Argument', name: { kind: 'Name', value: 'limit' }, value: { kind: 'IntValue', value: '1000' } },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'includeIncognitoTransactions' },
                value: { kind: 'BooleanValue', value: true },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'includeGiftCardTransactions' },
                value: { kind: 'BooleanValue', value: true },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'hasExpense' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'hasExpense' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'kind' },
                value: {
                  kind: 'ListValue',
                  values: [
                    { kind: 'EnumValue', value: 'CONTRIBUTION' },
                    { kind: 'EnumValue', value: 'PLATFORM_TIP' },
                    { kind: 'EnumValue', value: 'ADDED_FUNDS' },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'totalCount' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'nodes' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'FragmentSpread', name: { kind: 'Name', value: 'ReceiptTransactionFragment' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ReceiptTransactionHostFieldsFragment' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Account' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'legalName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'currency' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'imageUrl' },
            arguments: [
              { kind: 'Argument', name: { kind: 'Name', value: 'height' }, value: { kind: 'IntValue', value: '200' } },
            ],
          },
          { kind: 'Field', name: { kind: 'Name', value: 'website' } },
          { kind: 'Field', name: { kind: 'Name', value: 'settings' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'location' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'address' } },
                { kind: 'Field', name: { kind: 'Name', value: 'country' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ReceiptTransactionFragment' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Transaction' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'kind' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'clearedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'hostCurrencyFxRate' } },
          { kind: 'Field', name: { kind: 'Name', value: 'invoiceTemplate' } },
          { kind: 'Field', name: { kind: 'Name', value: 'isRefund' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'host' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'ReceiptTransactionHostFieldsFragment' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'oppositeTransaction' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'host' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'FragmentSpread', name: { kind: 'Name', value: 'ReceiptTransactionHostFieldsFragment' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'amount' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'valueInCents' } },
                { kind: 'Field', name: { kind: 'Name', value: 'currency' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'amountInHostCurrency' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'valueInCents' } },
                { kind: 'Field', name: { kind: 'Name', value: 'currency' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'netAmount' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'valueInCents' } },
                { kind: 'Field', name: { kind: 'Name', value: 'currency' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'taxAmount' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'valueInCents' } },
                { kind: 'Field', name: { kind: 'Name', value: 'currency' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'taxInfo' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                { kind: 'Field', name: { kind: 'Name', value: 'rate' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'paymentMethod' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                { kind: 'Field', name: { kind: 'Name', value: 'service' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'fromAccount' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'legalName' } },
                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                { kind: 'Field', name: { kind: 'Name', value: 'settings' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'location' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'address' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'country' } },
                    ],
                  },
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'AccountWithHost' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'host' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'legalName' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'expensePolicy' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'settings' } },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'location' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'Field', name: { kind: 'Name', value: 'address' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'country' } },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'toAccount' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                { kind: 'Field', name: { kind: 'Name', value: 'legalName' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                { kind: 'Field', name: { kind: 'Name', value: 'settings' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'location' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'address' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'country' } },
                    ],
                  },
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Event' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'startsAt' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'endsAt' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'timezone' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'giftCardEmitterAccount' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'legalName' } },
                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'isRefund' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'refundTransaction' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'id' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'order' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'legacyId' } },
                { kind: 'Field', name: { kind: 'Name', value: 'data' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'tax' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'rate' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'percentage' } },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'quantity' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'tier' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'invoiceTemplate' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<InvoiceByDateRangeQuery, InvoiceByDateRangeQueryVariables>;
