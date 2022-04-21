import { StateType as AccountStateType } from '@ducks/account';
import { StateType as CoinType } from '@ducks/coin';
import { StateType as ConfigType } from '@ducks/config';
import { StateType as UmillType } from '@ducks/umill';

type StateType = {
  account: AccountStateType
  coin: CoinType
  config: ConfigType
  umill: UmillType
};

export default StateType;
