import * as React from 'react';
import * as PropTypes from 'prop-types';
import { Currency } from 'toolkit-reports/common/components/currency';
import './styles.scss';

export const Legend = props => (
  <React.Fragment>
    <div className="tk-mg-05 tk-pd-r-1 tk-border-r">
      <div className="tk-flex tk-mg-b-05 tk-align-items-center">
        <div className="tk-net-worth-legend__icon-debts" />
        <div className="tk-mg-l-05">Debts</div>
      </div>
      <div>
        <Currency value={props.debts} />
      </div>
    </div>
    <div className="tk-mg-05 tk-pd-r-1 tk-border-r">
      <div className="tk-flex tk-mg-b-05 tk-align-items-center">
        <div className="tk-net-worth-legend__icon-assets" />
        <div className="tk-mg-l-05">Assets</div>
      </div>
      <div>
        <Currency value={props.assets} />
      </div>
    </div>
    <div className="tk-mg-05 tk-pd-r-1">
      <div className="tk-flex tk-mg-b-05 tk-align-items-center">
        <div className="tk-net-worth-legend__icon-net-worths" />
        <div className="tk-mg-l-05">Net Worth</div>
      </div>
      <div>
        <Currency value={props.netWorth} />
      </div>
    </div>
  </React.Fragment>
);

Legend.propTypes = {
  assets: PropTypes.number.isRequired,
  debts: PropTypes.number.isRequired,
  netWorth: PropTypes.number.isRequired,
};
