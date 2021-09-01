import PropTypes from 'prop-types';

/**
 * Displays the name for an account, using its legal name if available.
 */
const AccountName = ({ account }) => {
  if (account.legalName && account.name) {
    return `${account.legalName} (${account.name})`;
  } else {
    return account.legalName || account.name || account.slug;
  }
};

AccountName.propTypes = {
  account: PropTypes.shape({
    name: PropTypes.string.isRequired,
    legalName: PropTypes.string,
  }).isRequired,
};

export default AccountName;
