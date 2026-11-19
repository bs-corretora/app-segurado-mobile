import { ST } from '../constants/data'

export const Selo = ({ s }) => <span className={`tag ${ST[s][1]}`}>{ST[s][0]}</span>