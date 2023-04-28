import PropTypes from 'prop-types';

/**
 * Displays the name for an account, using its legal name if available.
 */
const AccountName = ({ account }) => {
  return account.legalName || account.name || account.slug || 'Incognito';
};

AccountName.propTypes = {
  account: PropTypes.shape({
    name: PropTypes.string.isRequired,
    legalName: PropTypes.string,
  }).isRequired,
};

export default AccountName;
