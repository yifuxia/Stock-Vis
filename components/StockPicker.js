import React from 'react';

var stock_name_map={
	'AAPL':'Apple',
	'AXP':'American Express',
	'BA':'Boeing',
	'CAT':'Caterpillar',
	'CSCO':'Cisco Systems',
	'CVX':'Chevron',
	'KO':'Coca-Cola',
	'DD':'DuPont',
	'XOM':'ExxonMobil',
	'GE':'General Electric',
	'GS':'Goldman Sachs',
    'HD':'Home Depot',
    'IBM':'IBM',
    'INTC':'Intel',
    'JNJ':'Johnson & Johnson',
    'JPM':'JPMorgan Chase',
    'MCD':'McDonald\'s',
    'MMM':'3M Company',
    'MRK':'Merck',
    'MSFT':'Microsoft',
    'NKE':'Nike',
    'PFE':'Pfizer',
    'PG':'Procter & Gamble',
    'TRV':'The Travelers',
    'UNH':'UnitedHealth',
    'UTX':'United Technologies',
    'V':'Visa',
    'VZ':'Verizon',
    'WMT':'Wal-Mart',
    'DIS':'Walt Disney'
}

//Render options
var options=[]
for(var key in stock_name_map) {
	if(stock_name_map.hasOwnProperty(key)) {
		options.push(<option value={key} key={key}>{stock_name_map[key]}</option>)
	}
}

export default class StockPicker extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
  	const { onChange } = this.props
    return (
            <div>
            	<select id="stock_selector" onChange={onChange}>
            		{options}
				</select> 
            </div> 
    );
  }
}