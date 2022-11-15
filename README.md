# cmdlog

<div>
  <br>
</div>


**Install :**

- install depedencies npm install or yarn
- make sure to setting --max_old_space_size=8096 | 8 Giga to free unused memory
    
    - terminal `export NODE_OPTIONS=--max_old_space_size=8096` or
    - windows `set NODE_OPTIONS=--max_old_space_size=8096`

- download csv file [transactions.csv](https://s3-ap-southeast-1.amazonaws.com/static.propine.com/transactions.csv.zip) and save the file in the source folder
- npm start `to build source on dist/ folder`
- npm build-bin `to build binary app.exe file with max_old_space_size=8096`


------------------------------------------------------------


**Run command-line :**

- run with node `node dist/app.js`
- run with binary file `./app or app`

------------------------------------------------------------

**Run and execute command-line or with binary app.exe file on windows :**

- $ ./app
- $ node dist/app.js

     `Given no parameters, return the latest portfolio value per token in USD`

```JSON
[
    {
        timestamp: '1571967208',
        transaction_type: 'DEPOSIT',
        token: 'BTC',
        amount: '0.298660',
        amountUSD: '5003.8272916'
    },
    {
        timestamp: '1571967200',
        transaction_type: 'DEPOSIT',
        token: 'ETH',
        amount: '0.683640',
        amountUSD: '860.2652304'
    },
    {
        timestamp: '1571967150',
        transaction_type: 'DEPOSIT',
        token: 'XRP',
        amount: '0.693272',
        amountUSD: '0.2617795072'
    }
]

time elapsed =>  2:13  minute
```

- $ ./app --token BTC
- $ node dist/app.js --token BTC

    `Given a token, return the latest portfolio value for that token in USD`

```JSON
{
  timestamp: '1571967208',
  transaction_type: 'DEPOSIT',
  token: 'BTC',
  amount: '0.298660',
  amountUSD: '4993.8371146'
}


time elapsed =>  2:16  minute
```

- $ ./app --date 10/25/2019 
- $ node dist/app.js --date 10/25/2019 

    `MM/DD/YYYY`

    `Given a date, return the portfolio value per token in USD on that date`

```
[
    {
        timestamp: '1571967208',
        transaction_type: 'DEPOSIT',
        token: 'BTC',
        amount: '0.298660',
        amountUSD: '4988.5896584'
    },
    {
        timestamp: '1571967200',
        transaction_type: 'DEPOSIT',
        token: 'ETH',
        amount: '0.683640',
        amountUSD: '856.8880488000001'
    },
    {
        timestamp: '1571967189',
        transaction_type: 'WITHDRAWAL',
        token: 'ETH',
        amount: '0.493839',
        amountUSD: '618.98767938'
    },
    {
        timestamp: '1571967150',
        transaction_type: 'DEPOSIT',
        token: 'XRP',
        amount: '0.693272',
        amountUSD: '0.2631660512'
    },
    ... more items
]


time elapsed =>  2:13  minute
```

- $ ./app --date 10/25/2019 --token BTC
- $ node dist/app.js --date 10/25/2019 --token BTC

    `MM/DD/YYYY`

    `Given a date and a token, return the portfolio value of that token in USD on that date`

```JSON
[
    {
        timestamp: '1571967208',
        transaction_type: 'DEPOSIT',
        token: 'BTC',
        amount: '0.298660',
        amountUSD: '4976.0130858'
    },
    {
        timestamp: '1571966685',
        transaction_type: 'DEPOSIT',
        token: 'BTC',
        amount: '0.658794',
        amountUSD: '10976.252477220001'
    },
    {
        timestamp: '1571966568',
        transaction_type: 'DEPOSIT',
        token: 'BTC',
        amount: '0.630386',
        amountUSD: '10502.94309618'
    },
    {
        timestamp: '1571966566',
        transaction_type: 'DEPOSIT',
        token: 'BTC',
        amount: '0.985879',
        amountUSD: '16425.85818327'
    },
    ... more items
]


time elapsed =>  2:11  minute
```
------------------------------------------------------------

